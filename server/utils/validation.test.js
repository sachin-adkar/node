const expect = require('expect');

const {isRealString} = require('./validation.js');

describe('isRealString', ()=>{

    it('should reject non-string values',()=>{
       
        var isReal = isRealString(45) && isRealString(23);
        expect(isReal).toBe(false);
    });
    it('should reject string with only spaces', ()=>{

        var isReal = isRealString(' ') && isRealString(' ');
        expect(isReal).toBe(false);
    });
    it('should allow valid strings', ()=>{

        var isReal = isRealString('Sachin') && isRealString('TJ');
        expect(isReal).toBe(true);
    })




});