import { parse } from '../../lib/esm/main.js';

const latLng = value => {
    const split = value.split(',');
    
    if(split.length < 2)
        throw `The value should include a latitude and longitude!`;
    
    return {
        lat: parseFloat(split[0]),
        lng: parseFloat(split[1])
    };
};

describe('Complex loader', () => {
    let document;
    
    beforeAll(() => {
        document = parse(`
bad coordinates: Mickey Mouse
good coordinates: 48.211180, 16.371514
            `.trim());
        });
        
        it('throws with bad input', () => {
            expect(() => document.field('bad coordinates').requiredValue(latLng)).toThrowErrorMatchingSnapshot();
        });
        
        it('works with good input', () => {
            expect(document.field('good coordinates').requiredValue(latLng)).toEqual({ lat: 48.211180, lng: 16.371514 });
        });
    });
