var seneca = require('seneca')();

// ajouter une action à l'instance courante seneca
seneca.add({role:"math", cmd:"sum"}, (msg, reply) => {
    // le pattern peut être défini de cette manière également: {'role:math,cmd:sum'}
    
    if(!msg.left){
        reply(new Error("Missing left part"));
    }

    if(!msg.right){
        reply(new Error("Missing right part"));
    }

    var rslt = msg.left + msg.right;

    // repondre: (erreur, resultat)
    reply(null, {answer: rslt});
});

// appeler une action
seneca.act({role: 'math', cmd: 'sum', left: 1, right: 2}, function (err, result) {
    if (err) {
        return console.error(err);
    }
    console.log(result)
});

// echec de verification car mauvais arguments
seneca.act({role: 'math', cmd: 'sum', left: 1}, function (err, result) {
    if (err) {
        return console.error(err);
    }
    console.log(result)
});

// appel d'une action qui n'existe pas: levée d'exception
seneca.act({role: 'math', cmd: 'sum2', left: 1, right: 2}, function (err, result) {
    if (err) {
        return console.error(err);
    }
    console.log(result)
});
