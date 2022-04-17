const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const http = require('http');
const app = express();
const cors = require('cors');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const port = process.env.PORT || 5000;
const mongoString =
  process.env.MONGODB_STRING || 'mongodb://localhost/realtime-chat';

mongoose
  .connect(mongoString)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use(morgan('common'));
app.use(express.json());

app.use('/api/users', require('./routes/api/users'));

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error('invalid username'));
  }
  socket.username = username;
  next();
});

io.on('connection', (socket) => {
  const users = [];
  for (let [id, socket] of io.of('/').sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }
  socket.emit('users', users);

  // notify existing users
  socket.broadcast.emit('user connected', {
    userID: socket.id,
    username: socket.username,
  });
});

//custom error handler
app.use((err, req, res, next) => {
  const { status = 500, message = 'Something Went Wrong!' } = err;
  res.status(status).json({ status, error: message });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
