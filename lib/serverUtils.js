var _ = require('lodash');
var utils = require('./utils');
var fs = require('fs');
var genId = require('gen-id');

_.merge(exports, utils);

(function () {
  var idGenerator = genId('xxxx');

  exports.roomGenerator = function () {
    return idGenerator.generate();
  };
}());

exports.requireDir = function (path, ignores) {
  return fs.readdirSync(path).reduce(function (modules, name) {
    if (!ignores || ignores.indexOf(name) === -1) {
      modules.push(require(path + '/' + name));
    }
    return modules;
  }, []);
};
