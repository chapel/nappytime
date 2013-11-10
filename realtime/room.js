var yelp = require('../lib/yelp');
var utils = require('../lib/serverUtils');
var db = require('../lib/db').defaultDB;
var async = require('async');
var _ = require('lodash');

var event = utils.subEvent('room');

var io;

exports.attach = function (socket, sio) {
  io = sio;

  socket.on(event('create'), onCreate);
  socket.on(event('join'), onJoin);
  socket.on(event('save'), onSave);

  socket.on('disconnect', onDisconnect);
  socket.on('leave', onDisconnect);
};

exports.publish = function (options, socket) {
  if (socket) {
    return socket.broadcast.to(options.room).emit(event(options.event), options.data);
  }

  return io.sockets.in(options.room).emit(event(options.event), options.data);
};

function onCreate(options, callback) {
  var location = options.location;
  var roomname = options.roomname;

  yelp.defaultSearch({location: location}, function (err, res) {
    if (err) {
      return callback('Problem finding restaurants');
    }

    utils.generateRoom(function (err, id) {
      if (err) {
        return callback(err);
      }
      res.room = id;
      res.state = 'new';
      callback(null, res);
    })
  });
}

function onSave(room, callback) {
  // cleanup data
  if (room.categories && room.categories.length) {
    room.categories.forEach(function (cat) {
      if (cat.restaurants && cat.restaurants.length) {
        cat.restaurants.forEach(function (eat) {
          delete eat.chosen;
        });
      }
    });
  }
  async.parallel([
    function (next) {
      db.put('room', room.roomId, room, next);
    },
    function (next) {
      db.put('user', room.creator._id, room.creator, next);
    }
  ], function (err, data) {
    if (err) {
      return callback(err);
    }
    return callback(null, room.roomId + ' was saved!');
  });
}

function onJoin(options, callback) {
  var socket = this;

  socket.join(options.room);

  async.parallel(setUser(options, socket), function (err, data) {
    usersInRoom(options.room, function (err, users) {
      exports.publish({
        room: options.room,
        event: 'joined',
        data: {
          joined: {name: options.name, _id: socket.id},
          current: users
        }
      }, socket);

      callback(null, {
        me: {name: options.name, _id: socket.id},
        current: users
      });
    });
  });
}

function onDisconnect() {
  var socket = this;

  async.parallel(getUser(socket), function (err, data) {
    var name = data[0];
    var room = data[1];
    usersInRoom(room, function (err, users) {
      users = _.filter(users, function (user) {
        return user._id !== socket.id;
      });
      exports.publish({
        room: room,
        event: 'left',
        data: {
          left: {name: name, _id: socket.id},
          current: users
        }
      });
    });
  });
}

function usersInRoom(room, callback) {
  var sockets = io.sockets.clients(room);

  async.map(sockets, iterator, callback);

  function iterator(socket, next) {
    socket.get('name', function (err, name) {
      next(err, {name: name, _id: socket.id});
    });
  }
}

function setUser(data, socket) {
  return [
    function (next) {
      socket.set('name', data.name, next);
    },
    function (next) {
      socket.set('room', data.room, next);
    }
  ];
}

function getUser(socket) {
  return [
    function (next) {
      socket.get('name', next);
    },
    function (next) {
      socket.get('room', next);
    }
  ];
}
