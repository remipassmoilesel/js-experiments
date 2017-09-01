// Client HTTP simplifié
// Voir https://github.com/sindresorhus/got

// $ npm install --save got

const fs = require('fs');
const got = require('got');

got('wikipedia.fr')
    .then(response => {
        console.log(response.body);
        //=> '<!doctype html> ...'
    })
    .catch(error => {
        console.log(error.response.body);
        //=> 'Internal server error ...'
    });

// Streams
got.stream('wikipedia.fr').pipe(fs.createWriteStream('index.html'));

// For POST, PUT and PATCH methods got.stream returns a WritableStream
fs.createReadStream('index.html').pipe(got.stream.post('wikipedia.fr'));