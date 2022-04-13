const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, '內容必填'],
    },
    completed: Boolean,
    updatedAt:{
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);
// 新增一個model
const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;

