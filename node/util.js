var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

path.extname('./text.js');


var result = path.join(
    path.dirname('./text.js'),
    path.basename('./text.js',  path.extname('./text.js'))
);

console.log(result);