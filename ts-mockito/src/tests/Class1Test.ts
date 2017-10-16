import * as chai from 'chai';
import { instance, mock, verify } from 'ts-mockito';
import { Class1 } from '../lib/Class1';

require('source-map-support').install();

const assert = chai.assert;

describe('Infra scheduler test', () => {

    it('Mockito experiment', () => {

        // mock
        let mockedClass: Class1 = mock(Class1);

        // create instance
        let class1: Class1 = instance(mockedClass);

        class1.return1();

        // check if method was called
        verify(class1.return1()).called();
    });
});