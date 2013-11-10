var _ = require('lodash');
var setUserCookie = require('../lib/setUserCookie');

module.exports = {
  path: '/room/new',
  method: 'GET',
  config: {
    handler: routeHandler,
    pre: [setUserCookie]
  }
};

function routeHandler(request, reply) {
  var context = _.extend({}, request.query, request.params, request.server.app.commonContext);
  context.user = request.state.session.user && request.state.session.user.id;
  context.hasCoords = context.lat && context.lng ? true : false;
  reply.view('pages/room', context);
}
