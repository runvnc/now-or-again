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

