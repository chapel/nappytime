var levelup = require('levelup')
  , sublevel = require('level-sublevel')
  , _ = require('lodash');

var defaultDb = levelup(__dirname + '/../.db');

var sep = '-';

function serializeData(data) {
  if (_.isBoolean(data)) {
    return 'boolean' + sep + data;
  } else if (_.isDate(data)) {
    return 'date' + sep + data.toUTCString();
  } else if (_.isNull(data)) {
    return 'null' + sep;
  } else if (_.isUndefined(data)) {
    return 'undefined' + sep;
  } else if (_.isRegExp(data)) {
    return 'regexp' + sep + data.source;
  } else if (_.isArray(data)) {
    var toSerialize = _.map(data, serializeData);
    return 'array' + sep + JSON.stringify(toSerialize);
  } else if (_.isObject(data)) {
    var toSerialize = _.reduce(data, function (kvs, v, k) {
      kvs[k] = serializeData(v);
      return kvs;
    }, {});
    return 'object' + sep + JSON.stringify(toSerialize);
  } else { // not a good assumption
    return 'string' + sep + data.toString();
  }
};

function deserializeData(data) {
  var i = s.indexOf(sep);
  if (i <= 0) {
    throw new Error('unable to deserialize data');
  }
  var dataType = s.slice(0, i)
    , dataSer = s.slice(i + sep.length);
  if (dataType === 'boolean') {
    return !!dataSer;
  } else if (dataType === 'date') {
    return Date.parse(dataSer);
  } else if (dataType === 'null') {
    return null;
  } else if (dataType === 'undefined') {
    return;
  } else if (dataType === 'regexp') {
    return new RegExp(dataSer);
  } else if (dataType === 'array') {
    return _.map(JSON.parse(dataSer), function (part) {
      return deserializeData(part);
    });
  } else if (dataType === 'object') {
    return _.reduce(JSON.parse(dataSer), function (kvs, v, k) {
      kvs[k] = deserializeData(v);
      return kvs;
    }, {});
  } else { // not a good assumption
    return dataSer;
  }
};

var DB = module.exports = function (pathToDb) {
  var updb = pathToDb ? levelup(pathToDb) : defaultDb;
  this.db = sublevel(updb);
};

DB.prototype = {
  get: function (mylevel, key, _cb) {
    var sub = this.db.sublevel(mylevel);
    return sub.get(key, function (err, data) {
      if (err && err.stack) {
        console.log(err.stack);
      }
      if (!data) {
        return _cb();
      }
      return _cb(null, deserializeData(data));
    });
  },
  put: function (mylevel, key, val, _cb) {
    var sub = this.db.sublevel(mylevel);
    return sub.put(key, serializeData(val), function (err) {
      return _cb(err);
    });
  },
  putMerge: function (mylevel, key, val, _cb) {
    var sub = this.db.sublevel(mylevel);
    if (!_.isObject(val)) {
      return _cb(new Error('merging value is not an object!'));
    }
    var self = this;
    return sub.get(key, function (err, extantStr) {
      if (!extantStr) {
        self.put(mylevel, key, val, _cb);
      } else {
        var extant = deserializeData(extantStr);
        if (!extant || !_.isObject(extant)) {
          return _cb(new Error('existing data is not an object!'));
        }
        return self.put(mylevel, key, _.extend(extant, val), _cb);
      }
    });
  }
};

DB.defaultDB = new DB();