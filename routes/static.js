

var staticRouter = module.exports = {
  path: '/{path*}',
  method: 'GET',
  handler: {
    directory: {
      path: __dirname + '/../public/'
    }
  }
};