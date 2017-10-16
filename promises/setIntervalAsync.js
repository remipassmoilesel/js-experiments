
// It is impossible !

let i = 0;

const func = async () => {
    i++;
    console.log(`func() ${i}`);
    const p = new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`Resolved ${i}`);
            resolve();
        }, 1000);
    });
    await p;
};


console.log(`Starting sequence ...`);
setInterval(func, 500);


