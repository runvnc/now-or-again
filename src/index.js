'use strict';

import Promise from 'bluebird';

let running = {}, runAgain = {},
    args = {};
let md5 = require('md5');

export function checkAgain(key, func) {
  let funcID = key+md5(func);
  if (runAgain[funcID]) {
    running[funcID] = false;
    runAgain[funcID] = false;
    nowOrAgain(func, ...args[funcID]);
  } else {
    running[funcID] = false;
  }
}
 
export function nowOrAgain(func, key, ...params) {
  var funcID = key+md5(func);
 
  if (running[funcID]) {
    runAgain[funcID] = true;
    args[funcID] = params;
  } else {
    running[funcID] = true;
    try {
      func(...params,() => { checkAgain(key, func); });
    } catch (e) {
      running[funcID] = false;
      throw e;
    }
  }
}

export function checkAgainPromise(key, prom) {
  let funcID = key+md5(prom);
  if (runAgain[funcID]) {
    running[funcID] = false;
    runAgain[funcID] = false;
    return nowOrAgainPromise(prom, ...args[funcID]);
  } else {
    running[funcID] = false;
  }
}

export function nowOrAgainPromise(key, prom, ...params) {
  return new Promise( (resolve) => {
    var funcID = key+md5(prom);
 
    if (running[funcID]) {
      runAgain[funcID] = true;
      args[funcID] = params;
      resolve();
    } else {
      running[funcID] = true;
      resolve();
      prom(...params).then( () => { 
        return checkAgainPromise(key, prom);
      }).then( () => {
      }).catch( (e) => {
        console.log(e);
        running[funcID] = false;
        throw e;
      });
    }
  });
}

export function isRunning(key, f) {
  let id = key+md5(f);
  return running[id];
}

let count = 1;

function update(n, cb) {
  console.log('updating', n);
  setTimeout(cb, 1000);
}

let key = 'aaa1';

function test() {
  nowOrAgain(key, update,1);
  nowOrAgain(key, update,2);
  nowOrAgain(key, update,3);
  nowOrAgain(key, update,4);
  setTimeout(()=>nowOrAgain(key, update,5),500);
  setTimeout(()=>nowOrAgain(key, update,6),1001);
}

function updatePromise(n) {
  return new Promise( (res) => {
    console.log('updating',n);
    setTimeout(() => {
      //console.log('resolving in updatePromise');
      res();
    }, 1000); 
  });
}

function testPromise() {
  nowOrAgainPromise(key, updatePromise, 1).then( () => {
    return nowOrAgainPromise(key, updatePromise, 2);
  }).then( () => {
    return nowOrAgainPromise(key, updatePromise, 3);
  }).then( () => {
    return nowOrAgainPromise(key, updatePromise, 4);  
  }).then( () => { 
    return new Promise( (res1) => {
      setTimeout( ()=> {    
        nowOrAgainPromise(key, updatePromise, 5).then(res1);
       }, 1500);
    });  
  }).then( () => {} )
  .catch( e=> console.error(e, e.stack) );
}

testPromise();

