var express = require('express');
var router = require('./router');

// utiliser un routeur
var app = express();
app.use('/router', router);

// déclarer une écoute sur 3000
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});