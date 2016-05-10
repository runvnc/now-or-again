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

