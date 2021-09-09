/*! addsearch-js-client 0.6.1 */
window["AddSearchClient"] =
  /******/ (function(modules) { // webpackBootstrap
  /******/ 	// The module cache
  /******/ 	var installedModules = {};
  /******/
  /******/ 	// The require function
  /******/ 	function __webpack_require__(moduleId) {
    /******/
    /******/ 		// Check if module is in cache
    /******/ 		if(installedModules[moduleId]) {
      /******/ 			return installedModules[moduleId].exports;
      /******/ 		}
    /******/ 		// Create a new module (and put it into the cache)
    /******/ 		var module = installedModules[moduleId] = {
      /******/ 			i: moduleId,
      /******/ 			l: false,
      /******/ 			exports: {}
      /******/ 		};
    /******/
    /******/ 		// Execute the module function
    /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/
    /******/ 		// Flag the module as loaded
    /******/ 		module.l = true;
    /******/
    /******/ 		// Return the exports of the module
    /******/ 		return module.exports;
    /******/ 	}
  /******/
  /******/
  /******/ 	// expose the modules object (__webpack_modules__)
  /******/ 	__webpack_require__.m = modules;
  /******/
  /******/ 	// expose the module cache
  /******/ 	__webpack_require__.c = installedModules;
  /******/
  /******/ 	// define getter function for harmony exports
  /******/ 	__webpack_require__.d = function(exports, name, getter) {
    /******/ 		if(!__webpack_require__.o(exports, name)) {
      /******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
      /******/ 		}
    /******/ 	};
  /******/
  /******/ 	// define __esModule on exports
  /******/ 	__webpack_require__.r = function(exports) {
    /******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      /******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
      /******/ 		}
    /******/ 		Object.defineProperty(exports, '__esModule', { value: true });
    /******/ 	};
  /******/
  /******/ 	// create a fake namespace object
  /******/ 	// mode & 1: value is a module id, require it
  /******/ 	// mode & 2: merge all properties of value into the ns
  /******/ 	// mode & 4: return value when already ns object
  /******/ 	// mode & 8|1: behave like require
  /******/ 	__webpack_require__.t = function(value, mode) {
    /******/ 		if(mode & 1) value = __webpack_require__(value);
    /******/ 		if(mode & 8) return value;
    /******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
    /******/ 		var ns = Object.create(null);
    /******/ 		__webpack_require__.r(ns);
    /******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
    /******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
    /******/ 		return ns;
    /******/ 	};
  /******/
  /******/ 	// getDefaultExport function for compatibility with non-harmony modules
  /******/ 	__webpack_require__.n = function(module) {
    /******/ 		var getter = module && module.__esModule ?
      /******/ 			function getDefault() { return module['default']; } :
      /******/ 			function getModuleExports() { return module; };
    /******/ 		__webpack_require__.d(getter, 'a', getter);
    /******/ 		return getter;
    /******/ 	};
  /******/
  /******/ 	// Object.prototype.hasOwnProperty.call
  /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
  /******/
  /******/ 	// __webpack_public_path__
  /******/ 	__webpack_require__.p = "";
  /******/
  /******/
  /******/ 	// Load entry module and return exports
  /******/ 	return __webpack_require__(__webpack_require__.s = 4);
  /******/ })
  /************************************************************************/
  /******/ ([
    /* 0 */
    /***/ (function(module, exports, __webpack_require__) {

      /* WEBPACK VAR INJECTION */(function(process, global) {/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   v4.2.8+1e68dce6
 */

        (function (global, factory) {
          true ? module.exports = factory() :
            undefined;
        }(this, (function () { 'use strict';

          function objectOrFunction(x) {
            var type = typeof x;
            return x !== null && (type === 'object' || type === 'function');
          }

          function isFunction(x) {
            return typeof x === 'function';
          }



          var _isArray = void 0;
          if (Array.isArray) {
            _isArray = Array.isArray;
          } else {
            _isArray = function (x) {
              return Object.prototype.toString.call(x) === '[object Array]';
            };
          }

          var isArray = _isArray;

          var len = 0;
          var vertxNext = void 0;
          var customSchedulerFn = void 0;

          var asap = function asap(callback, arg) {
            queue[len] = callback;
            queue[len + 1] = arg;
            len += 2;
            if (len === 2) {
              // If len is 2, that means that we need to schedule an async flush.
              // If additional callbacks are queued before the queue is flushed, they
              // will be processed by this flush that we are scheduling.
              if (customSchedulerFn) {
                customSchedulerFn(flush);
              } else {
                scheduleFlush();
              }
            }
          };

          function setScheduler(scheduleFn) {
            customSchedulerFn = scheduleFn;
          }

          function setAsap(asapFn) {
            asap = asapFn;
          }

          var browserWindow = typeof window !== 'undefined' ? window : undefined;
          var browserGlobal = browserWindow || {};
          var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
          var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

// test for web worker but not in IE10
          var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
          function useNextTick() {
            // node version 0.10.x displays a deprecation warning when nextTick is used recursively
            // see https://github.com/cujojs/when/issues/410 for details
            return function () {
              return process.nextTick(flush);
            };
          }

// vertx
          function useVertxTimer() {
            if (typeof vertxNext !== 'undefined') {
              return function () {
                vertxNext(flush);
              };
            }

            return useSetTimeout();
          }

          function useMutationObserver() {
            var iterations = 0;
            var observer = new BrowserMutationObserver(flush);
            var node = document.createTextNode('');
            observer.observe(node, { characterData: true });

            return function () {
              node.data = iterations = ++iterations % 2;
            };
          }

// web worker
          function useMessageChannel() {
            var channel = new MessageChannel();
            channel.port1.onmessage = flush;
            return function () {
              return channel.port2.postMessage(0);
            };
          }

          function useSetTimeout() {
            // Store setTimeout reference so es6-promise will be unaffected by
            // other code modifying setTimeout (like sinon.useFakeTimers())
            var globalSetTimeout = setTimeout;
            return function () {
              return globalSetTimeout(flush, 1);
            };
          }

          var queue = new Array(1000);
          function flush() {
            for (var i = 0; i < len; i += 2) {
              var callback = queue[i];
              var arg = queue[i + 1];

              callback(arg);

              queue[i] = undefined;
              queue[i + 1] = undefined;
            }

            len = 0;
          }

          function attemptVertx() {
            try {
              var vertx = Function('return this')().require('vertx');
              vertxNext = vertx.runOnLoop || vertx.runOnContext;
              return useVertxTimer();
            } catch (e) {
              return useSetTimeout();
            }
          }

          var scheduleFlush = void 0;
// Decide what async method to use to triggering processing of queued callbacks:
          if (isNode) {
            scheduleFlush = useNextTick();
          } else if (BrowserMutationObserver) {
            scheduleFlush = useMutationObserver();
          } else if (isWorker) {
            scheduleFlush = useMessageChannel();
          } else if (browserWindow === undefined && "function" === 'function') {
            scheduleFlush = attemptVertx();
          } else {
            scheduleFlush = useSetTimeout();
          }

          function then(onFulfillment, onRejection) {
            var parent = this;

            var child = new this.constructor(noop);

            if (child[PROMISE_ID] === undefined) {
              makePromise(child);
            }

            var _state = parent._state;


            if (_state) {
              var callback = arguments[_state - 1];
              asap(function () {
                return invokeCallback(_state, child, callback, parent._result);
              });
            } else {
              subscribe(parent, child, onFulfillment, onRejection);
            }

            return child;
          }

          /**
           `Promise.resolve` returns a promise that will become resolved with the
           passed `value`. It is shorthand for the following:

           ```javascript
           let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

           promise.then(function(value){
    // value === 1
  });
           ```

           Instead of writing the above, your code now simply becomes the following:

           ```javascript
           let promise = Promise.resolve(1);

           promise.then(function(value){
    // value === 1
  });
           ```

           @method resolve
           @static
           @param {Any} value value that the returned promise will be resolved with
           Useful for tooling.
           @return {Promise} a promise that will become fulfilled with the given
           `value`
           */
          function resolve$1(object) {
            /*jshint validthis:true */
            var Constructor = this;

            if (object && typeof object === 'object' && object.constructor === Constructor) {
              return object;
            }

            var promise = new Constructor(noop);
            resolve(promise, object);
            return promise;
          }

          var PROMISE_ID = Math.random().toString(36).substring(2);

          function noop() {}

          var PENDING = void 0;
          var FULFILLED = 1;
          var REJECTED = 2;

          function selfFulfillment() {
            return new TypeError("You cannot resolve a promise with itself");
          }

          function cannotReturnOwn() {
            return new TypeError('A promises callback cannot return that same promise.');
          }

          function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
            try {
              then$$1.call(value, fulfillmentHandler, rejectionHandler);
            } catch (e) {
              return e;
            }
          }

          function handleForeignThenable(promise, thenable, then$$1) {
            asap(function (promise) {
              var sealed = false;
              var error = tryThen(then$$1, thenable, function (value) {
                if (sealed) {
                  return;
                }
                sealed = true;
                if (thenable !== value) {
                  resolve(promise, value);
                } else {
                  fulfill(promise, value);
                }
              }, function (reason) {
                if (sealed) {
                  return;
                }
                sealed = true;

                reject(promise, reason);
              }, 'Settle: ' + (promise._label || ' unknown promise'));

              if (!sealed && error) {
                sealed = true;
                reject(promise, error);
              }
            }, promise);
          }

          function handleOwnThenable(promise, thenable) {
            if (thenable._state === FULFILLED) {
              fulfill(promise, thenable._result);
            } else if (thenable._state === REJECTED) {
              reject(promise, thenable._result);
            } else {
              subscribe(thenable, undefined, function (value) {
                return resolve(promise, value);
              }, function (reason) {
                return reject(promise, reason);
              });
            }
          }

          function handleMaybeThenable(promise, maybeThenable, then$$1) {
            if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
              handleOwnThenable(promise, maybeThenable);
            } else {
              if (then$$1 === undefined) {
                fulfill(promise, maybeThenable);
              } else if (isFunction(then$$1)) {
                handleForeignThenable(promise, maybeThenable, then$$1);
              } else {
                fulfill(promise, maybeThenable);
              }
            }
          }

          function resolve(promise, value) {
            if (promise === value) {
              reject(promise, selfFulfillment());
            } else if (objectOrFunction(value)) {
              var then$$1 = void 0;
              try {
                then$$1 = value.then;
              } catch (error) {
                reject(promise, error);
                return;
              }
              handleMaybeThenable(promise, value, then$$1);
            } else {
              fulfill(promise, value);
            }
          }

          function publishRejection(promise) {
            if (promise._onerror) {
              promise._onerror(promise._result);
            }

            publish(promise);
          }

          function fulfill(promise, value) {
            if (promise._state !== PENDING) {
              return;
            }

            promise._result = value;
            promise._state = FULFILLED;

            if (promise._subscribers.length !== 0) {
              asap(publish, promise);
            }
          }

          function reject(promise, reason) {
            if (promise._state !== PENDING) {
              return;
            }
            promise._state = REJECTED;
            promise._result = reason;

            asap(publishRejection, promise);
          }

          function subscribe(parent, child, onFulfillment, onRejection) {
            var _subscribers = parent._subscribers;
            var length = _subscribers.length;


            parent._onerror = null;

            _subscribers[length] = child;
            _subscribers[length + FULFILLED] = onFulfillment;
            _subscribers[length + REJECTED] = onRejection;

            if (length === 0 && parent._state) {
              asap(publish, parent);
            }
          }

          function publish(promise) {
            var subscribers = promise._subscribers;
            var settled = promise._state;

            if (subscribers.length === 0) {
              return;
            }

            var child = void 0,
              callback = void 0,
              detail = promise._result;

            for (var i = 0; i < subscribers.length; i += 3) {
              child = subscribers[i];
              callback = subscribers[i + settled];

              if (child) {
                invokeCallback(settled, child, callback, detail);
              } else {
                callback(detail);
              }
            }

            promise._subscribers.length = 0;
          }

          function invokeCallback(settled, promise, callback, detail) {
            var hasCallback = isFunction(callback),
              value = void 0,
              error = void 0,
              succeeded = true;

            if (hasCallback) {
              try {
                value = callback(detail);
              } catch (e) {
                succeeded = false;
                error = e;
              }

              if (promise === value) {
                reject(promise, cannotReturnOwn());
                return;
              }
            } else {
              value = detail;
            }

            if (promise._state !== PENDING) {
              // noop
            } else if (hasCallback && succeeded) {
              resolve(promise, value);
            } else if (succeeded === false) {
              reject(promise, error);
            } else if (settled === FULFILLED) {
              fulfill(promise, value);
            } else if (settled === REJECTED) {
              reject(promise, value);
            }
          }

          function initializePromise(promise, resolver) {
            try {
              resolver(function resolvePromise(value) {
                resolve(promise, value);
              }, function rejectPromise(reason) {
                reject(promise, reason);
              });
            } catch (e) {
              reject(promise, e);
            }
          }

          var id = 0;
          function nextId() {
            return id++;
          }

          function makePromise(promise) {
            promise[PROMISE_ID] = id++;
            promise._state = undefined;
            promise._result = undefined;
            promise._subscribers = [];
          }

          function validationError() {
            return new Error('Array Methods must be provided an Array');
          }

          var Enumerator = function () {
            function Enumerator(Constructor, input) {
              this._instanceConstructor = Constructor;
              this.promise = new Constructor(noop);

              if (!this.promise[PROMISE_ID]) {
                makePromise(this.promise);
              }

              if (isArray(input)) {
                this.length = input.length;
                this._remaining = input.length;

                this._result = new Array(this.length);

                if (this.length === 0) {
                  fulfill(this.promise, this._result);
                } else {
                  this.length = this.length || 0;
                  this._enumerate(input);
                  if (this._remaining === 0) {
                    fulfill(this.promise, this._result);
                  }
                }
              } else {
                reject(this.promise, validationError());
              }
            }

            Enumerator.prototype._enumerate = function _enumerate(input) {
              for (var i = 0; this._state === PENDING && i < input.length; i++) {
                this._eachEntry(input[i], i);
              }
            };

            Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
              var c = this._instanceConstructor;
              var resolve$$1 = c.resolve;


              if (resolve$$1 === resolve$1) {
                var _then = void 0;
                var error = void 0;
                var didError = false;
                try {
                  _then = entry.then;
                } catch (e) {
                  didError = true;
                  error = e;
                }

                if (_then === then && entry._state !== PENDING) {
                  this._settledAt(entry._state, i, entry._result);
                } else if (typeof _then !== 'function') {
                  this._remaining--;
                  this._result[i] = entry;
                } else if (c === Promise$1) {
                  var promise = new c(noop);
                  if (didError) {
                    reject(promise, error);
                  } else {
                    handleMaybeThenable(promise, entry, _then);
                  }
                  this._willSettleAt(promise, i);
                } else {
                  this._willSettleAt(new c(function (resolve$$1) {
                    return resolve$$1(entry);
                  }), i);
                }
              } else {
                this._willSettleAt(resolve$$1(entry), i);
              }
            };

            Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
              var promise = this.promise;


              if (promise._state === PENDING) {
                this._remaining--;

                if (state === REJECTED) {
                  reject(promise, value);
                } else {
                  this._result[i] = value;
                }
              }

              if (this._remaining === 0) {
                fulfill(promise, this._result);
              }
            };

            Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
              var enumerator = this;

              subscribe(promise, undefined, function (value) {
                return enumerator._settledAt(FULFILLED, i, value);
              }, function (reason) {
                return enumerator._settledAt(REJECTED, i, reason);
              });
            };

            return Enumerator;
          }();

          /**
           `Promise.all` accepts an array of promises, and returns a new promise which
           is fulfilled with an array of fulfillment values for the passed promises, or
           rejected with the reason of the first passed promise to be rejected. It casts all
           elements of the passed iterable to promises as it runs this algorithm.

           Example:

           ```javascript
           let promise1 = resolve(1);
           let promise2 = resolve(2);
           let promise3 = resolve(3);
           let promises = [ promise1, promise2, promise3 ];

           Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
           ```

           If any of the `promises` given to `all` are rejected, the first promise
           that is rejected will be given as an argument to the returned promises's
           rejection handler. For example:

           Example:

           ```javascript
           let promise1 = resolve(1);
           let promise2 = reject(new Error("2"));
           let promise3 = reject(new Error("3"));
           let promises = [ promise1, promise2, promise3 ];

           Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
           ```

           @method all
           @static
           @param {Array} entries array of promises
           @param {String} label optional string for labeling the promise.
           Useful for tooling.
           @return {Promise} promise that is fulfilled when all `promises` have been
           fulfilled, or rejected if any of them become rejected.
           @static
           */
          function all(entries) {
            return new Enumerator(this, entries).promise;
          }

          /**
           `Promise.race` returns a new promise which is settled in the same way as the
           first passed promise to settle.

           Example:

           ```javascript
           let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

           let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

           Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
           ```

           `Promise.race` is deterministic in that only the state of the first
           settled promise matters. For example, even if other promises given to the
           `promises` array argument are resolved, but the first settled promise has
           become rejected before the other promises became fulfilled, the returned
           promise will become rejected:

           ```javascript
           let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

           let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

           Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
           ```

           An example real-world use case is implementing timeouts:

           ```javascript
           Promise.race([ajax('foo.json'), timeout(5000)])
           ```

           @method race
           @static
           @param {Array} promises array of promises to observe
           Useful for tooling.
           @return {Promise} a promise which settles in the same way as the first passed
           promise to settle.
           */
          function race(entries) {
            /*jshint validthis:true */
            var Constructor = this;

            if (!isArray(entries)) {
              return new Constructor(function (_, reject) {
                return reject(new TypeError('You must pass an array to race.'));
              });
            } else {
              return new Constructor(function (resolve, reject) {
                var length = entries.length;
                for (var i = 0; i < length; i++) {
                  Constructor.resolve(entries[i]).then(resolve, reject);
                }
              });
            }
          }

          /**
           `Promise.reject` returns a promise rejected with the passed `reason`.
           It is shorthand for the following:

           ```javascript
           let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

           promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
           ```

           Instead of writing the above, your code now simply becomes the following:

           ```javascript
           let promise = Promise.reject(new Error('WHOOPS'));

           promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
           ```

           @method reject
           @static
           @param {Any} reason value that the returned promise will be rejected with.
           Useful for tooling.
           @return {Promise} a promise rejected with the given `reason`.
           */
          function reject$1(reason) {
            /*jshint validthis:true */
            var Constructor = this;
            var promise = new Constructor(noop);
            reject(promise, reason);
            return promise;
          }

          function needsResolver() {
            throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
          }

          function needsNew() {
            throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
          }

          /**
           Promise objects represent the eventual result of an asynchronous operation. The
           primary way of interacting with a promise is through its `then` method, which
           registers callbacks to receive either a promise's eventual value or the reason
           why the promise cannot be fulfilled.

           Terminology
           -----------

           - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
           - `thenable` is an object or function that defines a `then` method.
           - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
           - `exception` is a value that is thrown using the throw statement.
           - `reason` is a value that indicates why a promise was rejected.
           - `settled` the final resting state of a promise, fulfilled or rejected.

           A promise can be in one of three states: pending, fulfilled, or rejected.

           Promises that are fulfilled have a fulfillment value and are in the fulfilled
           state.  Promises that are rejected have a rejection reason and are in the
           rejected state.  A fulfillment value is never a thenable.

           Promises can also be said to *resolve* a value.  If this value is also a
           promise, then the original promise's settled state will match the value's
           settled state.  So a promise that *resolves* a promise that rejects will
           itself reject, and a promise that *resolves* a promise that fulfills will
           itself fulfill.


           Basic Usage:
           ------------

           ```js
           let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

           promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
           ```

           Advanced Usage:
           ---------------

           Promises shine when abstracting away asynchronous interactions such as
           `XMLHttpRequest`s.

           ```js
           function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

           getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
           ```

           Unlike callbacks, promises are great composable primitives.

           ```js
           Promise.all([
           getJSON('/posts'),
           getJSON('/comments')
           ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
           ```

           @class Promise
           @param {Function} resolver
           Useful for tooling.
           @constructor
           */

          var Promise$1 = function () {
            function Promise(resolver) {
              this[PROMISE_ID] = nextId();
              this._result = this._state = undefined;
              this._subscribers = [];

              if (noop !== resolver) {
                typeof resolver !== 'function' && needsResolver();
                this instanceof Promise ? initializePromise(this, resolver) : needsNew();
              }
            }

            /**
             The primary way of interacting with a promise is through its `then` method,
             which registers callbacks to receive either a promise's eventual value or the
             reason why the promise cannot be fulfilled.
             ```js
             findUser().then(function(user){
    // user is available
  }, function(reason){
    // user is unavailable, and you are given the reason why
  });
             ```
             Chaining
             --------
             The return value of `then` is itself a promise.  This second, 'downstream'
             promise is resolved with the return value of the first promise's fulfillment
             or rejection handler, or rejected if the handler throws an exception.
             ```js
             findUser().then(function (user) {
    return user.name;
  }, function (reason) {
    return 'default name';
  }).then(function (userName) {
    // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
    // will be `'default name'`
  });
             findUser().then(function (user) {
    throw new Error('Found user, but still unhappy');
  }, function (reason) {
    throw new Error('`findUser` rejected and we're unhappy');
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
    // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
  });
             ```
             If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
             ```js
             findUser().then(function (user) {
    throw new PedagogicalException('Upstream error');
  }).then(function (value) {
    // never reached
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // The `PedgagocialException` is propagated all the way down to here
  });
             ```
             Assimilation
             ------------
             Sometimes the value you want to propagate to a downstream promise can only be
             retrieved asynchronously. This can be achieved by returning a promise in the
             fulfillment or rejection handler. The downstream promise will then be pending
             until the returned promise is settled. This is called *assimilation*.
             ```js
             findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // The user's comments are now available
  });
             ```
             If the assimliated promise rejects, then the downstream promise will also reject.
             ```js
             findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // If `findCommentsByAuthor` fulfills, we'll have the value here
  }, function (reason) {
    // If `findCommentsByAuthor` rejects, we'll have the reason here
  });
             ```
             Simple Example
             --------------
             Synchronous Example
             ```javascript
             let result;
             try {
    result = findResult();
    // success
  } catch(reason) {
    // failure
  }
             ```
             Errback Example
             ```js
             findResult(function(result, err){
    if (err) {
      // failure
    } else {
      // success
    }
  });
             ```
             Promise Example;
             ```javascript
             findResult().then(function(result){
    // success
  }, function(reason){
    // failure
  });
             ```
             Advanced Example
             --------------
             Synchronous Example
             ```javascript
             let author, books;
             try {
    author = findAuthor();
    books  = findBooksByAuthor(author);
    // success
  } catch(reason) {
    // failure
  }
             ```
             Errback Example
             ```js
             function foundBooks(books) {
   }
             function failure(reason) {
   }
             findAuthor(function(author, err){
    if (err) {
      failure(err);
      // failure
    } else {
      try {
        findBoooksByAuthor(author, function(books, err) {
          if (err) {
            failure(err);
          } else {
            try {
              foundBooks(books);
            } catch(reason) {
              failure(reason);
            }
          }
        });
      } catch(error) {
        failure(err);
      }
      // success
    }
  });
             ```
             Promise Example;
             ```javascript
             findAuthor().
             then(findBooksByAuthor).
             then(function(books){
      // found books
  }).catch(function(reason){
    // something went wrong
  });
             ```
             @method then
             @param {Function} onFulfilled
             @param {Function} onRejected
             Useful for tooling.
             @return {Promise}
             */

            /**
             `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
             as the catch block of a try/catch statement.
             ```js
             function findAuthor(){
  throw new Error('couldn't find that author');
  }
             // synchronous
             try {
  findAuthor();
  } catch(reason) {
  // something went wrong
  }
             // async with promises
             findAuthor().catch(function(reason){
  // something went wrong
  });
             ```
             @method catch
             @param {Function} onRejection
             Useful for tooling.
             @return {Promise}
             */


            Promise.prototype.catch = function _catch(onRejection) {
              return this.then(null, onRejection);
            };

            /**
             `finally` will be invoked regardless of the promise's fate just as native
             try/catch/finally behaves

             Synchronous example:

             ```js
             findAuthor() {
      if (Math.random() > 0.5) {
        throw new Error();
      }
      return new Author();
    }

             try {
      return findAuthor(); // succeed or fail
    } catch(error) {
      return findOtherAuther();
    } finally {
      // always runs
      // doesn't affect the return value
    }
             ```

             Asynchronous example:

             ```js
             findAuthor().catch(function(reason){
      return findOtherAuther();
    }).finally(function(){
      // author was either found, or not
    });
             ```

             @method finally
             @param {Function} callback
             @return {Promise}
             */


            Promise.prototype.finally = function _finally(callback) {
              var promise = this;
              var constructor = promise.constructor;

              if (isFunction(callback)) {
                return promise.then(function (value) {
                  return constructor.resolve(callback()).then(function () {
                    return value;
                  });
                }, function (reason) {
                  return constructor.resolve(callback()).then(function () {
                    throw reason;
                  });
                });
              }

              return promise.then(callback, callback);
            };

            return Promise;
          }();

          Promise$1.prototype.then = then;
          Promise$1.all = all;
          Promise$1.race = race;
          Promise$1.resolve = resolve$1;
          Promise$1.reject = reject$1;
          Promise$1._setScheduler = setScheduler;
          Promise$1._setAsap = setAsap;
          Promise$1._asap = asap;

          /*global self*/
          function polyfill() {
            var local = void 0;

            if (typeof global !== 'undefined') {
              local = global;
            } else if (typeof self !== 'undefined') {
              local = self;
            } else {
              try {
                local = Function('return this')();
              } catch (e) {
                throw new Error('polyfill failed because global object is unavailable in this environment');
              }
            }

            var P = local.Promise;

            if (P) {
              var promiseToString = null;
              try {
                promiseToString = Object.prototype.toString.call(P.resolve());
              } catch (e) {
                // silently ignored
              }

              if (promiseToString === '[object Promise]' && !P.cast) {
                return;
              }
            }

            local.Promise = Promise$1;
          }

// Strange compat..
          Promise$1.polyfill = polyfill;
          Promise$1.Promise = Promise$1;

          return Promise$1;

        })));



//# sourceMappingURL=es6-promise.map

        /* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(6), __webpack_require__(2)))

      /***/ }),
    /* 1 */
    /***/ (function(module, exports, __webpack_require__) {

// the whatwg-fetch polyfill installs the fetch() function
// on the global object (window or self)
//
// Return that as the export for use in Webpack, Browserify etc.
      __webpack_require__(7);
      module.exports = self.fetch.bind(self);


      /***/ }),
    /* 2 */
    /***/ (function(module, exports) {

      var g;

// This works in non-strict mode
      g = (function() {
        return this;
      })();

      try {
        // This works if eval is allowed (see CSP)
        g = g || new Function("return this")();
      } catch (e) {
        // This works if the window reference is available
        if (typeof window === "object") g = window;
      }

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

      module.exports = g;


      /***/ }),
    /* 3 */
    /***/ (function(module, exports, __webpack_require__) {

      /* WEBPACK VAR INJECTION */(function(global) {var isFunction = function isFunction(fn) {
        return fn && {}.toString.call(fn) === '[object Function]';
      };

        var base64 = function base64(s) {
          global.window = {};

          if (window && window.btoa) {
            return window.btoa(s);
          } else if (Buffer) {
            return Buffer.from(s).toString('base64');
          }
        };

        module.exports = {
          isFunction: isFunction,
          base64: base64
        };
        /* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(2)))

      /***/ }),
    /* 4 */
    /***/ (function(module, exports, __webpack_require__) {

      "use strict";


      var executeApiFetch = __webpack_require__(5);

      var indexingapi = __webpack_require__(8);

      var sendStats = __webpack_require__(9);

      var Settings = __webpack_require__(10);

      var util = __webpack_require__(3);

      var throttle = __webpack_require__(11);

      var API_HOSTNAME = 'api.addsearch.com';

      var client = function client(sitekey, privatekey) {
        this.sitekey = sitekey;
        this.privatekey = privatekey;
        this.apiHostname = API_HOSTNAME;
        this.settings = new Settings();
        this.sessionId = ('a-' + Math.random() * 100000000).substring(0, 10);
        /**
         * Fetch search results
         *
         * @param a1  Argument 1: Keyword. If no Argument 2, then this is the callback function and search is executed with
         *            the previous keyword. If there is no Argument 2 and no previous keywords, then search is executed
         *            without keyword (i.e. match all query)
         * @param a2  Callback function to call with search results
         */

        this.search = function (a1, a2) {
          var keyword = null;
          var callback = null; // Keyword and callback

          if (a1 && util.isFunction(a2)) {
            keyword = a1;
            callback = a2;
          } // If function is called with callback only, use previous keyword from settings object
          else if (!a2 && util.isFunction(a1)) {
            keyword = this.settings.getSettings().keyword;
            callback = a1;
          } // Use previous keyword and callback
          else if (this.settings.getSettings().callback) {
            keyword = this.settings.getSettings().keyword;
            callback = this.settings.getSettings().callback;
          } else {
            throw "Illegal search parameters. Should be (keyword, callbackFunction) or (callbackFunction)";
          }

          this.settings.setCallback(callback);
          this.settings.setKeyword(keyword);

          if (!this.throttledSearchFetch) {
            this.throttledSearchFetch = throttle(this.settings.getSettings().throttleTimeMs, executeApiFetch);
          }

          this.throttledSearchFetch(this.apiHostname, this.sitekey, 'search', this.settings.getSettings(), callback);
        };
        /**
         * Fetch search suggestions
         *
         * @param keyword
         */


        this.suggestions = function (prefix, callback) {
          if (!prefix || !callback || !util.isFunction(callback)) {
            throw "Illegal suggestions parameters. Should be (prefix, callbackFunction)";
          }

          this.settings.setSuggestionsPrefix(prefix);

          if (!this.throttledSuggestionsFetch) {
            this.throttledSuggestionsFetch = throttle(this.settings.getSettings().throttleTimeMs, executeApiFetch);
          }

          this.throttledSuggestionsFetch(this.apiHostname, this.sitekey, 'suggest', this.settings.getSettings(), callback);
        };
        /**
         * Fetch field autocompletes
         *
         * @param keyword
         */


        this.autocomplete = function (field, prefix, callback) {
          if (!field || !prefix || !callback || !util.isFunction(callback)) {
            throw "Illegal autocomplete parameters. Should be (field, prefix, callbackFunction)";
          }

          this.settings.setAutocompleteParams(field, prefix);

          if (!this.throttledAutocompleteFetch) {
            this.throttledAutocompleteFetch = throttle(this.settings.getSettings().throttleTimeMs, executeApiFetch);
          }

          this.throttledAutocompleteFetch(this.apiHostname, this.sitekey, 'autocomplete', this.settings.getSettings(), callback);
        };
        /**
         * Fetch facets without a facet group
         */


        this.fetchCustomApi = function (field, customFilterObject, callback) {
          if (!this.throttledSearchFetch) {
            this.throttledSearchFetch = throttle(this.settings.getSettings().throttleTimeMs, executeApiFetch);
          }

          var settingsCloned = Object.assign({}, this.settings.getSettings());
          settingsCloned.facetFields = settingsCloned.facetFields.filter(function (facetField) {
            return field === facetField;
          }); // this.throttledSearchFetch(this.apiHostname, this.sitekey, 'search', settingsCloned, callback, null, customFilterObject);

          executeApiFetch(this.apiHostname, this.sitekey, 'search', settingsCloned, callback, null, customFilterObject);
        };
        /**
         * Indexing API functions
         */


        this.getDocument = function (id) {
          return indexingapi.getDocument(this.apiHostname, this.sitekey, this.privatekey, id);
        };

        this.saveDocument = function (document) {
          return indexingapi.saveDocument(this.apiHostname, this.sitekey, this.privatekey, document);
        };

        this.saveDocumentsBatch = function (batch) {
          if (!batch || !batch.documents || !Array.isArray(batch.documents)) {
            throw "Please provide an array of documents: {documents: []}";
          }

          return indexingapi.saveDocumentsBatch(this.apiHostname, this.sitekey, this.privatekey, batch);
        };

        this.deleteDocument = function (id) {
          return indexingapi.deleteDocument(this.apiHostname, this.sitekey, this.privatekey, id);
        };

        this.deleteDocumentsBatch = function (batch) {
          if (!batch || !batch.documents || !Array.isArray(batch.documents)) {
            throw "Please provide an array of document ids: {documents: []}";
          }

          return indexingapi.deleteDocumentsBatch(this.apiHostname, this.sitekey, this.privatekey, batch);
        };
        /**
         * Public functions
         */


        this.setApiHostname = function (hostname) {
          this.apiHostname = hostname;
        };

        this.getSettings = function () {
          return this.settings.getSettings();
        };

        this.setLanguage = function (lang) {
          this.settings.setLanguage(lang);
        };

        this.setCategoryFilters = function (categories) {
          this.settings.setCategoryFilters(categories);
        };

        this.addCustomFieldFilter = function (fieldName, value) {
          this.settings.addCustomFieldFilter(fieldName, value);
        };

        this.removeCustomFieldFilter = function (fieldName, value) {
          this.settings.removeCustomFieldFilter(fieldName, value);
        };

        this.setPriceRangeFilter = function (minCents, maxCents) {
          this.settings.setPriceRangeFilter(minCents, maxCents);
        };

        this.setDateFilter = function (dateFrom, dateTo) {
          this.settings.setDateFilter(dateFrom, dateTo);
        };

        this.setJWT = function (jwt) {
          this.settings.setJWT(jwt);
        };

        this.setUserToken = function (token) {
          this.settings.setUserToken(token);
        };

        this.setPaging = function (page, pageSize, sortBy, sortOder) {
          this.settings.setPaging(page, pageSize, sortBy, sortOder);
        };

        this.nextPage = function () {
          this.settings.nextPage();
        };

        this.previousPage = function () {
          this.settings.previousPage();
        };

        this.setSuggestionsSize = function (size) {
          this.settings.setSuggestionsSize(size);
        };

        this.setAutocompleteSize = function (size) {
          this.settings.setAutocompleteSize(size);
        };

        this.addFacetField = function (fieldName) {
          this.settings.addFacetField(fieldName);
        };

        this.addRangeFacet = function (field, ranges) {
          this.settings.addRangeFacet(field, ranges);
        };

        this.addStatsField = function (field) {
          this.settings.addStatsField(field);
        };

        this.setNumberOfFacets = function (numFacets) {
          this.settings.setNumberOfFacets(numFacets);
        };

        this.setResultType = function (type) {
          this.settings.setResultType(type);
        };

        this.setPersonalizationEvents = function (events) {
          this.settings.setPersonalizationEvents(events);
        };

        this.setFilterObject = function (filter) {
          this.settings.setFilterObject(filter);
        };

        this.setShuffleAndLimitTo = function (shuffleAndLimitTo) {
          this.settings.setShuffleAndLimitTo(shuffleAndLimitTo);
        };

        this.setFuzzyMatch = function (fuzzy) {
          this.settings.setFuzzyMatch(fuzzy);
        };

        this.setPostfixWildcard = function (wildcard) {
          this.settings.setPostfixWildcard(wildcard);
        };

        this.setCollectAnalytics = function (collectAnalytics) {
          this.settings.setCollectAnalytics(collectAnalytics);
        };

        this.setThrottleTime = function (delay) {
          this.settings.setThrottleTime(delay);
        };

        this.setStatsSessionId = function (id) {
          this.sessionId = id;
        };

        this.getStatsSessionId = function () {
          return this.sessionId;
        };

        this.enableLogicalOperators = function (enableLogicalOperators) {
          this.settings.enableLogicalOperators(enableLogicalOperators);
        };

        this.sendStatsEvent = function (type, keyword, data) {
          if (type === 'search') {
            var data = {
              action: 'search',
              session: this.sessionId,
              keyword: keyword,
              numberOfResults: data.numberOfResults
            };
            sendStats(this.apiHostname, this.sitekey, data);
          } else if (type === 'click') {
            var data = {
              action: 'click',
              session: this.sessionId,
              keyword: keyword,
              docid: data.documentId,
              position: data.position
            };
            sendStats(this.apiHostname, this.sitekey, data);
          } else {
            throw "Illegal sendStatsEvent type parameters. Should be search or click)";
          }
        }; // Deprecated


        this.searchResultClicked = function (documentId, position) {
          this.sendStatsEvent('click', this.settings.getSettings().keyword, {
            documentId: documentId,
            position: position
          });
        };
      };

      module.exports = client;

      /***/ }),
    /* 5 */
    /***/ (function(module, exports, __webpack_require__) {

      "use strict";


      __webpack_require__(0).polyfill();

      __webpack_require__(1);
      /**
       * Fetch search results of search suggestions from the Addsearch API
       */


      var executeApiFetch = function executeApiFetch(apiHostname, sitekey, type, settings, cb, fuzzyRetry, customFilterObject) {
        var RESPONSE_BAD_REQUEST = 400;
        var RESPONSE_SERVER_ERROR = 500;

        var settingToQueryParam = function settingToQueryParam(setting, key) {
          if (setting || setting === false) {
            return '&' + key + '=' + setting;
          }

          return '';
        }; // Validate query type


        if (type !== 'search' && type !== 'suggest' && type !== 'autocomplete') {
          cb({
            error: {
              response: RESPONSE_BAD_REQUEST,
              message: 'invalid query type'
            }
          });
          return;
        } // Keyword and query string


        var kw = '';
        var qs = ''; // API Path (eq. /search, /suggest, /autocomplete/document-field)

        var apiPath = null; // Search

        if (type === 'search') {
          // Path
          apiPath = type; // Keyword

          kw = settings.keyword; // Boolean operators (AND, OR, NOT) uppercase

          kw = settings.enableLogicalOperators ? kw.replace(/ and /g, ' AND ').replace(/ or /g, ' OR ').replace(/ not /g, ' NOT ') : kw.replace(/ AND /g, ' and ').replace(/ OR /g, ' or ').replace(/ NOT /g, ' not '); // Escape

          kw = encodeURIComponent(kw); // Fuzzy

          var fuzzy = settings.fuzzy;

          if (fuzzy === 'retry') {
            // First call, non fuzzy
            if (fuzzyRetry !== true) {
              fuzzy = false;
            } // Second call, fuzzy
            else {
              fuzzy = true;
            }
          } // Construct query string from settings


          if (type === 'search') {
            qs = settingToQueryParam(settings.lang, 'lang') + settingToQueryParam(fuzzy, 'fuzzy') + settingToQueryParam(settings.collectAnalytics, 'collectAnalytics') + settingToQueryParam(settings.postfixWildcard, 'postfixWildcard') + settingToQueryParam(settings.categories, 'categories') + settingToQueryParam(settings.priceFromCents, 'priceFromCents') + settingToQueryParam(settings.priceToCents, 'priceToCents') + settingToQueryParam(settings.dateFrom, 'dateFrom') + settingToQueryParam(settings.dateTo, 'dateTo') + settingToQueryParam(settings.paging.page, 'page') + settingToQueryParam(settings.paging.pageSize, 'limit') + settingToQueryParam(settings.paging.sortBy, 'sort') + settingToQueryParam(settings.paging.sortOrder, 'order') + settingToQueryParam(settings.shuffleAndLimitTo, 'shuffleAndLimitTo') + settingToQueryParam(settings.jwt, 'jwt') + settingToQueryParam(settings.resultType, 'resultType') + settingToQueryParam(settings.userToken, 'userToken') + settingToQueryParam(settings.numFacets, 'numFacets'); // Add custom field filters

            if (settings.customFieldFilters) {
              for (var i = 0; i < settings.customFieldFilters.length; i++) {
                qs = qs + '&customField=' + settings.customFieldFilters[i];
              }
            } // Add facet fields


            if (settings.facetFields) {
              for (var i = 0; i < settings.facetFields.length; i++) {
                qs = qs + '&facet=' + settings.facetFields[i];
              }
            } // Range facets


            if (settings.rangeFacets) {
              qs = qs + '&rangeFacets=' + JSON.stringify(settings.rangeFacets);
            } // Stats fields


            if (settings.statsFields) {
              for (var i = 0; i < settings.statsFields.length; i++) {
                qs = qs + '&fieldStat=' + settings.statsFields[i];
              }
            } // Personalization events


            if (settings.personalizationEvents && Array.isArray(settings.personalizationEvents)) {
              for (var i = 0; i < settings.personalizationEvents.length; i++) {
                var obj = settings.personalizationEvents[i];
                var key = Object.keys(obj);
                qs = qs + '&personalizationEvent=' + encodeURIComponent(key + '=' + obj[key]);
              }
            } // Filter object


            if (customFilterObject) {
              qs = qs + '&filter=' + JSON.stringify(customFilterObject);
            } else if (settings.filterObject) {
              qs = qs + '&filter=' + JSON.stringify(settings.filterObject);
            }
          }
        } // Suggest
        else if (type === 'suggest') {
          apiPath = type;
          qs = settingToQueryParam(settings.suggestionsSize, 'size');
          kw = settings.suggestionsPrefix;
        } // Autocomplete
        else if (type === 'autocomplete') {
          apiPath = 'autocomplete/document-field';
          qs = settingToQueryParam(settings.autocomplete.field, 'source') + settingToQueryParam(settings.autocomplete.size, 'size');
          kw = settings.autocomplete.prefix;
        } // Execute API call


        fetch('https://' + apiHostname + '/v1/' + apiPath + '/' + sitekey + '?term=' + kw + qs).then(function (response) {
          return response.json();
        }).then(function (json) {
          // Search again with fuzzy=true if no hits
          if (type === 'search' && settings.fuzzy === 'retry' && json.total_hits === 0 && fuzzyRetry !== true) {
            executeApiFetch(apiHostname, sitekey, type, settings, cb, true);
          } // Fuzzy not "retry" OR fuzzyRetry already returning
          else {
            // Cap fuzzy results to one page as quality decreases quickly
            if (fuzzyRetry === true) {
              var pageSize = settings.paging.pageSize;

              if (json.total_hits >= pageSize) {
                json.total_hits = pageSize;
              }
            } // Callback


            cb(json);
          }
        }).catch(function (ex) {
          console.log(ex);
          cb({
            error: {
              response: RESPONSE_SERVER_ERROR,
              message: 'invalid server response'
            }
          });
        });
      };

      module.exports = executeApiFetch;

      /***/ }),
    /* 6 */
    /***/ (function(module, exports) {

// shim for using process in browser
      var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

      var cachedSetTimeout;
      var cachedClearTimeout;

      function defaultSetTimout() {
        throw new Error('setTimeout has not been defined');
      }
      function defaultClearTimeout () {
        throw new Error('clearTimeout has not been defined');
      }
      (function () {
        try {
          if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
          } else {
            cachedSetTimeout = defaultSetTimout;
          }
        } catch (e) {
          cachedSetTimeout = defaultSetTimout;
        }
        try {
          if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
          } else {
            cachedClearTimeout = defaultClearTimeout;
          }
        } catch (e) {
          cachedClearTimeout = defaultClearTimeout;
        }
      } ())
      function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
          //normal enviroments in sane situations
          return setTimeout(fun, 0);
        }
        // if setTimeout wasn't available but was latter defined
        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
        }
        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedSetTimeout(fun, 0);
        } catch(e){
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
          } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
          }
        }


      }
      function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
          //normal enviroments in sane situations
          return clearTimeout(marker);
        }
        // if clearTimeout wasn't available but was latter defined
        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
        }
        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedClearTimeout(marker);
        } catch (e){
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
          } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
          }
        }



      }
      var queue = [];
      var draining = false;
      var currentQueue;
      var queueIndex = -1;

      function cleanUpNextTick() {
        if (!draining || !currentQueue) {
          return;
        }
        draining = false;
        if (currentQueue.length) {
          queue = currentQueue.concat(queue);
        } else {
          queueIndex = -1;
        }
        if (queue.length) {
          drainQueue();
        }
      }

      function drainQueue() {
        if (draining) {
          return;
        }
        var timeout = runTimeout(cleanUpNextTick);
        draining = true;

        var len = queue.length;
        while(len) {
          currentQueue = queue;
          queue = [];
          while (++queueIndex < len) {
            if (currentQueue) {
              currentQueue[queueIndex].run();
            }
          }
          queueIndex = -1;
          len = queue.length;
        }
        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
      }

      process.nextTick = function (fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
          }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
        }
      };

// v8 likes predictible objects
      function Item(fun, array) {
        this.fun = fun;
        this.array = array;
      }
      Item.prototype.run = function () {
        this.fun.apply(null, this.array);
      };
      process.title = 'browser';
      process.browser = true;
      process.env = {};
      process.argv = [];
      process.version = ''; // empty string to avoid regexp issues
      process.versions = {};

      function noop() {}

      process.on = noop;
      process.addListener = noop;
      process.once = noop;
      process.off = noop;
      process.removeListener = noop;
      process.removeAllListeners = noop;
      process.emit = noop;
      process.prependListener = noop;
      process.prependOnceListener = noop;

      process.listeners = function (name) { return [] }

      process.binding = function (name) {
        throw new Error('process.binding is not supported');
      };

      process.cwd = function () { return '/' };
      process.chdir = function (dir) {
        throw new Error('process.chdir is not supported');
      };
      process.umask = function() { return 0; };


      /***/ }),
    /* 7 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {

      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Headers", function() { return Headers; });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Request", function() { return Request; });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Response", function() { return Response; });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DOMException", function() { return DOMException; });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetch", function() { return fetch; });
      var global =
        (typeof globalThis !== 'undefined' && globalThis) ||
        (typeof self !== 'undefined' && self) ||
        (typeof global !== 'undefined' && global)

      var support = {
        searchParams: 'URLSearchParams' in global,
        iterable: 'Symbol' in global && 'iterator' in Symbol,
        blob:
          'FileReader' in global &&
          'Blob' in global &&
          (function() {
            try {
              new Blob()
              return true
            } catch (e) {
              return false
            }
          })(),
        formData: 'FormData' in global,
        arrayBuffer: 'ArrayBuffer' in global
      }

      function isDataView(obj) {
        return obj && DataView.prototype.isPrototypeOf(obj)
      }

      if (support.arrayBuffer) {
        var viewClasses = [
          '[object Int8Array]',
          '[object Uint8Array]',
          '[object Uint8ClampedArray]',
          '[object Int16Array]',
          '[object Uint16Array]',
          '[object Int32Array]',
          '[object Uint32Array]',
          '[object Float32Array]',
          '[object Float64Array]'
        ]

        var isArrayBufferView =
          ArrayBuffer.isView ||
          function(obj) {
            return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
          }
      }

      function normalizeName(name) {
        if (typeof name !== 'string') {
          name = String(name)
        }
        if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === '') {
          throw new TypeError('Invalid character in header field name: "' + name + '"')
        }
        return name.toLowerCase()
      }

      function normalizeValue(value) {
        if (typeof value !== 'string') {
          value = String(value)
        }
        return value
      }

// Build a destructive iterator for the value list
      function iteratorFor(items) {
        var iterator = {
          next: function() {
            var value = items.shift()
            return {done: value === undefined, value: value}
          }
        }

        if (support.iterable) {
          iterator[Symbol.iterator] = function() {
            return iterator
          }
        }

        return iterator
      }

      function Headers(headers) {
        this.map = {}

        if (headers instanceof Headers) {
          headers.forEach(function(value, name) {
            this.append(name, value)
          }, this)
        } else if (Array.isArray(headers)) {
          headers.forEach(function(header) {
            this.append(header[0], header[1])
          }, this)
        } else if (headers) {
          Object.getOwnPropertyNames(headers).forEach(function(name) {
            this.append(name, headers[name])
          }, this)
        }
      }

      Headers.prototype.append = function(name, value) {
        name = normalizeName(name)
        value = normalizeValue(value)
        var oldValue = this.map[name]
        this.map[name] = oldValue ? oldValue + ', ' + value : value
      }

      Headers.prototype['delete'] = function(name) {
        delete this.map[normalizeName(name)]
      }

      Headers.prototype.get = function(name) {
        name = normalizeName(name)
        return this.has(name) ? this.map[name] : null
      }

      Headers.prototype.has = function(name) {
        return this.map.hasOwnProperty(normalizeName(name))
      }

      Headers.prototype.set = function(name, value) {
        this.map[normalizeName(name)] = normalizeValue(value)
      }

      Headers.prototype.forEach = function(callback, thisArg) {
        for (var name in this.map) {
          if (this.map.hasOwnProperty(name)) {
            callback.call(thisArg, this.map[name], name, this)
          }
        }
      }

      Headers.prototype.keys = function() {
        var items = []
        this.forEach(function(value, name) {
          items.push(name)
        })
        return iteratorFor(items)
      }

      Headers.prototype.values = function() {
        var items = []
        this.forEach(function(value) {
          items.push(value)
        })
        return iteratorFor(items)
      }

      Headers.prototype.entries = function() {
        var items = []
        this.forEach(function(value, name) {
          items.push([name, value])
        })
        return iteratorFor(items)
      }

      if (support.iterable) {
        Headers.prototype[Symbol.iterator] = Headers.prototype.entries
      }

      function consumed(body) {
        if (body.bodyUsed) {
          return Promise.reject(new TypeError('Already read'))
        }
        body.bodyUsed = true
      }

      function fileReaderReady(reader) {
        return new Promise(function(resolve, reject) {
          reader.onload = function() {
            resolve(reader.result)
          }
          reader.onerror = function() {
            reject(reader.error)
          }
        })
      }

      function readBlobAsArrayBuffer(blob) {
        var reader = new FileReader()
        var promise = fileReaderReady(reader)
        reader.readAsArrayBuffer(blob)
        return promise
      }

      function readBlobAsText(blob) {
        var reader = new FileReader()
        var promise = fileReaderReady(reader)
        reader.readAsText(blob)
        return promise
      }

      function readArrayBufferAsText(buf) {
        var view = new Uint8Array(buf)
        var chars = new Array(view.length)

        for (var i = 0; i < view.length; i++) {
          chars[i] = String.fromCharCode(view[i])
        }
        return chars.join('')
      }

      function bufferClone(buf) {
        if (buf.slice) {
          return buf.slice(0)
        } else {
          var view = new Uint8Array(buf.byteLength)
          view.set(new Uint8Array(buf))
          return view.buffer
        }
      }

      function Body() {
        this.bodyUsed = false

        this._initBody = function(body) {
          /*
            fetch-mock wraps the Response object in an ES6 Proxy to
            provide useful test harness features such as flush. However, on
            ES5 browsers without fetch or Proxy support pollyfills must be used;
            the proxy-pollyfill is unable to proxy an attribute unless it exists
            on the object before the Proxy is created. This change ensures
            Response.bodyUsed exists on the instance, while maintaining the
            semantic of setting Request.bodyUsed in the constructor before
            _initBody is called.
          */
          this.bodyUsed = this.bodyUsed
          this._bodyInit = body
          if (!body) {
            this._bodyText = ''
          } else if (typeof body === 'string') {
            this._bodyText = body
          } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
            this._bodyBlob = body
          } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
            this._bodyFormData = body
          } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
            this._bodyText = body.toString()
          } else if (support.arrayBuffer && support.blob && isDataView(body)) {
            this._bodyArrayBuffer = bufferClone(body.buffer)
            // IE 10-11 can't handle a DataView body.
            this._bodyInit = new Blob([this._bodyArrayBuffer])
          } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
            this._bodyArrayBuffer = bufferClone(body)
          } else {
            this._bodyText = body = Object.prototype.toString.call(body)
          }

          if (!this.headers.get('content-type')) {
            if (typeof body === 'string') {
              this.headers.set('content-type', 'text/plain;charset=UTF-8')
            } else if (this._bodyBlob && this._bodyBlob.type) {
              this.headers.set('content-type', this._bodyBlob.type)
            } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
              this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
            }
          }
        }

        if (support.blob) {
          this.blob = function() {
            var rejected = consumed(this)
            if (rejected) {
              return rejected
            }

            if (this._bodyBlob) {
              return Promise.resolve(this._bodyBlob)
            } else if (this._bodyArrayBuffer) {
              return Promise.resolve(new Blob([this._bodyArrayBuffer]))
            } else if (this._bodyFormData) {
              throw new Error('could not read FormData body as blob')
            } else {
              return Promise.resolve(new Blob([this._bodyText]))
            }
          }

          this.arrayBuffer = function() {
            if (this._bodyArrayBuffer) {
              var isConsumed = consumed(this)
              if (isConsumed) {
                return isConsumed
              }
              if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
                return Promise.resolve(
                  this._bodyArrayBuffer.buffer.slice(
                    this._bodyArrayBuffer.byteOffset,
                    this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
                  )
                )
              } else {
                return Promise.resolve(this._bodyArrayBuffer)
              }
            } else {
              return this.blob().then(readBlobAsArrayBuffer)
            }
          }
        }

        this.text = function() {
          var rejected = consumed(this)
          if (rejected) {
            return rejected
          }

          if (this._bodyBlob) {
            return readBlobAsText(this._bodyBlob)
          } else if (this._bodyArrayBuffer) {
            return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
          } else if (this._bodyFormData) {
            throw new Error('could not read FormData body as text')
          } else {
            return Promise.resolve(this._bodyText)
          }
        }

        if (support.formData) {
          this.formData = function() {
            return this.text().then(decode)
          }
        }

        this.json = function() {
          return this.text().then(JSON.parse)
        }

        return this
      }

// HTTP methods whose capitalization should be normalized
      var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

      function normalizeMethod(method) {
        var upcased = method.toUpperCase()
        return methods.indexOf(upcased) > -1 ? upcased : method
      }

      function Request(input, options) {
        if (!(this instanceof Request)) {
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
        }

        options = options || {}
        var body = options.body

        if (input instanceof Request) {
          if (input.bodyUsed) {
            throw new TypeError('Already read')
          }
          this.url = input.url
          this.credentials = input.credentials
          if (!options.headers) {
            this.headers = new Headers(input.headers)
          }
          this.method = input.method
          this.mode = input.mode
          this.signal = input.signal
          if (!body && input._bodyInit != null) {
            body = input._bodyInit
            input.bodyUsed = true
          }
        } else {
          this.url = String(input)
        }

        this.credentials = options.credentials || this.credentials || 'same-origin'
        if (options.headers || !this.headers) {
          this.headers = new Headers(options.headers)
        }
        this.method = normalizeMethod(options.method || this.method || 'GET')
        this.mode = options.mode || this.mode || null
        this.signal = options.signal || this.signal
        this.referrer = null

        if ((this.method === 'GET' || this.method === 'HEAD') && body) {
          throw new TypeError('Body not allowed for GET or HEAD requests')
        }
        this._initBody(body)

        if (this.method === 'GET' || this.method === 'HEAD') {
          if (options.cache === 'no-store' || options.cache === 'no-cache') {
            // Search for a '_' parameter in the query string
            var reParamSearch = /([?&])_=[^&]*/
            if (reParamSearch.test(this.url)) {
              // If it already exists then set the value with the current time
              this.url = this.url.replace(reParamSearch, '$1_=' + new Date().getTime())
            } else {
              // Otherwise add a new '_' parameter to the end with the current time
              var reQueryString = /\?/
              this.url += (reQueryString.test(this.url) ? '&' : '?') + '_=' + new Date().getTime()
            }
          }
        }
      }

      Request.prototype.clone = function() {
        return new Request(this, {body: this._bodyInit})
      }

      function decode(body) {
        var form = new FormData()
        body
          .trim()
          .split('&')
          .forEach(function(bytes) {
            if (bytes) {
              var split = bytes.split('=')
              var name = split.shift().replace(/\+/g, ' ')
              var value = split.join('=').replace(/\+/g, ' ')
              form.append(decodeURIComponent(name), decodeURIComponent(value))
            }
          })
        return form
      }

      function parseHeaders(rawHeaders) {
        var headers = new Headers()
        // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
        // https://tools.ietf.org/html/rfc7230#section-3.2
        var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
        // Avoiding split via regex to work around a common IE11 bug with the core-js 3.6.0 regex polyfill
        // https://github.com/github/fetch/issues/748
        // https://github.com/zloirock/core-js/issues/751
        preProcessedHeaders
          .split('\r')
          .map(function(header) {
            return header.indexOf('\n') === 0 ? header.substr(1, header.length) : header
          })
          .forEach(function(line) {
            var parts = line.split(':')
            var key = parts.shift().trim()
            if (key) {
              var value = parts.join(':').trim()
              headers.append(key, value)
            }
          })
        return headers
      }

      Body.call(Request.prototype)

      function Response(bodyInit, options) {
        if (!(this instanceof Response)) {
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
        }
        if (!options) {
          options = {}
        }

        this.type = 'default'
        this.status = options.status === undefined ? 200 : options.status
        this.ok = this.status >= 200 && this.status < 300
        this.statusText = options.statusText === undefined ? '' : '' + options.statusText
        this.headers = new Headers(options.headers)
        this.url = options.url || ''
        this._initBody(bodyInit)
      }

      Body.call(Response.prototype)

      Response.prototype.clone = function() {
        return new Response(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new Headers(this.headers),
          url: this.url
        })
      }

      Response.error = function() {
        var response = new Response(null, {status: 0, statusText: ''})
        response.type = 'error'
        return response
      }

      var redirectStatuses = [301, 302, 303, 307, 308]

      Response.redirect = function(url, status) {
        if (redirectStatuses.indexOf(status) === -1) {
          throw new RangeError('Invalid status code')
        }

        return new Response(null, {status: status, headers: {location: url}})
      }

      var DOMException = global.DOMException
      try {
        new DOMException()
      } catch (err) {
        DOMException = function(message, name) {
          this.message = message
          this.name = name
          var error = Error(message)
          this.stack = error.stack
        }
        DOMException.prototype = Object.create(Error.prototype)
        DOMException.prototype.constructor = DOMException
      }

      function fetch(input, init) {
        return new Promise(function(resolve, reject) {
          var request = new Request(input, init)

          if (request.signal && request.signal.aborted) {
            return reject(new DOMException('Aborted', 'AbortError'))
          }

          var xhr = new XMLHttpRequest()

          function abortXhr() {
            xhr.abort()
          }

          xhr.onload = function() {
            var options = {
              status: xhr.status,
              statusText: xhr.statusText,
              headers: parseHeaders(xhr.getAllResponseHeaders() || '')
            }
            options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
            var body = 'response' in xhr ? xhr.response : xhr.responseText
            setTimeout(function() {
              resolve(new Response(body, options))
            }, 0)
          }

          xhr.onerror = function() {
            setTimeout(function() {
              reject(new TypeError('Network request failed'))
            }, 0)
          }

          xhr.ontimeout = function() {
            setTimeout(function() {
              reject(new TypeError('Network request failed'))
            }, 0)
          }

          xhr.onabort = function() {
            setTimeout(function() {
              reject(new DOMException('Aborted', 'AbortError'))
            }, 0)
          }

          function fixUrl(url) {
            try {
              return url === '' && global.location.href ? global.location.href : url
            } catch (e) {
              return url
            }
          }

          xhr.open(request.method, fixUrl(request.url), true)

          if (request.credentials === 'include') {
            xhr.withCredentials = true
          } else if (request.credentials === 'omit') {
            xhr.withCredentials = false
          }

          if ('responseType' in xhr) {
            if (support.blob) {
              xhr.responseType = 'blob'
            } else if (
              support.arrayBuffer &&
              request.headers.get('Content-Type') &&
              request.headers.get('Content-Type').indexOf('application/octet-stream') !== -1
            ) {
              xhr.responseType = 'arraybuffer'
            }
          }

          if (init && typeof init.headers === 'object' && !(init.headers instanceof Headers)) {
            Object.getOwnPropertyNames(init.headers).forEach(function(name) {
              xhr.setRequestHeader(name, normalizeValue(init.headers[name]))
            })
          } else {
            request.headers.forEach(function(value, name) {
              xhr.setRequestHeader(name, value)
            })
          }

          if (request.signal) {
            request.signal.addEventListener('abort', abortXhr)

            xhr.onreadystatechange = function() {
              // DONE (success or failure)
              if (xhr.readyState === 4) {
                request.signal.removeEventListener('abort', abortXhr)
              }
            }
          }

          xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
        })
      }

      fetch.polyfill = true

      if (!global.fetch) {
        global.fetch = fetch
        global.Headers = Headers
        global.Request = Request
        global.Response = Response
      }


      /***/ }),
    /* 8 */
    /***/ (function(module, exports, __webpack_require__) {

      "use strict";


      __webpack_require__(1);

      var util = __webpack_require__(3);

      var Promise = __webpack_require__(0).Promise;

      var getHeaders = function getHeaders(sitekey, privatekey) {
        return {
          'Authorization': 'Basic ' + util.base64(sitekey + ':' + privatekey),
          'Content-Type': 'application/json'
        };
      };
      /**
       * Fetch document
       */


      var getDocument = function getDocument(apiHostname, sitekey, privatekey, id) {
        var promise = new Promise(function (resolve, reject) {
          fetch('https://' + apiHostname + '/v2/indices/' + sitekey + '/documents/' + id, {
            method: 'GET',
            headers: getHeaders(sitekey, privatekey)
          }).then(function (response) {
            if (response.status == 200) {
              resolve(response.json());
            } else {
              reject({
                status: response.status,
                text: response.statusText
              });
            }
          }).catch(function (ex) {
            reject({
              status: 400,
              text: ex
            });
          });
        });
        return promise;
      };
      /**
       * Add document
       */


      var saveDocument = function saveDocument(apiHostname, sitekey, privatekey, document) {
        // If the doc has id or url field, PUT instead of POST
        var isPut = document.id || document.url;
        var promise = new Promise(function (resolve, reject) {
          fetch('https://' + apiHostname + '/v2/indices/' + sitekey + '/documents/', {
            method: isPut ? 'PUT' : 'POST',
            headers: getHeaders(sitekey, privatekey),
            body: JSON.stringify(document)
          }).then(function (response) {
            if (response.status == 202) {
              resolve({
                status: response.status,
                text: response.statusText
              });
            } else {
              reject({
                status: response.status,
                text: response.statusText
              });
            }
          }).catch(function (ex) {
            reject({
              status: 400,
              text: ex
            });
          });
        });
        return promise;
      };
      /**
       * Batch add documents
       */


      var saveDocumentsBatch = function saveDocumentsBatch(apiHostname, sitekey, privatekey, documents) {
        var promise = new Promise(function (resolve, reject) {
          fetch('https://' + apiHostname + '/v2/indices/' + sitekey + '/documents:batch', {
            method: 'PUT',
            headers: getHeaders(sitekey, privatekey),
            body: JSON.stringify(documents)
          }).then(function (response) {
            if (response.status == 202) {
              resolve({
                status: response.status,
                text: response.statusText
              });
            } else {
              reject({
                status: response.status,
                text: response.statusText
              });
            }
          }).catch(function (ex) {
            reject({
              status: 400,
              text: ex
            });
          });
        });
        return promise;
      };
      /**
       * Delete documents
       */


      var deleteDocument = function deleteDocument(apiHostname, sitekey, privatekey, id) {
        var promise = new Promise(function (resolve, reject) {
          fetch('https://' + apiHostname + '/v2/indices/' + sitekey + '/documents/' + id, {
            method: 'DELETE',
            headers: getHeaders(sitekey, privatekey)
          }).then(function (response) {
            if (response.status == 202) {
              resolve({
                status: response.status,
                text: response.statusText
              });
            } else {
              reject({
                status: response.status,
                text: response.statusText
              });
            }
          }).catch(function (ex) {
            reject({
              status: 400,
              text: ex
            });
          });
        });
        return promise;
      };
      /**
       * Batch delete documents
       */


      var deleteDocumentsBatch = function deleteDocumentsBatch(apiHostname, sitekey, privatekey, batch) {
        var promise = new Promise(function (resolve, reject) {
          fetch('https://' + apiHostname + '/v2/indices/' + sitekey + '/documents:batch', {
            method: 'DELETE',
            headers: getHeaders(sitekey, privatekey),
            body: JSON.stringify(batch)
          }).then(function (response) {
            if (response.status == 202) {
              resolve({
                status: response.status,
                text: response.statusText
              });
            } else {
              reject({
                status: response.status,
                text: response.statusText
              });
            }
          }).catch(function (ex) {
            reject({
              status: 400,
              text: ex
            });
          });
        });
        return promise;
      };

      module.exports = {
        getDocument: getDocument,
        saveDocument: saveDocument,
        saveDocumentsBatch: saveDocumentsBatch,
        deleteDocument: deleteDocument,
        deleteDocumentsBatch: deleteDocumentsBatch
      };

      /***/ }),
    /* 9 */
    /***/ (function(module, exports, __webpack_require__) {

      "use strict";


      __webpack_require__(0).polyfill();

      __webpack_require__(1);

      var sendStats = function sendStats(apiHostname, sitekey, data) {
        // Beacon in browsers
        if (typeof window !== 'undefined' && window.navigator && window.navigator.sendBeacon) {
          navigator.sendBeacon('https://' + apiHostname + '/v1/stats/' + sitekey + '/', JSON.stringify(data));
        } // POST in node
        else {
          fetch('https://' + apiHostname + '/v1/stats/' + sitekey + '/', {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain'
            },
            body: JSON.stringify(data)
          });
        }
      };

      module.exports = sendStats;

      /***/ }),
    /* 10 */
    /***/ (function(module, exports, __webpack_require__) {

      "use strict";


      var settings = function settings() {
        this.settings = {
          keyword: '*',
          callback: null,
          throttleTimeMs: 200,
          fuzzy: 'auto',
          paging: {
            page: 1,
            pageSize: 10,
            sortBy: 'relevance',
            sortOrder: 'desc'
          },
          customFieldFilters: [],
          userToken: null,
          suggestionsSize: 10,
          facetFields: [],
          autocomplete: {
            size: 10
          },
          enableLogicalOperators: false
        };

        this.getSettings = function () {
          return this.settings;
        };

        this.setKeyword = function (keyword) {
          this.settings.keyword = keyword || '*';
        };

        this.setCallback = function (cb) {
          this.settings.callback = cb;
        };

        this.setThrottleTime = function (delay) {
          this.settings.throttleTimeMs = delay;
        };

        this.setSuggestionsPrefix = function (prefix) {
          this.settings.suggestionsPrefix = prefix;
        };

        this.setSuggestionsSize = function (size) {
          this.settings.suggestionsSize = size;
        };

        this.setAutocompleteSize = function (size) {
          this.settings.autocomplete.size = size;
        };

        this.setAutocompleteParams = function (field, prefix) {
          this.settings.autocomplete.field = field;
          this.settings.autocomplete.prefix = prefix;
        };

        this.setLanguage = function (language) {
          if (language && language.length !== 2) {
            throw "use 2-char language code (e.g. \"en\")";
          }

          this.settings.lang = language;
        };

        this.setFuzzyMatch = function (fuzzy) {
          if (fuzzy !== true && fuzzy !== false && fuzzy !== 'auto' && fuzzy !== 'retry') {
            throw "fuzzy matching can be true, false, 'auto', or 'retry'";
          }

          this.settings.fuzzy = fuzzy;
        };

        this.enableLogicalOperators = function (enableLogicalOperators) {
          this.settings.enableLogicalOperators = enableLogicalOperators;
        };

        this.setPostfixWildcard = function (wildcard) {
          this.settings.postfixWildcard = wildcard;
        };

        this.setCollectAnalytics = function (collectAnalytics) {
          this.settings.collectAnalytics = collectAnalytics;
        };

        this.setCategoryFilters = function (categories) {
          this.settings.categories = categories;
        };

        this.setFilterObject = function (filter) {
          this.settings.filterObject = filter;
        };

        this.setPriceRangeFilter = function (minCents, maxCents) {
          this.settings.priceFromCents = minCents;
          this.settings.priceToCents = maxCents;
        };

        this.addCustomFieldFilter = function (fieldName, value) {
          var filter = encodeURIComponent(fieldName + '=' + value);

          if (this.settings.customFieldFilters.indexOf(filter) === -1) {
            this.settings.customFieldFilters.push(filter);
          }
        };

        this.removeCustomFieldFilter = function (fieldName, value) {
          var removeAll = false;
          var filter = encodeURIComponent(fieldName + '=' + value); // Remove all by fieldName

          if (!value) {
            removeAll = true;
            filter = encodeURIComponent(fieldName + '=');
          }

          for (var i = this.settings.customFieldFilters.length; i > 0; i--) {
            var v = this.settings.customFieldFilters[i - 1];

            if (removeAll && v.indexOf(filter) === 0) {
              this.settings.customFieldFilters.splice(i - 1, 1);
            } else if (v === filter) {
              this.settings.customFieldFilters.splice(i - 1, 1);
            }
          }
        };

        this.setDateFilter = function (dateFrom, dateTo) {
          this.settings.dateFrom = dateFrom;
          this.settings.dateTo = dateTo;
        };

        this.setKeyword = function (keyword) {
          this.settings.keyword = keyword || '*';
        };

        this.setJWT = function (jwt) {
          this.settings.jwt = jwt;
        };

        this.setUserToken = function (token) {
          this.settings.userToken = token;
        };

        this.setPersonalizationEvents = function (events) {
          this.settings.personalizationEvents = events;
        };

        this.setResultType = function (type) {
          this.settings.resultType = type;
        };

        this.addFacetField = function (field) {
          if (this.settings.facetFields.indexOf(field) === -1) {
            this.settings.facetFields.push(field);
          }
        };

        this.addRangeFacet = function (field, ranges) {
          if (!this.settings.rangeFacets) {
            this.settings.rangeFacets = [];
          }

          this.settings.rangeFacets.push({
            field: field,
            ranges: ranges
          });
        };

        this.addStatsField = function (field) {
          if (!this.settings.statsFields) {
            this.settings.statsFields = [];
          }

          if (this.settings.statsFields.indexOf(field) === -1) {
            this.settings.statsFields.push(field);
          }
        };

        this.setNumberOfFacets = function (numFacets) {
          this.settings.numFacets = numFacets;
        };

        this.setPaging = function (page, pageSize, sortBy, sortOrder) {
          // Validate
          if (page < 1) {
            throw "page must be 1 or bigger";
          }

          if (pageSize < 1 || pageSize > 300) {
            throw "pageSize must be 1-300";
          }

          if (sortOrder !== 'asc' && sortOrder !== 'desc') {
            throw "sortOrder must be asc or desc";
          }

          this.settings.paging.page = page;
          this.settings.paging.pageSize = pageSize;
          this.settings.paging.sortBy = sortBy;
          this.settings.paging.sortOrder = sortOrder;
        };

        this.setShuffleAndLimitTo = function (shuffleAndLimitTo) {
          this.settings.shuffleAndLimitTo = shuffleAndLimitTo;
        };

        this.nextPage = function () {
          this.settings.paging.page = this.settings.paging.page + 1;
        };

        this.previousPage = function () {
          if (this.settings.paging.page > 0) {
            this.settings.paging.page = this.settings.paging.page - 1;
          }
        };
      };

      module.exports = settings;

      /***/ }),
    /* 11 */
    /***/ (function(module, exports) {

      var throttle = function throttle(delay, callback) {
        // last time callback was executed.
        var lastExec = 0; // returned by setTimeout

        var timeout; // Clear existing timeout

        function clearExistingTimeout() {
          if (timeout) {
            clearTimeout(timeout);
          }
        }
        /*
         * Wrap the callback inside a throttled function
         */


        function wrapper() {
          var self = this;
          var elapsed = Date.now() - lastExec;
          var args = arguments; // Execute callback function

          function exec() {
            lastExec = Date.now();
            callback.apply(self, args);
          }

          clearExistingTimeout(); // Execute

          if (elapsed > delay) {
            exec();
          } // Schedule for a later execution
          else {
            timeout = setTimeout(exec, delay - elapsed);
          }
        } // Return the wrapper function.


        return wrapper;
      };

      module.exports = throttle;

      /***/ })
    /******/ ]);