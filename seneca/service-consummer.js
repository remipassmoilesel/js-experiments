var seneca = require('seneca')();

// configuration client en tcp sur le port 8000
seneca.client({type: 'tcp', port: '8000'});

seneca.act("role:console,cmd:log", console.log);
seneca.act("role:console,cmd:error", console.log);

seneca.act("role:math,cmd:product,left:2,right:4", console.log);