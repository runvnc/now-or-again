'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var running = {},
    runAgain = {},
    args = {};
var md5 = require('md5');

function checkAgain(func) {
  var funcID = md5(func);
  if (runAgain[funcID]) {
    running[funcID] = false;
    runAgain[funcID] = false;
    nowOrAgain.apply(undefined, [func].concat(_toConsumableArray(args[funcID])));
  }
}

function nowOrAgain(func) {
  var funcID = md5(func);

  for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    params[_key - 1] = arguments[_key];
  }

  if (running[funcID]) {
    runAgain[funcID] = true;
    args[funcID] = params;
  } else {
    running[funcID] = true;
    try {
      func.apply(undefined, params.concat([function () {
        checkAgain(func);
      }]));
    } catch (e) {
      running[funcID] = false;
      throw e;
    }
  }
}

var count = 1;

function update(n, cb) {
  console.log('updating', n);
  setTimeout(cb, 1000);
}

nowOrAgain(update, 1);
nowOrAgain(update, 2);
nowOrAgain(update, 3);
nowOrAgain(update, 4);
setTimeout(function () {
  return nowOrAgain(update, 5);
}, 500);
setTimeout(function () {
  return nowOrAgain(update, 6);
}, 1001);