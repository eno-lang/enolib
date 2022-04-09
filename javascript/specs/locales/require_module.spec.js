import { parse } from '../../lib/esm/main.js';

// TODO: Make this generic/auto expanding to dynamically available locales (?)

import de from '../../locales/de.js';
import es from '../../locales/es.js';

const locales = { de, es };

describe('Requiring through public convenience module', () => {
    for (const [locale, messages] of Object.entries(locales)) {
        describe(locale, () => {
            it('provides a working locale', () => {
                expect(() => parse(':invalid', { locale: messages })).toThrowErrorMatchingSnapshot();
            });
        });
    }
});
