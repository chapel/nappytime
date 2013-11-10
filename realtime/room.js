var yelp = require('../lib/yelp');
var utils = require('../lib/serverUtils');
var db = require('../lib/db');
var async = require('async');
var _ = require('lodash');

var event = utils.subEvent('room');

var io;

exports.attach = function (socket, sio) {
  io = sio;

  socket.on(event('create'), onCreate);
  socket.on(event('join'), onJoin);

  socket.on('disconnect', onDisconnect);
  socket.on('leave', onDisconnect);
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

function onDisconnect() {
  var socket = this;

  var rooms = io.sockets.manager.roomClients[socket.id];
  if (!rooms) {
    return false;
  }

  socket.get('name', function (err, name) {
    _.each(rooms, function (val, room) {
      room = room.substr(1);
      if (room === '') {
        return false;
      }
      usersInRoom(room, function (err, users) {
        exports.publish({
          room: room,
          event: 'left',
          data: {
            left: {name: name},
            current: users
          }
        });
      });
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
