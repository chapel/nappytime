var _ = require('lodash')
  , Yelp = require('yelp');

var yelp = Yelp.createClient({
  consumer_key: 'rlm-bHN4rJU7lmhq_AhsCg',
  consumer_secret: 'GcAt39iGZf4s5M1YBpq3Fpporjc',
  token: 'MAeeMz6IXEyOi_nRBTfwqOD9ELGs0i7R',
  token_secret: 'kYTJgE1rFnwoIrVGoIBCluJTGYQ'
});

var indexRouter = module.exports = {
  path: '/',
  method: 'GET',
  handler: function (req) {
    yelp.search({term: 'restaurants', location: '444 Castro St Mountain View', sort: 1, radius_filter: 8000}, function (err, data) {
      var context = _.extend({
        restaurants: data.businesses
      }, req.server.app.commonContext);
      req.reply.view('pages/index', context);
    });
  }
};