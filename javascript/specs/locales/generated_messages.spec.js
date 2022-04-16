import { parse } from '../..';

import de from '../../locales/de.js';
import en from '../../lib/messages.js';
import es from '../../locales/es.js';

const locales = { de, en, es };

describe('Message locales', () => {
    for (const [locale, messages] of Object.entries(locales)) {
        describe(locale, () => {
            for (const [message, translation] of Object.entries(messages)) {
                describe(message, () => {
                    it('contains a static string translation or a message generator function', () => {
                        if(typeof translation === 'function') {
                            const generatedMessage = translation();
                            expect(typeof generatedMessage).toEqual('string');
                        } else {
                            expect(typeof translation).toEqual('string');
                        }
                    });
                });
            }
        });
    }
});
