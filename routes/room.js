var _ = require('lodash');
var setUserCookie = require('../lib/setUserCookie');
var db = require('../lib/db').defaultDB;

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
  } else {
    db.get('room', context.id, function (err, data) {
      if (data) {
        context.user = request.state.session.user && request.state.session.user.id;
        reply.view('pages/room', context);
      } else {
        reply.redirect('/');
      }
    });
  }
}
