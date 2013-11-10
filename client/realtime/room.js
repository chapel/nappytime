var socket = require('./realtime');
var utils = require('../../lib/utils');

var event = utils.subEvent('room');

exports.event = event;
exports.socket = socket;

exports.onJoined = function (callback) {
  socket.on(event('joined'), callback);
};

exports.onLeft = function (callback) {
  socket.on(event('left'), callback);
};

exports.createRoom = function (options, callback) {
  socket.emit(event('create'), options, callback);
};

exports.joinRoom = function (options, callback) {
  socket.emit(event('join'), options, callback);
};

exports.saveRoom = function (options, callback) {
  socket.emit(event('save'), options, callback);
};

exports.loadRoom = function (options, callback) {
  socket.emit(event('load'), options, callback);
};

exports.sendAction = function (options, callback) {
  socket.emit(event('action'), options, callback);
};
