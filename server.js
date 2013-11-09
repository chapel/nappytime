// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
require('nko')('fYjH9Hq69TrED2ao');

var isProduction = (process.env.NODE_ENV === 'production');
var Hapi = require('hapi');
var port = (isProduction ? 80 : 8000);

var server = Hapi.createServer('localhost', port);

server.route({
  path: '/{path*}',
  method: 'GET',
  /*
  handler: function (request, reply) {
    var voteko = '<iframe src="http://nodeknockout.com/iframe/nappytime" frameborder=0 scrolling=no allowtransparency=true width=115 height=25></iframe>';
    reply('<html><body>' + voteko + '</body></html>\n');
  }
  */
  handler: {
    directory: {
      path: './public/'
    }
  }
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
