(function (root) {

'use strict';

var STATUS_PENDING = 'pending';
var STATUS_FULFILLED = 'fulfilled';
var STATUS_REJECTED = 'rejected';

function isObject(obj) {
    return typeof obj === 'object' && obj;
}

function isFunction(fn) {
    return typeof fn === 'function';
}

function isPromise(p) {
    return p instanceof Promise;
}

var nextTick;

if (typeof process !== 'undefined'
    && process
    && isFunction(process.nextTick)
) {
    nextTick = function (fn) {
        process.nextTick(fn);
    };
}
else if (isFunction(setImmediate)) {
    nextTick = setImmediate;
}
else {
    nextTick = setTimeout;
}

// 使用 resolvePromise 方法来解析回调函数的结果
function resolvePromise(bridgePromise, promise, resolve, reject) {

    if (bridgepromise === promise) {

        return reject(new TypeError('error'));

    }

    if (promise instanceof Promise) {

        if (promise.status === STATUS_PENDING) {

            promise.then(
                function (data) {
                    resolvePromise(bridgePromise, data, resolve, reject);
                },
                function (error) {
                    reject(error);
                }
            );

        }
        else {
            promise.then(resolve, reject);
        }

    }
    else {
        resolve(promise);
    }
}

function Promise(callback) {

    var me = this;

    me.status = STATUS_PENDING;
    me.onFulfilledCallbacks = [ ];
    me.onRejectedCallbacks = [ ];

    var resolve = function (value) {

        if (me.status !== STATUS_PENDING) {
            return;
        }

        nextTick(function () {
            me.status = STATUS_FULFILLED;
            me.value = value;

            me.onFulfilledCallbacks.forEach(
                function (fn) {
                    fn(me.value)
                }
            );
        });

    };

    var reject = function (reason) {
        if (me.status !== STATUS_PENDING) {
            return;
        }
        nextTick(function () {
            me.status = STATUS_REJECTED;
            me.reason = reason;
            me.onRejectedCallbacks.forEach(
                function (fn) {
                    fn(me.reason)
                }
            );
        });
    };

    callback(
        resolve,
        reject
    );

}

var proto = Promise.prototype;

proto.then = function (onFulfilled, onRejected) {

    var me = this;

    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value;
    onRejected = typeof onRejected === "function" ? onRejected : error => { throw error };

    if (me.status === STATUS_PENDING) {

        return new Promise(function(resolve, reject) {

            me.onFulfilledCallbacks.push((value) => {
                try {
                    resolvePromise(bridgePromise, onFulfilled(value), resolve, reject);
                }
                catch (error) {
                    reject(error);
                }
            });

            me.onRejectedCallbacks.push((error) => {
                try {
                    resolvePromise(bridgePromise, onRejected(value), resolve, reject);
                }
                catch (error) {
                    reject(error);
                }
            });
        });

    }

};

proto.catch = function (onRejected) {
    return this.then(null, onRejected);
};

Promise.all = function (promises) {

    return new Promise(function(resolve, reject) {

        var result = [];
        var counter = 0;

        for (var i = 0; i < promises.length; i++) {

            promises[i]
            .then(
                function(data) {
                    result[i] = data;
                    if (++count == promises.length) {
                        resolve(result);
                    }
                },
                function(error) {
                    reject(error);
                }
            );

        }
    });

};

Promise.resolve = function (value) {
    return new Promise(function (resolve) {
        resolve(value);
    });
};

Promise.reject = function (reason) {
    return new Promise(function (resolve, reject) {
        reject(reason);
    });
};
Promise.race = function (promises) {
    return new Promise(function(resolve, reject) {
        for (var i = 0; i < promises.length; i++) {
            promises[i]
            .then(
                function(data) {
                    resolve(data);
                },
                function(error) {
                    reject(error);
                }
            );
        }
    });
};


if (isObject(module)) {
    module.exports = Promise;
}
else if (isFunction(define) && define.amd) {
    define(function () {
        return Promise;
    });
}
else {
    root.Promise = Promise;
}

})(this);