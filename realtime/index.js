var socketio = require('socket.io');
var utils = require('../lib/utils');

var handlers = utils.requireDir(__dirname, ['index.js']);

var realtime = {};

function onConnection(socket) {
  handlers.forEach(function (handler) {
    handler.attach(socket);
  });
}

module.exports = function wrapper(http) {
  realtime.io = socketio.listen(http);

  realtime.io.sockets.on('connection', onConnection);

  return realtime;
};
