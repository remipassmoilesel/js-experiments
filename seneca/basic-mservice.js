
var seneca = require('seneca')();

// enregistrer les plugins
seneca.use(require('./plugin-console.js'));
seneca.use(require('./plugin-maths.js'));

// écouter en tcp sur 8000
seneca.listen({type: 'tcp', port: '8000'});

