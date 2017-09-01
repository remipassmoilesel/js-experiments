let wait = require('f-promise').wait;
let run = require('f-promise').run;
let map = require('f-promise').map;

// cette fonction se résolvera toujours après deux secodnes
function resolveAfterNSeconds(x) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(x);
        }, 800);
    });
}

// f-promise utilise deux fonctions: wait et run.
// dans un bloc run, wait(Promise) attend que la promesse se résolve ou jette une erreur
run(()=>{

    let value = wait(resolveAfterNSeconds(5));
    console.log("value: " + value);

    let value2 = wait(resolveAfterNSeconds(10));
    console.log("value2: " + value2);

});

//  iterer sans ajouter de run
map(disconnecters, (d) => {
    try {
        wait(d());// some errors can be thrown here
    } catch (e) {
        // TODO: fix close connections errors
        console.error(e.stack);
    }
});

// gestion des erreurs

function willThrow(){
    return new Promise(function(resolve, reject){
        reject(new Error('Error from willThrow()'));
    });
}

run(()=>{
    wait(willThrow()); // ne va pas jeter d'erreur, créera une UnhandledPromiseRejection

    try{
        wait(willThrow()); // va jeter une erreur
    }catch(err){
        console.error(err);
    }
});

run(()=>{
    wait(willThrow());
}).catch(function(err){
    console.error(err); // autre manière de capturer l'erreur
});