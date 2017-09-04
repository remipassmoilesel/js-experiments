
var NATS = require('nats');
var nats = NATS.connect();

// publishing an object
nats.publish('testTypes', {msg: 'Hello World!'});

// publishing a JSON string
nats.publish('testTypes', JSON.stringify({msg: 'Hello World!'}));
