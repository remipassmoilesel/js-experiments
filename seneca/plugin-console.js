
module.exports = function console_plugin(options) {

    this.add('role:console,cmd:log', function (msg, respond) {
        console.log(msg);
        respond(null, { done: true});
    });

    this.add('role:console,cmd:error', function (msg, respond) {
        console.error(msg);
        respond(null, { done: true});
    });

};
