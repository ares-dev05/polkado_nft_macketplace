
const getTime = function () {
  const date = new Date();
  return date.toISOString()?.split('T')[1]?.split('.')[0];
}

const getDay = function() {
  const date = new Date();
  return date.toISOString()?.split('T')[0];
}

function log(operation, status = "") {
  console.log(`${getDay()} ${getTime()}: ${operation}${status.length > 0?',':''}${status}`);
}

module.exports = log
