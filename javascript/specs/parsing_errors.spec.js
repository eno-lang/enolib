import { parse } from '../lib/esm/main.js';

const ERROR_SCENARIOS = {
    'attribute_outside_field': [
        'attribute = value'
    ],
    'attribute_without_key': [
        '=',
        '= value'
    ],
    'continuation_outside_field': [
        '| continuation'
    ],
    'embed_without_key': [
        '--',
        '-----'
    ],
    'field_without_key': [
        ':',
        ': value'
    ],
    'item_outside_field': [
        '-',
        '- item'
    ],
    'mixed_field_content': [
        `
field: value
attribute = value
        `.trim(),
        `
field:
| value
attribute = value
        `.trim(),
        `
field:
- item
attribute = value
        `.trim(),
        `
field: value
- item
        `.trim(),
        `
field:
| value
- item
        `.trim(),
        `
field:
attribute = value
- item
        `.trim()
    ],
    'section_level_skip': [
        '## section',
        `
# section
### section
        `.trim(),
        `
# section
## section
#### section
        `.trim()
    ],
    'section_without_key': [
        '#',
        '##',
        '####'
    ],
    'unterminated_embed': [
        `
-- embed
...
        `.trim(),
        `
---- --
...
        `.trim()
    ],
    'unterminated_escaped_key': [
        '`',
        '`key'
    ]
};

describe('Parsing errors', () => {
    for (const [label, scenarios] of Object.entries(ERROR_SCENARIOS)) {
        for (const [index, input] of Object.entries(scenarios)) {
            test(`${label} (#${index + 1}) builds and throws a proper error`, () => {
                expect(() => parse(input)).toThrowErrorMatchingSnapshot();
            });
        }
    }
});
