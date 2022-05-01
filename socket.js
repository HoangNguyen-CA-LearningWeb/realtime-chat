const { verifyToken } = require('./middleware/auth');
const User = require('./models/User');
const Message = require('./models/Message');

module.exports = function (io) {
  io.use(async (socket, next) => {
    try {
      const tokenParts = socket.handshake.auth.token.split(' ');
      const user = await verifyToken(tokenParts);
      if (!user) throw new Error('Token user not found');
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

      const messagesMap = new Map();
      const messages = await Message.find({
        $or: [{ from: socket.user._id }, { to: socket.user._id }],
      });

      messages.forEach((message) => {
        const { from, to } = message;
        let receive;
        if (to === socket.user._id) receive = to.toString();
        else receive = from.toString();
        if (messagesMap.has(receive)) {
          messagesMap.get(receive).push(message);
        } else {
          messagesMap.set(receive, [message]);
        }
      });

      dbUsers.forEach((u) => {
        users.push({
          userID: u._id,
          username: u.username,
          connected: u.connected,
          messages: messagesMap.get(u._id.toString()) || [],
        });
      });

      socket.emit('users', users);

      // notify existing users
      socket.broadcast.emit('user connected', {
        userID: socket.user._id,
        username: socket.user.username,
        connected: true,
      });

      socket.on('private message', async ({ content, to }) => {
        // send to own room to send to other browsers logged on to same user, is not sent to current socket!
        const message = {
          content,
          from: socket.user._id,
          to,
        };
        socket
          .to(to)
          .to(socket.user._id.toString())
          .emit('private message', message);

        const dbMessage = new Message({ content, to, from: socket.user._id });
        await dbMessage.save();
      });

      socket.on('disconnect', async () => {
        const matchingSockets = await io.in(socket.user_id).allSockets();
        const isDisconnected = matchingSockets.size === 0;
        if (isDisconnected) {
          socket.broadcast.emit('user disconnected', socket.user._id);
          socket.user.connected = false; // update in DB.
          await socket.user.save();
        }
      });
    } catch (e) {
      console.log(e);
    }
  });
};
