var io = require('socket.io-client');

var socket = new io.connect('http://localhost:8000');

module.exports = socket;
