var yelp = require('../lib/yelp');
var utils = require('../lib/serverUtils');
var db = require('../lib/db').defaultDB;
var async = require('async');
var _ = require('lodash');

var event = utils.subEvent('room');

var io;

var votingRooms = {};

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

    res.state = 'new';
    callback(null, res);
  });
}

function onSave(room, callback) {
  var socket = this;

  utils.generateRoom(function (err, roomId) {
    if (err) {
      return callback(err);
    }
    room.roomId = roomId;
    socket.get('serverId', function (err, id) {
      room.creator.serverId = id;
      async.parallel([
        function (next) {
          db.put('room', roomId, room, next);
        }
      ], function (err, data) {
        if (err) {
          return callback(err);
        }
        return callback(null, roomId);
      });
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
        room: room,
      });

      var voting = votingRooms[room];
      if (!voting) {
        return;
      }

      if (voting.winner) {
        socket.emit(event('winnerPicked'), {winner: voting.winner});
      } else if (voting.midvote) {
        socket.emit(event('midvote'), voting.midvote);
      }
    });
  });
}

function onPick(options, callback) {
  var socket = this;

  if (!votingRooms[options.room]) {
    votingRooms[options.room] = {
      midvote: {
        startedBy: socket.id,
        startedAt: new Date()
      },
      winner: null,
      timer: null
    };

    exports.publish({
      room: options.room,
      event: 'midvote',
      data: {
        startedBy: socket.id,
        startedAt: new Date()
      }
    });
  }

  var voting = votingRooms[options.room];

  if (voting.winner) {
    return callback({message: 'Winner already chosen'});
  }

  voting.timer = setTimeout(function () {
    usersInRoom(options.room, function (err, users) {
      var vetoes = [];
      var votes = [];
      users.forEach(function (vote) {
        if (!vote) {
          return false;
        }
        vetoes = _.uniq(vetoes.concat(vote.vetoes));
        votes = votes.concat(vote.vote);
      });
      votes = _.countBy(votes);
      var highest = -1;
      var winner;
      _.each(votes, function (count, key) {
        if (count > highest) {
          winner = key;
          highest = count;
        }
      });
      exports.publish({
        room: options.room,
        event: 'winnerPicked',
        data: {
          winner: winner
        }
      });
      voting.midvote = null;
      voting.winner = winner;
    }, true);
  }, 4 * 1000);

  var pick = {
    vetoes: []
  };
  pick = options.categories.reduce(function (pick, cat, i) {
    if (cat.veto) {
      pick.vetoes.push(i);
    }
    var vote = _.findIndex(cat.restaurants, function (rest) {
      return rest.roundChosen;
    })
    if (vote > -1) {
      pick.vote = i + ':' + vote;
    }
    return pick;
  }, pick);
  socket.set('vote', pick, function (err) {
    callback(null, 'Successfully voted');
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

function usersInRoom(room, callback, votes) {
  var sockets = io.sockets.clients(room);

  async.map(sockets, iterator, callback);

  function iterator(socket, next) {
    if (votes) {
      return socket.get('vote', next);
    }
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
