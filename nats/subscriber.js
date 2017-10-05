
var NATS = require('nats');
var nats = NATS.connect();


nats.subscribe('testTypes', function(msg) {
    console.log(`Received a message`);
    console.log(`Typeof: ${typeof msg}`);
    console.log(`Stringified: ${JSON.stringify(msg)}`);
});
