import { parse } from '..';

describe('Continuation behaviour', () => {
    test('empty direct continuations are always ignored', () => {
        const document = parse(`
field:
|
| foo
|
| bar
|
        `.trim());

        expect(document.field('field').requiredStringValue()).toEqual('foobar');
    });

    test('leading and trailing empty spaced continuations are ignored', () => {
        const document = parse(`
field:
\\
\\ foo
\\ bar
\\
        `.trim());

        expect(document.field('field').requiredStringValue()).toEqual('foo bar');
    });

    test('in-between empty spaced continuations do not contribute redundant spacing', () => {
        const document = parse(`
field:
\\ foo
\\
\\ bar
        `.trim());

        expect(document.field('field').requiredStringValue()).toEqual('foo bar');
    });

    test('an in-between empty spaced line continuation can contribute spacing', () => {
        const document = parse(`
field:
| foo
\\
| bar
        `.trim());

        expect(document.field('field').requiredStringValue()).toEqual('foo bar');
    });

    test('multiple in-between empty spaced continuations can only contribute spacing once', () => {
        const document = parse(`
field:
| foo
\\
\\
| bar
        `.trim());

        expect(document.field('field').requiredStringValue()).toEqual('foo bar');
    });

    test('continuations can not be applied to embeds', () => {
        const input = `
-- embed
[value]
-- embed

| [illegal continuation]
        `.trim();

        expect(() => parse(input)).toThrowErrorMatchingSnapshot();
    });
});
