
// https://vuejs.org/v2/guide/computed.html

export class FunctionExample {

    public template = require('./template.html');

    // all values we want to manipulate
    // with vue must be declared here
    public data() {
        return {
            getHello,   // function called in template will be always executed,
                        // and not cached like computed values
        };
    }

}

const getHello = () => {
    return 'Hello !';
};
