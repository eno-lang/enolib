const { inspectTokenization } = require('./util.js');

const input = `
fieldset:
\`key\` =

\`\`ke\`y\`\` =

\`\`\`k\`\`ey\`\`\`    =

    \`\` \`key\` \`\`    =

\`key\` =
`.trim();

describe('Escaped fieldset entry tokenization', () => {
  it('performs as specified', () => {
    expect(inspectTokenization(input)).toMatchSnapshot();
  });
});
