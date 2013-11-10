var socketio = require('socket.io');
var utils = require('../lib/serverUtils');

var handlers = utils.requireDir(__dirname, ['index.js']);

var realtime = {};

function onConnection(socket) {
  socket.on('register', function (data) {
    if (data.user.length !== 5) {
      return;
    }
    socket.get('serverId', function (err, id) {
      if (id) {
        return;
      }
      socket.set('serverId', data.user);
    });
  });

  handlers.forEach(function (handler) {
    handler.attach(socket, realtime.io);
  });
}

module.exports = function wrapper(http) {
  realtime.io = socketio.listen(http);

  realtime.io.enable('browser client minification');
  realtime.io.enable('browser client etag');
  realtime.io.enable('browser client gzip');
  realtime.io.set('log level', 1);

  realtime.io.set('transports', [
    'websocket',
    'htmlfile',
    'xhr-polling',
    'jsonp-polling'
  ]);

  realtime.io.sockets.on('connection', onConnection);

  return realtime;
};
