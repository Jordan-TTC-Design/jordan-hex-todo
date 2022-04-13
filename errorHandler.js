const {headers} = require('./baseHeader');

function error(res) {
  res.writeHead(400, headers);
  res.write(
    JSON.stringify({
      status: 'false',
      message: '欄位錯誤或id不對',
    }),
  );
  res.end();
}
module.exports = error;
