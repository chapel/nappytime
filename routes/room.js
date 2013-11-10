var _ = require('lodash');
var setUserCookie = require('../lib/setUserCookie');

var roomRouter = module.exports = {
  path: '/room/{id?}',
  method: 'GET',
  config: {
    handler: routeHandler,
    pre: [setUserCookie]
  }
};
function routeHandler(request, reply) {
  var context = _.extend({}, request.params, request.server.app.commonContext);
  if (!context.id) {
    reply.redirect('/');
  }
  context.user = request.state.session.user.id;

  reply.view('pages/room', context);
}
