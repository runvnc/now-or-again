Run a function now, or if its already running (callback hasn't returned) then run it again when it finishes.
Will only call the function one additional time even if you call nowOrAgain several times while the function is
working.

# Usage

```javascript
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
```
Output:
```shell
updating 1
updating 5
updating 6
```
