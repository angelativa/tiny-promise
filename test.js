let Promise = require("./Promise")
let fs = require("fs")

let promise = new Promise((resolve, reject) => {
    fs.readFile('./file/1.txt', "utf8", function(err, data) {
        console.log('promise success');
        err ? reject(err) : resolve(data)
    });
});
let f1 = function(data) {
    console.log('f1', data, 'f1 success');
    return new Promise((resolve, reject) => {
        fs.readFile('./file/2.txt', "utf8", function(err, data) {
            console.log('f1', data, 'f1 promise success')
            err ? reject(err) : resolve(data);
        });
    });
}
let f2 = function(data) {
    console.log('f2', data, 'f2 success')
    return new Promise((resolve, reject) => {
        fs.readFile('./file/3.txt', "utf8", function(err, data) {
            err ? reject(err) : resolve(data)
            console.log('f2', data, 'f2 promise success')
        });
    });
}
let f3 = function(data) {
    console.log('f3', data);
}
let f4 = function(data) {
    console.log('f4', data);
}
let errorLog = function(error) {
    console.log(error)
}
promise
.then(f1)
.then(f2)
.then(f3)
.then(f4);