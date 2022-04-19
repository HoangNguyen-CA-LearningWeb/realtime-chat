const jsonwebtoken = require('jsonwebtoken');
const PUB_KEY = Buffer.from(process.env.PUB_KEY, 'base64').toString('utf-8');
const User = require('./models/User');

module.exports = function (io) {
  io.use(async (socket, next) => {
    try {
      const tokenParts = socket.handshake.auth.token.split(' ');
      if (tokenParts[0] !== 'Bearer' || !tokenParts[1]) throw new Error();
      const tokenPayload = jsonwebtoken.verify(tokenParts[1], PUB_KEY, {
        algorithms: ['RS256'],
      });

      const userId = tokenPayload.sub;
      const user = await User.findById(userId);
      socket.user = user; // attach user to request object
      next();
    } catch (e) {
      console.log(e);
      return next(new Error('authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(socket.user._id.toString());
    const users = [];

    for (const socket of io.of('/').sockets.values()) {
      users.push({ userID: socket.user._id, username: socket.user.username });
    }

    socket.emit('users', users);

    // notify existing users
    socket.broadcast.emit('user connected', {
      userID: socket.user._id,
      username: socket.user.username,
    });

    socket.on('private message', ({ content, to }) => {
      console.log(`private message: ${content} to: ${to}`);

      socket.to(to).to(socket.user._id.toString()).emit('private message', {
        content,
        from: socket.user._id,
      });
    });
  });
};
