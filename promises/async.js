
function resolveAfter2Seconds(x) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(x);
        }, 2000);
    });
}

async function addToX(x) {
    var a = resolveAfter2Seconds(20);
    var b = resolveAfter2Seconds(30);

    // attendre après a et b, puis ajouter à x
    return x + await a + await b;
}

addToX(10).then(v => {
    console.log(v);
});

async function addToX2(x) {
    // version alternative
    var a = await resolveAfter2Seconds(20);
    var b = await resolveAfter2Seconds(30);
    return x + a + b;
}

addToX2(10).then(v => {
    console.log(v);
});