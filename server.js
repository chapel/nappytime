// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
require('nko')('fYjH9Hq69TrED2ao');

var Hapi = require('hapi');
var cloak = require('cloak');

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

var server = Hapi.createServer('localhost', port, hapiOptions);

cloak.configure({
  port: 8080,
  messages: {
    test: function (msg, user) {
      user.getRoom().messageMembers('test', msg);
    }
  }
});

cloak.run();

var staticRouter = {
  path: '/{path*}',
  method: 'GET',
  handler: {
    directory: {
      path: './public/'
    }
  }
};

var indexRouter = {
  path: '/',
  method: 'GET',
  handler: function (req) {
    var context = {
      title: 'Nappytime Project'
    };
    req.reply.view('pages/index', context);
  }
}

server.route([ indexRouter, staticRouter ]);

server.pack.require('bucker', function (err) {
  if (err) console.error('failed loading bucker');
});

server.start(function (err) {
  if (err) { console.error(err); process.exit(-1); }

  // if run as root, downgrade to the owner of this file
  if (process.getuid() === 0) {
    require('fs').stat(__filename, function(err, stats) {
      if (err) { return console.error(err); }
      process.setuid(stats.uid);
    });
  }

  console.log('Server running at http://0.0.0.0:' + port + '/');
});
