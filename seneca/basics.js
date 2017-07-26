var seneca = require('seneca')();

// ajouter une action à l'instance courante seneca
seneca.add({role:"math", cmd:"sum"}, (msg, reply) => {
    // le pattern peut être défini de cette manière également: 'role:math,cmd:sum'
    
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

// surcharge: nouvelle procédure avec un paramètre en plus
seneca.add({role: 'math', cmd: 'sum', integer: true}, function (msg, respond) {
    var sum = Math.floor(msg.left) + Math.floor(msg.right)
    respond(null, { answer: sum })
});

// cet appel concerne la premiere procédure
seneca.act({role: 'math', cmd: 'sum', left: 1.5, right: 2.5}, console.log);
// celui ci la deuxième, car plus spécifique
seneca.act({role: 'math', cmd: 'sum', left: 1.5, right: 2.5, integer: true}, console.log);


// pin: pattern matching. Le pin 'role:math' va correspondre à 'role:math, cmd:product', 'role:math, cmd:sum', etc ...
seneca.listen({ type: 'tcp', pin: 'role:math' });
