const http = require('http');
const Todo = require('./models/todo');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { headers } = require('./baseHeader');
const errorHandler = require('./errorHandler');
const { resHandler, resDataHandler } = require('./resHandler');

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

const requestListener = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  if (req.url === '/todos' && req.method === 'GET') {
    const data = await Todo.find();
    resDataHandler(200, res, '成功取得所有資料', data);
  } else if (req.url === '/todos' && req.method === 'POST') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        await Todo.create({
          content: data.content,
          completed: data.completed,
        });
        resHandler(200,res,'成功新增一筆資料');
      } catch (error) {
        console.log(error);
        errorHandler(400, res, error.message);
      }
    });
  } else if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
    req.on('end', async () => {
      try {
        const id = req.url.split('/').pop();
        const data = JSON.parse(body);
        const targetTodo = await Todo.findByIdAndUpdate(id, data);
        resHandler(200,res,`ID為${id}資料更新成功`);
      } catch (error) {
        console.log(error);
        errorHandler(400, res, error.message);
      }
    });
  } else if (req.url === '/todos' && req.method === 'DELETE') {
    await Todo.deleteMany({});
    resHandler(200,res,'全部資料刪除成功');
  } else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
    const id = req.url.split('/').pop();
    const deleteResult = await Todo.findByIdAndDelete(id);
    if (deleteResult !== null) {
      resHandler(200,res,`ID為${id}資料刪除成功`);
    } else {
      errorHandler(400, res, `找不到ID為${id}的資料`);
    }
  } else if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else {
    errorHandler(404, res, '找不到頁面');
  }
};
const server = http.createServer(requestListener);
server.listen(process.env.PORT || 8080);
