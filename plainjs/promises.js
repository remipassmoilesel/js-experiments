
let p1 = new Promise((resolve, reject) => {
    throw new Error();
});

p1.then((resp) => {
    console.log('then');
}).catch((resp) => {
    console.log('catch');
});
