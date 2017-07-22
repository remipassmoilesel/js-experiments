
// source: https://github.com/senecajs/seneca/blob/master/docs/examples/custom-logger.js

var colors = require("colors/safe");

function Logger () {}

// Loggers are loaded via a `preload` function. This is a way
// to signal seneca infrastructural plugins over business logic
// plugins, which get loaded later in the chain.
Logger.preload = function () {
    var seneca = this;

    // Leftpad, AMIRITE
    function pad (content, length) {
        content = content || '';

        while (content.length < length) {
            content = content + ' '
        }

        return content;
    }

    // Everything something is logged it calls whatever
    // custom adapter is set. Adapters are passed the
    // current instance of Seneca plus the raw payload.
    function adapter (context, payload) {
        var when = payload.when.toString()
        var kind = pad(payload.kind || '-', 8).toUpperCase();
        var type = pad(payload.case || '-', 8).toUpperCase();
        var text = payload.pattern || payload.notice || '-';

        console.log(colors.green(when), kind, type, text);
    }

    // Seneca looks for logging adapters in `extend.logger`
    // simply assign your adapter to receive the logs.
    return {
        extend: {
            logger: adapter
        }
    }
};


var seneca = require('seneca')({
    internal: {
        logger: Logger
    }
});

// enregistrer les plugins
seneca.use(require('./plugin-console.js'));
seneca.use(require('./plugin-maths.js'));

// écouter en tcp sur 8000
seneca.listen({type: 'tcp', port: '8000'});

