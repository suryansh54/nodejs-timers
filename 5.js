setTimeout(() => {
    console.log('timeout');
}, 0);
  
setImmediate(() => {
    console.log('immediate');
});

/*
$ node 5.js
timeout
immediate

$ node 5.js
immediate
timeout
*/