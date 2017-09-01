var express = require('express');
var router = require('./router');
var cookieParser = require('cookie-parser');

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


app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
    next();
});

app.use('/error', function (req, res, next) {
    console.log("Executed after error ...");
    next();
});

//
//
//
// Middleware intégré
// Static est le seul middleware intégré, le reste est modulaire
app.use("/static", express.static(__dirname + '/public', {index: false}));

//
//
//
// Middleware tiers
// ajoute des fonctionnalités
// http://expressjs.com/fr/resources/middleware.html
app.use(cookieParser("secretUsedToSignCookies"));
app.get('/cookies', function (req, res) {
    // Cookies that have not been signed
    console.log('Cookies: ', req.cookies);

    // Cookies that have been signed
    console.log('Signed Cookies: ', req.signedCookies);

    res.end();
});


// déclarer une écoute sur 3000
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

