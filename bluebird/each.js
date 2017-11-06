"use strict";

const bluebird = require("bluebird");

const promiseArray = [

    new Promise((resolve, reject) => {
        console.log("Start promise 1");
        setTimeout(() => {
            console.log("Resolve promise 1");
            resolve();
        }, 1200);
    }),
    new Promise((resolve, reject) => {
        console.log("Start promise 2");
        setTimeout(() => {
            console.log("Resolve promise 2");
            resolve();
        }, 600);
    }),

];

bluebird.Promise.each(promiseArray, (item, index, length) => {
    console.log("Iteration index: " + index);
}).then(() => {
    console.log("End of all promises");
});