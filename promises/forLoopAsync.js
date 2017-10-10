console.log(`Starting sequence ...`);

const promises = [];

const func = async () => {

    for (let i = 0; i < 5; i++) {
        console.log("entering i=" + i);

        for (let j = 0; j < 5; j++) {
            console.log("entering j=" + j);

            const p = new Promise((resolve, reject) => {
                setTimeout(((i, j) => {
                    console.log("Resolved: i=" + i + " j=" + j);
                    resolve();
                }).bind(null, i, j), 1000);
            })
            .then(((i, j) => {
                console.log(`Then resolved: ${i} ${j}`);
            }).bind(null, i, j));

            promises.push(p);
            await p;
            console.log(`After await: ${i} ${j}`);
        }
    }

    return Promise.all(promises);
};

func().then(() => {
    console.log(`End of sequence`);
});

