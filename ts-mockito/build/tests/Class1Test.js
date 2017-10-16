"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const ts_mockito_1 = require("ts-mockito");
const Class1_1 = require("../lib/Class1");
require('source-map-support').install();
const assert = chai.assert;
describe('Infra scheduler test', () => {
    it('Mockito experiment', () => {
        // mock
        let mockedClass = ts_mockito_1.mock(Class1_1.Class1);
        // create instance
        let class1 = ts_mockito_1.instance(mockedClass);
        class1.return1();
        // check if method was called
        ts_mockito_1.verify(class1.return1()).called();
    });
});
//# sourceMappingURL=Class1Test.js.map