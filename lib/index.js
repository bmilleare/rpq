var redis = require('redis');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

/**
 * rpq - redis persistent queue
 *
 * A simple queue that is backed by redis instead of in-memory,
 * so it remains persistent on restarts.
 *
 * emits event `ready` when ready.
 *
 * @param {String} options.server - (optional) redis server. default is `localhsot` 
 * @param {Number} options.port - (optional) redis port. default is `6379`
 * @param {string} options.key - (optional) queue key - default is `rpq`
 *
 * @public
 */

function Queue(options) {
  
  var self = this;
  
  options = options || {};

  self.key = options.key || 'rpq';
  
  self._redis = redis.createClient(options.port || 6379, options.server || 'localhost');

  self._redis.on('ready', function() {
    self.load();
  });

  self._redis.on('error', function(err) {
    self.emit('error', err);
  });

};

util.inherits(Queue, EventEmitter);

/** 
 * TODO: keep up to n events in memory pre-buffered
 */
Queue.prototype.load = function() {
  var self = this;
  self.emit('ready');
};

/**
 * size of queue
 *
 * returns callback(error, size: integer)
 * 
 * @param {Function} callback callback
 */
Queue.prototype.size = function(callback) {
  var self = this;
  self._redis.llen(self.key, function(err, length) {
    callback(err, length); 
  });
};

/**
 * check if queue is empty 
 *
 * returns callback(error, empty: boolean)
 * 
 * @param {Function} callback callback
 */
Queue.prototype.empty = function(callback) {
  var self = this;
  self._redis.llen(self.key, function(err, length) {
    if (err) return callback(err); 
    return callback(null, length == 0);
  });
};

/**
 * pop an item from the queue 
 *
 * returns callback(error, item: Object)
 * 
 * @param {Function} callback callback
 */
Queue.prototype.pop = function(callback) {
  var self = this;
  self._redis.rpop(self.key, function(err, item) {
    if (err) return callback(err); 
    if (!item) return callback();
    return callback(null, JSON.parse(item));
  });
};

/**
 * push an item on the queue 
 *
 * returns callback(error)
 * 
 * @param {Function} callback callback
 */
Queue.prototype.push = function(obj, callback) {

  var self = this;
  self._redis.lpush(self.key, JSON.stringify(obj), function(err) {
    return callback(err); 
  });
};

module.exports = Queue;
