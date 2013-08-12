# rpq

rpq is a redis-backed queue.  Nope, not a message queue, just a persistent queue to shove
objects into in case you need something more resilient than memory.

It provides some simple queue apis (e.g. pop(), push()).

## Install 

`npm install rpq`

## Usage

`pop(callback)` - pop an item from the queue
`push(item, callback)` - push an item on the queue
`size(callback)` - get size 

```js
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
      });
    });
});
```

output:
```
size is: 1
popped: { hello: 'world', abc: 123 }
```

## License

MIT
