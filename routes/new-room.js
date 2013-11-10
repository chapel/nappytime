var _ = require('lodash');

module.exports = {
  path: '/room/new',
  method: 'GET',
  handler: routeHandler
}

function routeHandler(request, reply) {
  var context = _.extend({}, request.query, request.params, request.server.app.commonContext);
  request.reply.view('pages/room', context);
}
