const {headers} = require('./baseHeader');

function error(statusNumber,res,message) {
  res.writeHead(statusNumber, headers);
  res.write(
    JSON.stringify({
      status: 'false',
      message: message,
    }),
  );
  res.end();
}
module.exports = error;
