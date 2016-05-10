'use strict';

var key = 'aaa1';

function test() {
  nowOrAgain(key, update, 1);
  nowOrAgain(key, update, 2);
  nowOrAgain(key, update, 3);
  nowOrAgain(key, update, 4);
  setTimeout(function () {
    return nowOrAgain(key, update, 5);
  }, 500);
  setTimeout(function () {
    return nowOrAgain(key, update, 6);
  }, 1001);
}

function updatePromise(n) {
  return new Promise(function (res) {
    console.log('updating', n);
    setTimeout(function () {
      //console.log('resolving in updatePromise');
      res();
    }, 1000);
  });
}

function testPromise() {
  nowOrAgainPromise(key, updatePromise, 1).then(function () {
    return nowOrAgainPromise(key, updatePromise, 2);
  }).then(function () {
    return nowOrAgainPromise(key, updatePromise, 3);
  }).then(function () {
    return nowOrAgainPromise(key, updatePromise, 4);
  }).then(function () {
    return new Promise(function (res1) {
      setTimeout(function () {
        nowOrAgainPromise(key, updatePromise, 5).then(res1);
      }, 1500);
    });
  }).then(function () {}).catch(function (e) {
    return console.error(e, e.stack);
  });
}

testPromise();