var genId = require('gen-id');

var generateUser = genId('XXXXX');

module.exports = function (request, next) {
  var session = request.state.session;
  if (!session) {
    session = {
      user: {id: generateUser.generate()}
    };
  }

  session.last = Date.now();

  request.setState('session', session);

  next('');
};
