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

exports.submitChoices = function (options, callback) {
  socket.emit(event('pick'), options, callback);
};

exports.onMidVote = function (callback) {
  socket.on(event('midvote'), callback);
};

exports.onWinnerPick = function (callback) {
  socket.on(event('winnerPicked'), callback);
};

exports.sendAction = function (options, callback) {
  socket.emit(event('action'), options, callback);
};
