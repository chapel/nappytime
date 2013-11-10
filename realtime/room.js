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
  socket.on(event('pick'), onPick);

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
      res.roomId = id;
      res.state = 'new';
      callback(null, res);
    })
  });
}

function onSave(room, callback) {
  var socket = this;

  socket.get('serverId', function (err, id) {
    room.creator.serverId = id;
    async.parallel([
      function (next) {
        db.put('room', room.roomId, room, next);
      }
    ], function (err, data) {
      if (err) {
        return callback(err);
      }
      return callback(null, room.roomId);
    });
  });
}

function onJoin(options, callback) {
  var socket = this;

  socket.join(options.room);

  var tasks = [
    function (next) {
      db.get('room', options.room, next);
    },
    function (next) {
      socket.get('serverId', next);
    }
  ];

  tasks = tasks.concat(setUser(options, socket));

  async.parallel(tasks, function (err, data) {
    var room = data[0];
    var serverId = data[1];
    if (!room) {
      return callback({message: 'Not a valid room', code: 404});
    }

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
        me: {name: options.name, _id: socket.id, creator: serverId === room.creator.serverId},
        current: users,
        room: room
      });
    });
  });
}

function onPick(options, callback) {
  var socket = this;

  if (!options.roundId) {
    utils.generateRoom(function (err, roundId) {
      exports.publish({
        room: options.room,
        event: 'midvote',
        data: {
          roundId: roundId
        }
      });
    });
  } else {

  }
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
    },
    function (next) {
      socket.get('serverId', next);
    }
  ];
}
