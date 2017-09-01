var express = require('express');
var cookieParser = require('cookie-parser');

var app = express();

var secret = "secretUsedToSignCookies";

app.use(cookieParser(secret));
app.get('/', function (req, res) {

    // affecter un cookie
    res.cookie("cookie_" + Date.now(), Date.now(), {signed: true});

    // nettoyer un cookie
    var cookieToClearName = "cookieToClear_" + Date.now();
    res.cookie(cookieToClearName, Date.now(), {signed: true});
    res.clearCookie(cookieToClearName);


    // Cookies that have not been signed
    console.log('Cookies: ', req.cookies);

    // Cookies that have been signed
    console.log('Signed Cookies: ', req.signedCookies);

    res.sendStatus(200);
});


// déclarer une écoute sur 3000
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});