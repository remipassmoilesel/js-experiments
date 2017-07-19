
var express = require('express');
var app = express();

// route racine
app.get('/', function (req, res) {
    res.send('Hello World!');
});

// déclarer une écoute sur 3000
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});