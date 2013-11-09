var _ = require('lodash')
  , genId = require('gen-id')
  , defaultGenIdFormat = 'XXXX'
  , generators = {};

var generateRoomId = function (format) {
  format = format || defaultGenIdFormat;
  if (!generators[format]) {
    generators[format] = genId(format);
  }
  // TODO: some sort of check against DB to make sure
  // not reusing same id
  return generators[format].generate();
};

var roomRouter = module.exports = {
  path: '/room/{id?}',
  method: 'GET',
  handler: function (req) {
    var context = _.extend({}, req.params, req.server.app.commonContext);
    if (req.params.id) {
      // TODO: see if client is allowed to be in this room
      var clientAllowed = true;
      if (clientAllowed) {
        req.reply.view('pages/room', context);
      } else {
        // TODO: pick interaction to do here
        req.reply.view('pages/room', context);
      }
    } else {
      var newRoomId = generateRoomId();
      req.server.log(['app'], 'Generating a new room with id: ' + newRoomId);
      req.reply.redirect('/room/' + newRoomId);
    }
  }
};