var _ = require('lodash');
var Yelp = require('yelp');

var yelp = Yelp.createClient({
  consumer_key: 'rlm-bHN4rJU7lmhq_AhsCg',
  consumer_secret: 'GcAt39iGZf4s5M1YBpq3Fpporjc',
  token: 'MAeeMz6IXEyOi_nRBTfwqOD9ELGs0i7R',
  token_secret: 'kYTJgE1rFnwoIrVGoIBCluJTGYQ'
});

var DEFAULT_SEARCH = {
  sort: 1,
  radius_filter: 8000,
  term: 'restaurants'
};

exports.defaultSearch = function (opts, callback) {
  var options = _.defaults(DEFAULT_SEARCH, opts);

  if (!options.location) {
    return callback(new Error('No location given'));
  }

  yelp.search(options, function (err, res) {
    if (err) {
      return callback(new Error('Problem getting yelp data: ' + err));
    }

    var restaurants = createRestaurants(res);

    callback(null, {location: res.region.center, restaurants: restaurants});
  });
};

function createRestaurants(res) {
  var restaurants = {};
  return restaurants;
}
