var io = require('socket.io-client');

var socket = new io.connect('', {'connect timeout': 1000, 'sync disconnect on unload': true});

module.exports = socket;
