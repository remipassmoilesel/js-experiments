const express = require('express');
const chai = require('chai');

// Hand testing server:
// $ curl http://localhost:4000/locales

const assert = chai.assert;

const app = express();
const router = express.Router();

router.get('/locales', (req, res) => {
    console.log('res.json');
    console.log(res.json); // undefined

    assert.isDefined(res.json);
    res.json({ response: 'Yeaaaah !' });
});

app.use('/', router);

function standaloneLaunch() {
    app.listen(4000, 'localhost', (err) => {
        if (err) {
            console.log('Error: ');
            console.log(err);
        }
        console.log('Started on localhost:4000');
    });
}

if (require.main === module) {
    standaloneLaunch();
}

module.exports = {
    router,
    app,
};
