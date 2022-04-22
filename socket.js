const { verifyToken } = require('./middleware/auth');

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
      socket.to(to).to(socket.user._id.toString()).emit('private message', {
        content,
        from: socket.user._id,
      });
    });

    socket.on('disconnect', async () => {
      const matchingSockets = await io.in(socket.user_id).allSockets();
      const isDisconnected = matchingSockets.size === 0;
      if (isDisconnected) {
        socket.broadcast.emit('user disconnected', socket.user._id);
      }
    });
  });
};
