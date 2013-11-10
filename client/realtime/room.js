var socket = require('./realtime');
var utils = require('../../lib/utils');

var event = utils.subEvent('room');

socket.on(event('joined'), function (res) {
  console.log(res);
});

exports.createRoom = function (options, callback) {
  socket.emit(event('create'), options, function (err, res) {
    callback(err, res);
    socket.emit('join', {room: 'test', name: 'foo'});
  });
};
