
var Queue = require('../lib/index');

var queue = new Queue({ 
    key: 'my-queue-name',       // name of queue
    // server: '127.0.0.1',     // (optional) redis server
    // port: 6379               // (optiona) redis port 
});

var item = { hello: 'world', abc: 123 };

queue.push(item, function(err) {
    queue.size(function(err, size) {
      console.log("size is:", size);
      queue.pop(function(err, item) {
        console.log("popped:", item);
        queue.size(function(err, size) {
          console.log("size is:", size);
        });
      });
    });
});



