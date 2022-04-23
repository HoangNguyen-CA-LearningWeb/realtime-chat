const { verifyToken } = require('./middleware/auth');
const { db } = require('./models/User');
const User = require('./models/User');

module.exports = function (io) {
  io.use(async (socket, next) => {
    try {
      const tokenParts = socket.handshake.auth.token.split(' ');
      const user = await verifyToken(tokenParts);
      socket.user = user; // attach user to request object
      next();
    } catch (e) {
      return next(new Error('authentication failed'));
    }
  });

  io.on('connection', async (socket) => {
    try {
      socket.user.connected = true;
      await socket.user.save();

      socket.join(socket.user._id.toString());

      //fetch all other users
      const users = [];

      const dbUsers = await User.find({});

      dbUsers.forEach((u) => {
        users.push({
          userID: u._id,
          username: u.username,
          connected: u.connected,
        });
      });

      socket.emit('users', users);

      // notify existing users
      socket.broadcast.emit('user connected', {
        userID: socket.user._id,
        username: socket.user.username,
        connected: true,
      });

      socket.on('private message', ({ content, to }) => {
        socket.to(to).to(socket.user._id.toString()).emit('private message', {
          content,
          from: socket.user._id,
          to,
        });
      });

      socket.on('disconnect', async () => {
        const matchingSockets = await io.in(socket.user_id).allSockets();
        const isDisconnected = matchingSockets.size === 0;
        if (isDisconnected) {
          socket.broadcast.emit('user disconnected', socket.user._id);
          // update in DB.
          socket.user.connected = false;
          await socket.user.save();
        }
      });
    } catch (e) {
      console.log(e);
    }
  });
};
