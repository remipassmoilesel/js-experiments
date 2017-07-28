const Joi = require('joi');

const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    // password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    // access_token: [Joi.string(), Joi.number()],
    birthyear: Joi.number().integer().min(1900).max(2013),
    // email: Joi.string().email()
}).with('username', 'birthyear').without('password', 'access_token');

// Return result.
const result = Joi.validate({ username: 'abc', birthyear: 1994 }, schema);
// result.error === null -> valid

console.log("1 - Schema validated: ", result === null);

// You can also pass a callback which will be called synchronously with the validation result.
Joi.validate({ username: 'abc', birthyear: 1994 }, schema, function (err, value) {
    console.log("2 - Schema validated: ", err === null);
    console.log("2 - Schema validation error: ", err);
    console.log("2 - Schema validation value: ", value);
});  // err === null -> valid

// You can also pass a callback which will be called synchronously with the validation result.
Joi.validate({ username: 'abc', birthyear: 'err'}, schema, function (err, value) {
    console.log("3 - Schema validated: ", err === null);
    console.log("3 - Schema validation error: ", err);
    console.log("3 - Schema validation value: ", value);
});  // err === null -> valid
