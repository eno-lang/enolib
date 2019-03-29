const enolib = require('../..');

const input = `
# Song

## Verse A

Line A: Du
Line B: Du hast
Line C: Du hast mich

## Verse A < Verse A
## Verse A < Verse A
## Verse A < Verse A
## Verse A < Verse A

## Verse B

Line C < Line C
Line D: Du hast mich gefragt
Line D < Line D
Line E: Du hast mich gefragt und ich hab nichts gesagt
`.trim();

describe('Du hast', () => {
  test('succeeds', () => {
    const document = enolib.parse(input);
    expect(document.raw()).toMatchSnapshot();
  });
});
