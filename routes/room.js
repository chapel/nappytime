var _ = require('lodash');

var roomRouter = module.exports = {
  path: '/room/{id?}',
  method: 'GET',
  handler: function (req) {
    var context = _.extend({}, req.params, req.server.app.commonContext);
    req.reply.view('pages/room', context);
  }
};