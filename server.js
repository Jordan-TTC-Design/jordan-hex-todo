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
    req.on('end', async () => {
      try {
        const id = req.url.split('/').pop();
        const data = JSON.parse(body);
        const targetTodo = await Todo.findByIdAndUpdate(id, data);
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: 'success',
            message: `ID為${id}資料更新成功`,
          }),
        );
        res.end();
      } catch (error) {
        console.log(error);
        errorHandler(res);
      }
    });
  }  else if (req.url === '/todos' && req.method === 'DELETE') {
    await Todo.deleteMany({});
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        message: '全部資料刪除成功',
      }),
    );
    res.end();
  } else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
    const id = req.url.split('/').pop();
    const deleteResult = await Todo.findByIdAndDelete(id);
    if (deleteResult !== null) {
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: 'success',
          message: `ID為${id}資料刪除成功`,
        }),
      );
    } else {
      res.writeHead(400, headers);
      res.write(
        JSON.stringify({
          status: 'false',
          message: `找不到ID為${id}的資料`,
        }),
      );
    }
    res.end();
  }else {
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
