const {headers} = require('./baseHeader');

function resHandler(statusNumber,res,message) {
  res.writeHead(statusNumber, headers);
  res.write(
    JSON.stringify({
      status: 'success',
      message: message,
    }),
  );
  res.end();
}
function resDataHandler(statusNumber,res,message,data) {
  res.writeHead(statusNumber, headers);
  res.write(
    JSON.stringify({
      status: 'success',
      message: message,
      data:data,
    }),
  );
  res.end();
}
module.exports = { resHandler, resDataHandler };
