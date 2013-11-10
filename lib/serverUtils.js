var _ = require('lodash');
var utils = require('./utils');
var fs = require('fs');
var genId = require('gen-id');
var defaultGenIdFormat = 'xxxx'
var generators = {};
var db = require('./db').defaultDB;

_.merge(exports, utils);

var roomGenerator = exports.generator = function (format) {
  format = format || defaultGenIdFormat;
  if (!generators[format]) {
    generators[format] = genId(format);
  }
  return generators[format];

};

exports.generateRoom = function (_cb) {
  var generator = roomGenerator();

  function onGenerate() {
    var id = generator.generate();
    db.get('room', id, function (err, room) {
      if (err) {
        return _cb(err);
      }
      if (!room) {
        return _cb(null, id);
      } else {
        onGenerate();
      }
    });
  }

  onGenerate();
};

exports.requireDir = function (path, ignores) {
  return fs.readdirSync(path).reduce(function (modules, name) {
    if (!ignores || ignores.indexOf(name) === -1) {
      modules.push(require(path + '/' + name));
    }
    return modules;
  }, []);
};
