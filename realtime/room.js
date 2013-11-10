var yelp = require('../lib/yelp');
var utils = require('../lib/serverUtils');

var event = utils.subEvent('room');

var socket;

exports.attach = function (sock) {
  socket = sock;

  socket.on(event('create'), onCreate);
  socket.on(event('join'), onJoin);
};

exports.publish = function (options) {
  return socket.broadcast.to(options.room).emit(event(options.event), options.data);
};

function onCreate(options, callback) {
  var location = options.location;
  var name = options.name;

  yelp.defaultSearch({location: location}, function (err, res) {
    if (err) {
      return callback('Problem finding restaurants');
    }

    callback(null, res);
  });
}

function onJoin(options) {
  var socket = this;

  socket.join(options.room);

  exports.publish({
    room: options.room,
    event: 'joined',
    data: {
      name: options.name
    }
  });
}
