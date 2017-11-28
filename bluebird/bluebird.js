var Promise = require('bluebird');
var sleep = require('sleep');

// promisify an existing lib
var fs = Promise.promisifyAll(require("fs"));

fs.readFileAsync("package.json", "utf8").then(function (contents) {
    console.log(contents);
}).catch(function (e) {
    console.error(e.stack);
});

//
// promisify a custom object
//
var myObj = {

    // this method CANNOT be promisified
    add: function (op1, op2) {
        return op1 + op2;
    },

    // this method can because the last arg is a callback
    add2: function (op1, op2, callback) {

        // and because the first arg is a possible error
        callback(null, op1 + op2);
    },

    // this method will call catch block
    add3: function (op1, op2, callback) {
        callback(new Error(), null);
    }

};

// sync call
console.log(myObj.add(3, 4));

var myObjAsync = Promise.promisifyAll(myObj);

// async call to promisified method 1 -> nothing written to console
myObjAsync.addAsync(2, 3).then(function (data) {
    console.log("%j", data);
    return data;
});

// async call to promisified method 2 -> 5
myObjAsync.add2Async(2, 3).then(function (data) {
    console.log("%j", data);
    return data;
});

// async call which will trigger catch block
myObjAsync.add3Async(2, 3).then(function (data) {
    console.log("%j", data);
    return data;
}).catch(function(){
    console.error("catch block");
    console.error(arguments);
});