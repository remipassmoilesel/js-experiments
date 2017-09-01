
var express = require('express');
var app = express();

// activer le moteur de template
app.set('view engine', 'jade');

// servir un template avec argument
app.get('/', function (req, res) {
    res.render('jade-template', { title: 'Hey', message: 'Hello there!'});
});

// déclarer une écoute sur 3000
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});