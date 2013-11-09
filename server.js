// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
require('nko')('fYjH9Hq69TrED2ao');

var Hapi = require('hapi');
var _ = require('lodash');
var realtime = require('./realtime');

var isProduction = (process.env.NODE_ENV === 'production');
var port = (isProduction ? 80 : 8000);

var hapiOptions = {
  views: {
    engines: { 'hbs': 'handlebars' },
    path: __dirname + '/templates',
    partialsPath: __dirname + '/templates/pages',
    layout: true
  }
};

var server = Hapi.createServer('', port, hapiOptions);
// global opts
server.app.commonContext = {
  title: 'Nappytime Project'
};

server.route([ 
  require('./routes/static'), 
  require('./routes/index'), 
  require('./routes/room')
]);

server.pack.require('bucker', function (err) {
  if (err) console.error('failed loading bucker');
});

server.start(function (err) {
  if (err) { console.error(err); process.exit(-1); }

  server.app.realtime = realtime(server.listener);

  // if run as root, downgrade to the owner of this file
  if (process.getuid() === 0) {
    require('fs').stat(__filename, function(err, stats) {
      if (err) { return console.error(err); }
      process.setuid(stats.uid);
    });
  }

  console.log('Server running at http://0.0.0.0:' + port + '/');
});
