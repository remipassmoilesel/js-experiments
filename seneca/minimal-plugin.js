
var seneca = require('seneca')();

function minimal_plugin(options) {
    console.log(options)
}

// premier argument: plugin, deuxieme: options
seneca.use(minimal_plugin, {foo: 'bar'});