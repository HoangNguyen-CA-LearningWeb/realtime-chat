const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();
require('dotenv').config();

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

app.use(express.json());
app.use(morgan('tiny'));

app.use('/api/users', require('./routes/api/users'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

//custom error handler
app.use((err, req, res, next) => {
  const { status = 500, message = 'Something Went Wrong!' } = err;
  res.status(status).json({ status, error: message });
});

app.listen(port, (req, res) => {
  console.log(`Server listening on port ${port}`);
});
