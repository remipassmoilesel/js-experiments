
console.log(`Starting sequence ...`);

const promises = [];

const func = async () => {

    for (let i = 0; i < 5; i++) {
        console.log("entering i=" + i);

        for (let j = 0; j < 5; j++) {
            console.log("entering j=" + j);

            const p = new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log("Resolved: i=" + i + " j=" + j);
                    resolve();
                }, 1000);
            }).then(() => {
                console.log("Then resolved !");
            });

            promises.push(p);
            await p;
        }
    }

    return Promise.all(promises);
};

func().then(() => {
    console.log(`End of sequence`);
});

