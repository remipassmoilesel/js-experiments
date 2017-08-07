let wait = require('f-promise').wait;
let run = require('f-promise').run;

// cette fonction jette une erreur après deux secodnes
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
    throw new Error();
});


    
