var realtime = require('./realtime');

realtime.on('update', function (data) {
  console.log(data);
});
