function getResolvedPromise(id, waitingTime) {
    "use strict";
    return new Promise((resolve, reject) => {
        console.log(`Start promise ${id}`);
        setTimeout(() => {
            console.log(`Resolve promise ${waitingTime}`);
            resolve();
        }, waitingTime);
    });
}

function getRejectedPromise(id, waitingTime) {
    "use strict";
    return new Promise((resolve, reject) => {
        console.log(`Start promise ${id}`);
        setTimeout(() => {
            console.log(`Resolve promise ${waitingTime}`);
            reject();
        }, waitingTime);
    });
}

// chaine all
// getResolvedPromise(1, 200)
//     .then(getResolvedPromise.bind(null, 2, 200))
//     .then(getResolvedPromise.bind(null, 3, 200))
//     .then(getResolvedPromise.bind(null, 4, 200));


getResolvedPromise(1, 200)
    .then(getResolvedPromise.bind(null, 2, 200))
    .then(getRejectedPromise.bind(null, 3, 200))
    .then(getResolvedPromise.bind(null, 4, 200))
    .catch(() => {
        "use strict";
        console.log("Catch block")
    });

