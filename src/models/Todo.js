const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  activity_no: { type: String, unique: true, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Unmarked', 'Done', 'Canceled'], default: 'Unmarked' },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Todo', TodoSchema);
