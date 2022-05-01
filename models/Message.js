const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  content: { type: String, required: true },
  to: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
});

module.exports = User = mongoose.model('Message', messageSchema);
