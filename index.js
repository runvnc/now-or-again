'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkAgain = checkAgain;
exports.nowOrAgain = nowOrAgain;
exports.checkAgainPromise = checkAgainPromise;
exports.nowOrAgainPromise = nowOrAgainPromise;
exports.isRunning = isRunning;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var running = {},
    runAgain = {},
    args = {};
var md5 = require('md5');

function checkAgain(key, func) {
  var funcID = key + md5(func);
  if (runAgain[funcID]) {
    running[funcID] = false;
    runAgain[funcID] = false;
    nowOrAgain.apply(undefined, [func].concat(_toConsumableArray(args[funcID])));
  } else {
    running[funcID] = false;
  }
}

function nowOrAgain(func, key) {
  var funcID = key + md5(func);

  for (var _len = arguments.length, params = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    params[_key - 2] = arguments[_key];
  }

  if (running[funcID]) {
    runAgain[funcID] = true;
    args[funcID] = params;
  } else {
    running[funcID] = true;
    try {
      func.apply(undefined, params.concat([function () {
        checkAgain(key, func);
      }]));
    } catch (e) {
      running[funcID] = false;
      throw e;
    }
  }
}

function checkAgainPromise(key, prom) {
  var funcID = key + md5(prom);
  if (runAgain[funcID]) {
    running[funcID] = false;
    runAgain[funcID] = false;
    return nowOrAgainPromise.apply(undefined, [prom].concat(_toConsumableArray(args[funcID])));
  } else {
    running[funcID] = false;
  }
}

function nowOrAgainPromise(key, prom) {
  for (var _len2 = arguments.length, params = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    params[_key2 - 2] = arguments[_key2];
  }

  return new _bluebird2.default(function (resolve) {
    var funcID = key + md5(prom);

    if (running[funcID]) {
      runAgain[funcID] = true;
      args[funcID] = params;
      resolve();
    } else {
      running[funcID] = true;
      resolve();
      prom.apply(undefined, params).then(function () {
        return checkAgainPromise(key, prom);
      }).then(function () {}).catch(function (e) {
        console.log(e);
        running[funcID] = false;
        throw e;
      });
    }
  });
}

function isRunning(key, f) {
  var id = key + md5(f);
  return running[id];
}