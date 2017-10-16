import * as chai from 'chai';
import * as sinon from 'sinon';
import { SinonMock } from 'sinon';
import { Class1 } from '../lib/Class1';

require('source-map-support').install();

const assert = chai.assert;

describe('Sinon js experiment', () => {

    it('Spy experiment', () => {

        var spyCallback = sinon.spy();

        spyCallback(1, 2, 3);
        // spyCallback();

        // console.log(spyCallback);

        assert.isTrue(spyCallback.called);
        assert.isTrue((spyCallback.calledOnce));
        assert.equal(spyCallback.callCount, 1);

        // assert(spyCallback.calledOn(thisObj));
        assert(spyCallback.calledWith(1, 2, 3));

    });

    it('Stub experiment', () => {

        var stubCallback = sinon.stub().returns(42);

        stubCallback(1, 2, 3);
        // stubCallback();

        // console.log(stubCallback);

        assert.equal(stubCallback(), 42);

    });

    it('Object mock experiment', () => {

        // create a class
        const class1 = new Class1();

        // mock object
        const mock: SinonMock = sinon.mock(class1);

        // describe expected behavior, called once then throws
        mock.expects('return1').once();

        class1.return1();
        // class1.return1();

        // check if return1 was called
        mock.verify();

    });

    it('Object stub experiment', () => {

        // create a class
        const class1 = new Class1();

        assert.equal(class1.return1(), 1);

        // stub one mthod in object
        const stub = sinon.stub(class1, 'return1');

        // describe expected behavior, called once
        stub.returns(2);

        // stub only when called with these argument, or specify args
        // stub.withArgs(1, 2, 3);
        // stub.onCall(0).returns(1);

        assert.equal(class1.return1(), 2);

    });
});