var io = require('socket.io-client');

var socket = new io.connect('', {'connect timeout': 1000, 'sync disconnect on unload': true});

socket.on('connect', function () {
  if (typeof ___user !== 'undefined') {
    socket.emit('register', {user: ___user});
  }
});
module.exports = socket;
