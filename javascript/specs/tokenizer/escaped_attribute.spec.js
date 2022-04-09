import { inspectTokenization } from './util.js';

const input = `
field:
\`key\` =

\`\`ke\`y\`\` =

\`\`\`k\`\`ey\`\`\`    =

    \`\` \`key\` \`\`    =

\`key\` =
`.trim();

describe('Escaped attribute tokenization', () => {
    it('performs as specified', () => {
        expect(inspectTokenization(input)).toMatchSnapshot();
    });
});
