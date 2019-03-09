const { inspectTokenization } = require('./util.js');

const input = `
template:

\`key\` < template

\`\`ke\`y\`\` < template

\`\`\`k\`\`ey\`\`\`    < template

    \`\` \`key\` \`\`    < template

\`key\` < template
`.trim();

describe('Escaped copy tokenization', () => {
  it('performs as specified', () => {
    expect(inspectTokenization(input)).toMatchSnapshot();
  });
});
