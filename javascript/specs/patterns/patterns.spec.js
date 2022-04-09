import { 
    ATTRIBUTE_OPERATOR_INDEX,
    ATTRIBUTE_VALUE_INDEX,
    COMMENT_INDEX,
    COMMENT_OPERATOR_INDEX,
    CONTINUATION_OPERATOR_INDEX,
    CONTINUATION_VALUE_INDEX,
    EMBED_KEY_INDEX,
    EMBED_OPERATOR_INDEX,
    EMPTY_LINE_INDEX,
    FIELD_OPERATOR_INDEX,
    FIELD_VALUE_INDEX,
    GRAMMAR_REGEXP,
    ITEM_OPERATOR_INDEX,
    ITEM_VALUE_INDEX,
    KEY_ESCAPE_BEGIN_OPERATOR_INDEX,
    KEY_ESCAPED_INDEX,
    KEY_UNESCAPED_INDEX,
    SECTION_KEY_INDEX,
    SECTION_OPERATOR_INDEX
} from '../../lib/esm/grammar_matcher.js';
import { SCENARIOS } from './scenarios.js';

// TODO: See if there is a way to (more) generically do this (reflection), manual setup might lead to patchy spec coverage
const INDICES = {
    [ATTRIBUTE_OPERATOR_INDEX]: ATTRIBUTE_OPERATOR_INDEX,
    [ATTRIBUTE_VALUE_INDEX]: ATTRIBUTE_VALUE_INDEX,
    [COMMENT_INDEX]: COMMENT_INDEX,
    [COMMENT_OPERATOR_INDEX]: COMMENT_OPERATOR_INDEX,
    [CONTINUATION_OPERATOR_INDEX]: CONTINUATION_OPERATOR_INDEX,
    [CONTINUATION_VALUE_INDEX]: CONTINUATION_VALUE_INDEX,
    [EMBED_KEY_INDEX]: EMBED_KEY_INDEX,
    [EMBED_OPERATOR_INDEX]: EMBED_OPERATOR_INDEX,
    [EMPTY_LINE_INDEX]: EMPTY_LINE_INDEX,
    [FIELD_OPERATOR_INDEX]: FIELD_OPERATOR_INDEX,
    [FIELD_VALUE_INDEX]: FIELD_VALUE_INDEX,
    [ITEM_OPERATOR_INDEX]: ITEM_OPERATOR_INDEX,
    [ITEM_VALUE_INDEX]: ITEM_VALUE_INDEX,
    [KEY_ESCAPE_BEGIN_OPERATOR_INDEX]: KEY_ESCAPE_BEGIN_OPERATOR_INDEX,
    [KEY_ESCAPED_INDEX]: KEY_ESCAPED_INDEX,
    [KEY_UNESCAPED_INDEX]: KEY_UNESCAPED_INDEX,
    [SECTION_KEY_INDEX]: SECTION_KEY_INDEX,
    [SECTION_OPERATOR_INDEX]: SECTION_OPERATOR_INDEX
};

describe('Unified grammar matcher', () => {
    for(let scenario of SCENARIOS) {
        for(let variant of scenario.variants) {
            describe(`with "${variant.replace(/\n/g, '\\n')}"`, () => {
                GRAMMAR_REGEXP.lastIndex = 0; // TODO: Running this on a single "constant" instance (no!) is dubious
                const match = GRAMMAR_REGEXP.exec(variant);
                
                if (scenario.captures) {
                    test('matches', () => {
                        expect(match).toBeTruthy();
                    });
                    
                    for (const [label, index] of Object.entries(INDICES)) {
                        if (typeof index !== 'number') { continue; }
                        
                        const capture = scenario.captures[index];
                        
                        if (capture === undefined) {
                            test(`${label} does not capture`, () => {
                                expect(match[index]).toEqual(undefined);
                            });
                        } else {
                            test(`${label} captures "${capture}"`, () => {
                                expect(match[index]).toEqual(capture);
                            });
                        }
                    }
                } else {
                    test('does not match', () => {
                        expect(match).toBeFalsy();
                    });
                }
                
            });
        }
    }
});
