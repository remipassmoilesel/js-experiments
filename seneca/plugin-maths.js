
module.exports = function math(options) {

    this.add('role:math,cmd:sum', function (msg, respond) {

        if(!msg.left || !msg.right){
            reply(new Error("Missing left or right part"));
            return;
        }

        respond(null, { answer: msg.left + msg.right })
    });

    this.add('role:math,cmd:product', function (msg, respond) {

        if(!msg.left || !msg.right){
            reply(new Error("Missing left or right part"));
            return;
        }

        respond(null, { answer: msg.left * msg.right })
    })

};
