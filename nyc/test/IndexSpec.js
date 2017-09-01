
"use strict";

const chai = require('chai');
const _ = require('lodash');
const assert = chai.assert;
const {execSync} = require('child_process');

describe('IndexSpec', () => {

    it('> Execute index should not throw', () => {
        assert.doesNotThrow(() => {
            execSync("node lib/index.js");
        });
    });
});