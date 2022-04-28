import { parse } from '../..';

const input = `
-- empty_embed
-- empty_embed

-- embed
value
-- embed
`.trim();

describe('Embed', () => {
    let embed, emptyEmbed;
    
    beforeEach(() => {
        const document = parse(input);
        
        embed = document.embed('embed');
        emptyEmbed = document.embed('empty_embed');
    });
    
    it('is untouched after initialization', () => {
        expect(embed._touched).toBeUndefined();
    });
    
    describe('toString()', () => {
        describe('without a value', () => {
            it('returns the appropriate debug abstraction', () => {
                expect(emptyEmbed.toString()).toEqual('[object Embed key=empty_embed]');
            });
        });
        describe('with a value', () => {
            it('returns the appropriate debug abstraction', () => {
                expect(embed.toString()).toEqual('[object Embed key=embed value=value]');
            });
        });
    });
    
    describe('toStringTag symbol', () => {
        it('returns a custom tag', () => {
            expect(Object.prototype.toString.call(embed)).toEqual('[object Embed]');
        });
    });
});
