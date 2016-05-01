'use strict';

let running = {}, runAgain = {},
    args = {};
let md5 = require('md5');

function checkAgain(func) {
  let funcID = md5(func);
  if (runAgain[funcID]) {
    running[funcID] = false;
    runAgain[funcID] = false;
    nowOrAgain(func, ...args[funcID]);
  }
}
 
function nowOrAgain(func, ...params) {
  var funcID = md5(func);
 
  if (running[funcID]) {
    runAgain[funcID] = true;
    args[funcID] = params;
  } else {
    running[funcID] = true;
    try {
      func(...params,() => { checkAgain(func); });
    } catch (e) {
      running[funcID] = false;
      throw e;
    }
  }
}

let count = 1;

function update(n, cb) {
  console.log('updating', n);
  setTimeout(cb, 1000);
}

nowOrAgain(update,1);
nowOrAgain(update,2);
nowOrAgain(update,3);
nowOrAgain(update,4);
setTimeout(()=>nowOrAgain(update,5),500);
setTimeout(()=>nowOrAgain(update,6),1001);


