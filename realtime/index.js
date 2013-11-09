var socketio = require('socket.io');

var realtime = {};

function onConnection(socket) {
  socket.emit('update', 'foobar');
}

module.exports = function wrapper(http) {
  realtime.io = socketio.listen(http);

  realtime.io.sockets.on('connection', onConnection);

  return realtime;
};
