var socket = require('./realtime');
var utils = require('../../lib/utils');

var event = utils.subEvent('room');

exports.event = event;
exports.socket = socket;

socket.on(event('joined'), function (data) {
  console.log(data);
});

exports.createRoom = function (options, callback) {
  socket.emit(event('create'), options, callback);
  exports.joinRoom({room: '4444', name: 'foo'}, function (err, res) {
    console.log(err, res);
  });
};

exports.joinRoom = function (options, callback) {
  socket.emit(event('join'), options, callback);
};

exports.sendAction = function (options, callback) {
  socket.emit(event('action'), options, callback);
};
