console.log(`Starting sequence ...`);

let i = 0;
let lastTime = new Date().getTime();

const func = async () => {
    const p = new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`Resolved ${i} after ${new Date().getTime() - lastTime} ms`);
            lastTime = new Date().getTime();
            i++;
            resolve();
        }, 1000);
    });

    await p;
};

console.log("Before");
func();
console.log("After");

//
// for (let i = 0; i < 10; i++) {
//     func();
// }

//
// setInterval(func, 500);
// setInterval(func, 2000);
//
