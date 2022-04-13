const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB)
  .then(() => {
    console.log('success connected to jordan-hex-todo DB');
  })
  .catch((err) => console.log(err));
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

