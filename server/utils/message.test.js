const expect = require('expect');

var { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        var from = 'Jen';
        var text = 'Some message';
        var message = generateMessage(from, text);
        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({ from, text });
    });
});

describe('generateLocationMessage', ()=>{
    it('should generate correct location object', ()=>{
        var from = 'Jack';
        var latitude = 10;
        var longitude = 12;
        var message = generateLocationMessage(from, latitude, longitude);
        expect(message.from).toBe(from);
        expect(message.createdAt).toBeA('number');
        expect(message.url).toBe(`https://www.google.com/maps?q=${latitude},${longitude}`)
    })
    
})