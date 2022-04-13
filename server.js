const http = require('http');
const Todo = require('./models/todo');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { headers } = require('./baseHeader');
const errorHandler = require('./errorHandler');

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
  if (req.url === '/') {
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        message: '首頁',
      }),
    );
    res.end();
  } else if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else if (req.url === '/todos' && req.method === 'GET') {
    const data = await Todo.find();
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        message: '成功取得資料',
        data,
      }),
    );
    res.end();
  } else if (req.url === '/todos' && req.method === 'DELETE') {
    todos.length = 0;
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        message: '成功刪除全部資料',
      }),
    );
    res.end();
  } else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
    const itemId = req.url.split('/').pop();
    const itemIndex = todos.findIndex((item) => item.id === itemId);
    if (itemIndex > -1) {
      todos.splice(itemIndex, 1);
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: 'success',
          message: `成功刪除id為${itemId}的資料`,
        }),
      );
      res.end();
    } else {
      errorHandler(res);
    }
  } else if (req.url === '/todos' && req.method === 'POST') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const newTodo = await Todo.create({
          content: data.content,
          completed: data.completed,
        });
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: 'success',
            message: '成功新增一筆todo',
          }),
        );
        res.end();
      } catch (error) {
        console.log(error);
        errorHandler(res);
      }
    });
  } else if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
    req.on('end', () => {
      try {
        const itemId = req.url.split('/').pop();
        const itemIndex = todos.findIndex((item) => item.id === itemId);
        const title = JSON.parse(body).title;
        if (itemIndex > -1 && title !== undefined) {
          todos[itemIndex].title = title;
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: 'success',
              message: `成功修改id為${itemId}的資料`,
            }),
          );
          res.end();
        } else {
          errorHandler(res);
        }
      } catch (error) {
        console.log(error);
        errorHandler(res);
      }
    });
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: 'false',
        message: '找不到頁面',
      }),
    );
    res.end();
  }
};
const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);
