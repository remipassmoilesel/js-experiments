
// https://vuejs.org/v2/guide/computed.html

export class ComputedValues {
    public template = require('./template.html');

    // all values we want to manipulate
    // with vue must be declared here
    public data() {
        return {
            message: 'Hello',
        };
    }

    // in order to keep typescript types,
    // we declare the field here too
    public message: string;

    public computed = {

        // Create a getter for computed value
        // Computed values help to keep complex logic
        // out of templates

        // Computed values are cached

        reversedMessage() {
            // `this` points to the vm instance
            return this.message.split('').reverse().join('');
        },

    } as any;


}
