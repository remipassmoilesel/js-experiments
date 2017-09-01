let wait = require('f-promise').wait;
let run = require('f-promise').run;

// cette fonction jete une erreur après deux secodnes
function resolveAfterNSeconds(x) {
    return new Promise(resolve => {
        setTimeout(() => {
            throw new Error("Error from resolveAfterNSeconds!");
        }, 800);
    });
}


run(() => {

    let value = wait(resolveAfterNSeconds(5));
    console.log("value: " + value);

    let value2 = wait(resolveAfterNSeconds(10));
    console.log("value2: " + value2);

}).catch(function () {
    throw new Error("resolveAfterNSeconds");
});

// cette fonction retourne une promesse rejetée après deux secodnes
function rejectAfterNSeconds(x) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {

            // /!\/!\/!\/!\ si une erreur n'est pas passée, fpromise ne jette pas
            // d'erreurs à l'instruction wait()

            reject(new Error("Error from resolveAfterNSeconds!"));

        }, 800);
    });
}

run(() => {

    let value = wait(rejectAfterNSeconds(5));
    console.log("value: " + value);

    let value2 = wait(rejectAfterNSeconds(10));
    console.log("value2: " + value2);

}).catch(function () {
    throw new Error("rejectAfterNSeconds");
});



