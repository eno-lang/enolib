const enolib = require('..');

describe('Line continuation behaviour', () => {
  test('empty direct line continuations are always ignored', () => {
    const document = enolib.parse(`
field:
|
| foo
|
| bar
|
    `.trim());

    expect(document.field('field').requiredStringValue()).toEqual('foobar');
  });

  test('leading and trailing empty spaced line continuations are ignored', () => {
    const document = enolib.parse(`
field:
\\
\\ foo
\\ bar
\\
    `.trim());

    expect(document.field('field').requiredStringValue()).toEqual('foo bar');
  });

  test('in-between empty spaced line continuations do not contribute redundant spacing', () => {
    const document = enolib.parse(`
field:
\\ foo
\\
\\ bar
    `.trim());

    expect(document.field('field').requiredStringValue()).toEqual('foo bar');
  });

  test('an in-between empty spaced line continuation can contribute spacing', () => {
    const document = enolib.parse(`
field:
| foo
\\
| bar
    `.trim());

    expect(document.field('field').requiredStringValue()).toEqual('foo bar');
  });

  test('multiple in-between empty spaced line continuations can only contribute spacing once', () => {
    const document = enolib.parse(`
field:
| foo
\\
\\
| bar
    `.trim());

    expect(document.field('field').requiredStringValue()).toEqual('foo bar');
  });

  test('newlines copied from multiline fields are not trimmed away', () => {
    const document = enolib.parse(`
-- multiline field

[inbetween whitespace]

-- multiline field

field < multiline field
    `.trim());

    expect(document.field('field').requiredStringValue()).toEqual('\n[inbetween whitespace]\n');
  });

  test('line continuations can not be applied to multiline fields', () => {
    const input = `
-- multiline field
[value]
-- multiline field

| [illegal continuation]
    `.trim();

    expect(() => enolib.parse(input)).toThrowErrorMatchingSnapshot();
  });
});
