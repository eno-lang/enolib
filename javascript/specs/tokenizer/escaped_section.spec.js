const { inspectTokenization } = require('./util.js');

const input = `
# \`key\`

## \`\`ke\`y\`\`

### \`\`\`k\`\`ey\`\`\`

    #### \`\` \`key\` \`\`

# \`key\`
`.trim();

describe('Escaped section tokenization', () => {
  it('performs as specified', () => {
    expect(inspectTokenization(input)).toMatchSnapshot();
  });
});
