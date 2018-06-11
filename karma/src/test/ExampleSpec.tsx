
import * as chai from 'chai';
import {IAugmentedWindow} from "../lib/IAugmentedWindow";
import {SuperHelper} from "../lib/SuperHelper";

const assert = chai.assert;

declare const global: {window: IAugmentedWindow};

describe('Example spec',() => {

    it('Configuration should be present', ()=>{
        assert.isDefined(global.window.appConfig);
        assert.isDefined(global.window.appConfig.apiUrl);
    })

    it('Super helper should work', ()=>{
        assert.isDefined(SuperHelper.getConfig());
        assert.isDefined(SuperHelper.getConfig().apiUrl);
    })

});