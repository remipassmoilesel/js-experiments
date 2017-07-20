var express = require('express');
var router = require('./router');

var app = express();

//
//
//
// middleware niveau application
// use, get, post, ...
app.use(function (req, res, next) {
    console.log('Time:', Date.now());
    next();
});

// execution de deux memes routes
app.get('/user/:id', function (req, res, next) {
    console.log('User: ' + req.params.id);
    next();
});

app.get('/user/:id', function (req, res, next) {
    res.end('User: ' + req.params.id);
    next(); // appeler next pour le routeur suivant
});


// middleware dans un routeur
var router = express.Router();
router.use(function (req, res, next) {
    console.log('Router time:', Date.now());
    next();
});

app.use(router);

//
//
//
//
// middleware de traitement des erreurs


app.get('/error', function (req, res, next) {
    throw new Error(Date.now());
    next(); // appeler next pour le routeur suivant
});


app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
    next();
});

app.use(function (req, res, next) {
    console.log("Executed after error ...");
    next();
});







// déclarer une écoute sur 3000
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

