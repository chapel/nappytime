var yelp = require('../lib/yelp');
var utils = require('../lib/serverUtils');
var db = require('../lib/db');
var async = require('async');

var event = utils.subEvent('room');

var io;

exports.attach = function (socket, sio) {
  io = sio;

  socket.on(event('create'), onCreate);
  socket.on(event('join'), onJoin);

};

exports.publish = function (options) {
  return io.sockets.in(options.room).emit(event(options.event), options.data);
};

function onCreate(options, callback) {
  var location = options.location;
  var roomname = options.roomname;

  yelp.defaultSearch({location: location}, function (err, res) {
    if (err) {
      return callback('Problem finding restaurants');
    }

    callback(null, res);
  });
}

function onJoin(options, callback) {
  var socket = this;

  socket.set('name', options.name, function (err) {
    socket.join(options.room);

    usersInRoom(options.room, function (err, users) {
      exports.publish({
        room: options.room,
        event: 'joined',
        data: {
          joined: {name: options.name},
          current: users
        }
      });

      callback(null, users);
    });
  });
}

function usersInRoom(room, callback) {
  var sockets = io.sockets.clients(room);

  async.map(sockets, iterator, callback);

  function iterator(socket, next) {
    socket.get('name', function (err, name) {
      next(err, {name: name});
    });
  }
}
