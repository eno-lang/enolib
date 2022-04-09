import { space } from './space.js';
import {
    ATTRIBUTE_OPERATOR_INDEX,
    ATTRIBUTE_VALUE_INDEX,
    COMMENT_INDEX,
    COMMENT_OPERATOR_INDEX,
    CONTINUATION_OPERATOR_INDEX,
    CONTINUATION_VALUE_INDEX,
    EMBED_KEY_INDEX,
    EMBED_OPERATOR_INDEX,
    EMPTY_LINE_INDEX,
    FIELD_OPERATOR_INDEX,
    FIELD_VALUE_INDEX,
    ITEM_OPERATOR_INDEX,
    ITEM_VALUE_INDEX,
    KEY_ESCAPE_BEGIN_OPERATOR_INDEX,
    KEY_ESCAPED_INDEX,
    KEY_UNESCAPED_INDEX,
    SECTION_KEY_INDEX,
    SECTION_OPERATOR_INDEX
} from '../../lib/esm/grammar_matcher.js';

export const SCENARIOS = [
    // SPACED_CONTINUATION_SCENARIOS
    {
        captures: {
            [CONTINUATION_OPERATOR_INDEX]: '|'
        },
        syntax: '|',
        variants: space('|')
    },
    {
        captures: {
            [CONTINUATION_OPERATOR_INDEX]: '|',
            [CONTINUATION_VALUE_INDEX]: 'Value'
        },
        syntax: '| Value',
        variants: space('|', 'Value')
    },
    {
        captures: {
            [CONTINUATION_OPERATOR_INDEX]: '|',
            [CONTINUATION_VALUE_INDEX]: '|'
        },
        syntax: '| |',
        variants: space('|', '|')
    },
    
    // SPACED_CONTINUATION_SCENARIOS
    {
        captures: {
            [CONTINUATION_OPERATOR_INDEX]: '\\'
        },
        syntax: '\\',
        variants: space('\\')
    },
    {
        captures: {
            [CONTINUATION_OPERATOR_INDEX]: '\\',
            [CONTINUATION_VALUE_INDEX]: 'Value'
        },
        syntax: '\\ Value',
        variants: space('\\', 'Value')
    },
    {
        captures: {
            [CONTINUATION_OPERATOR_INDEX]: '\\',
            [CONTINUATION_VALUE_INDEX]: '\\'
        },
        syntax: '\\ \\',
        variants: space('\\', '\\')
    },
    
    // EMBED_SCENARIOS
    {
        captures: {
            [EMBED_OPERATOR_INDEX]: '--',
            [EMBED_KEY_INDEX]: 'Key'
        },
        syntax: '-- Key',
        variants: space('--', 'Key')
    },
    {
        captures: {
            [EMBED_OPERATOR_INDEX]: '--',
            [EMBED_KEY_INDEX]: '--'
        },
        syntax: '-- --',
        variants: space('--', ' ', '--')
    },
    {
        captures: {
            [EMBED_OPERATOR_INDEX]: '---',
            [EMBED_KEY_INDEX]: 'The Key'
        },
        syntax: '--- The Key',
        variants: space('---', 'The Key')
    },
    {
        captures: {
            [EMBED_OPERATOR_INDEX]: '---',
            [EMBED_KEY_INDEX]: '---'
        },
        syntax: '--- ---',
        variants: space('---', ' ', '---')
    },
    
    // COMMENT_SCENARIOS
    {
        captures: {
            [COMMENT_OPERATOR_INDEX]: '>',
            [COMMENT_INDEX]: 'Comment Value'
        },
        syntax: '>Comment Value',
        variants: ['>Comment Value', ' >Comment Value', '   >Comment Value']
    },
    {
        captures: {
            [COMMENT_OPERATOR_INDEX]: '>',
            [COMMENT_INDEX]: 'Comment Value'
        },
        syntax: '> Comment Value',
        variants: ['> Comment Value', ' > Comment Value', '   > Comment Value']
    },
    {
        captures: {
            [COMMENT_OPERATOR_INDEX]: '>',
            [COMMENT_INDEX]: 'Comment Value'
        },
        syntax: '> Comment Value ',
        variants: ['> Comment Value ', ' > Comment Value ', '   > Comment Value ']
    },
    {
        captures: {
            [COMMENT_OPERATOR_INDEX]: '>',
            [COMMENT_INDEX]: 'Comment Value'
        },
        syntax: '>   Comment Value   ',
        variants: ['>   Comment Value   ', ' >   Comment Value   ', '   >   Comment Value   ']
    },
    
    // ATTRIBUTE_SCENARIOS
    {
        captures: {
            [KEY_UNESCAPED_INDEX]: 'Key',
            [ATTRIBUTE_OPERATOR_INDEX]: '=',
            [ATTRIBUTE_VALUE_INDEX]: 'Value'
        },
        syntax: 'Key = Value',
        variants: space('Key', '=', 'Value')
    },
    {
        captures: {
            [KEY_UNESCAPED_INDEX]: 'The Key',
            [ATTRIBUTE_OPERATOR_INDEX]: '=',
            [ATTRIBUTE_VALUE_INDEX]: 'The Value'
        },
        syntax: 'The Key = The Value',
        variants: space('The Key', '=', 'The Value')
    },
    {
        captures: {
            [KEY_UNESCAPED_INDEX]: 'Key',
            [ATTRIBUTE_OPERATOR_INDEX]: '=',
            [ATTRIBUTE_VALUE_INDEX]: '='
        },
        syntax: 'Key = =',
        variants: space('Key', '=', ' ', '=')
    },
    {
        captures: {
            [KEY_UNESCAPED_INDEX]: 'Key',
            [ATTRIBUTE_OPERATOR_INDEX]: '=',
            [ATTRIBUTE_VALUE_INDEX]: ':'
        },
        syntax: 'Key = :',
        variants: space('Key', '=', ' ', ':')
    },
    {
        captures: {
            [KEY_ESCAPE_BEGIN_OPERATOR_INDEX]: '`',
            [KEY_ESCAPED_INDEX]: '=:',
            [ATTRIBUTE_OPERATOR_INDEX]: '=',
            [ATTRIBUTE_VALUE_INDEX]: '`=:`'
        },
        syntax: '`=:` = `=:`',
        variants: space('`', '=:', '`', '=', '`=:`')
    },
    {
        captures: {
            [KEY_ESCAPE_BEGIN_OPERATOR_INDEX]: '```',
            [KEY_ESCAPED_INDEX]: '`=``:',
            [ATTRIBUTE_OPERATOR_INDEX]: '=',
            [ATTRIBUTE_VALUE_INDEX]: '`=:`'
        },
        syntax: '``` `=``:``` = `=:`',
        variants: space('```', ' ', '`=``:', '```', '=', '`=:`')
    },
    
    // EMPTY_LINE_SCENARIOS
    {
        captures: {
            [EMPTY_LINE_INDEX]: ''
        },
        syntax: '',
        variants: space('')
    },
    
    // FIELD_SCENARIOS
    {
        captures: {
            [KEY_UNESCAPED_INDEX]: 'Key',
            [FIELD_OPERATOR_INDEX]: ':',
            [FIELD_VALUE_INDEX]: 'Value'
        },
        syntax: 'Key: Value',
        variants: space('Key', ':', 'Value')
    },
    {
        captures: {
            [KEY_UNESCAPED_INDEX]: 'The Key',
            [FIELD_OPERATOR_INDEX]: ':',
            [FIELD_VALUE_INDEX]: 'The Value'
        },
        syntax: 'The Key: The Value',
        variants: space('The Key', ':', 'The Value')
    },
    {
        captures: {
            [KEY_UNESCAPED_INDEX]: 'Key',
            [FIELD_OPERATOR_INDEX]: ':',
            [FIELD_VALUE_INDEX]: ':'
        },
        syntax: 'Key: :',
        variants: space('Key', ':', ' ', ':')
    },
    {
        captures: {
            [KEY_ESCAPE_BEGIN_OPERATOR_INDEX]: '`',
            [KEY_ESCAPED_INDEX]: '=:',
            [FIELD_OPERATOR_INDEX]: ':',
            [FIELD_VALUE_INDEX]: '`=:`'
        },
        syntax: '`=:` : `=:`',
        variants: space('`', '=:', '`', ':', '`=:`')
    },
    {
        captures: {
            [KEY_ESCAPE_BEGIN_OPERATOR_INDEX]: '```',
            [KEY_ESCAPED_INDEX]: '`=``:',
            [FIELD_OPERATOR_INDEX]: ':',
            [FIELD_VALUE_INDEX]: '`=:`'
        },
        syntax: '``` `=``:``` : `=:`',
        variants: space('```', ' ', '`=``:', '```', ':', '`=:`')
    },
    
    // INVALID_SCENARIOS
    {
        syntax: '#',
        variants: space('#')
    },
    {
        syntax: '--',
        variants: space('--')
    },
    {
        syntax: ':',
        variants: space(':')
    },
    {
        syntax: ': Invalid',
        variants: space(':', 'Invalid')
    },
    {
        syntax: '=',
        variants: space('=')
    },
    {
        syntax: '= Invalid',
        variants: space('=', 'Invalid')
    },
    {
        syntax: '---',
        variants: space('---')
    },
    {
        syntax: ': Invalid\nValid:',
        variants: space(':', 'Invalid', '\n', 'Valid', ':')
    },
    {
        syntax: ': Invalid\nValid:Valid',
        variants: space(':', 'Invalid', '\n', 'Valid', ':', 'Valid')
    },
    
    // ITEM_SCENARIOS
    {
        captures: {
            [ITEM_OPERATOR_INDEX]: '-'
        },
        syntax: '-',
        variants: space('-')
    },
    {
        captures: {
            [ITEM_OPERATOR_INDEX]: '-',
            [ITEM_VALUE_INDEX]: 'Item'
        },
        syntax: '- Item',
        variants: space('-', 'Item')
    },
    {
        captures: {
            [ITEM_OPERATOR_INDEX]: '-',
            [ITEM_VALUE_INDEX]: 'The Item'
        },
        syntax: '- The Item',
        variants: space('-', 'The Item')
    },
    {
        captures: {
            [ITEM_OPERATOR_INDEX]: '-',
            [ITEM_VALUE_INDEX]: '-'
        },
        syntax: '- -',
        variants: space('-', ' ', '-')
    },
    
    // EMPTY_FIELD_SCENARIOS
    {
        captures: {
            [KEY_UNESCAPED_INDEX]: 'Key',
            [FIELD_OPERATOR_INDEX]: ':'
        },
        syntax: 'Key:',
        variants: space('Key', ':')
    },
    {
        captures: {
            [KEY_UNESCAPED_INDEX]: 'The Key',
            [FIELD_OPERATOR_INDEX]: ':'
        },
        syntax: 'The Key:',
        variants: space('The Key', ':')
    },
    {
        captures: {
            [KEY_ESCAPE_BEGIN_OPERATOR_INDEX]: '`',
            [KEY_ESCAPED_INDEX]: '=:',
            [FIELD_OPERATOR_INDEX]: ':'
        },
        syntax: '`=:`:',
        variants: space('`', '=:', '`', ':')
    },
    {
        captures: {
            [KEY_ESCAPE_BEGIN_OPERATOR_INDEX]: '```',
            [KEY_ESCAPED_INDEX]: '`=``:',
            [FIELD_OPERATOR_INDEX]: ':'
        },
        syntax: '``` `=``:```:',
        variants: space('```', ' ','`=``:', '```', ':')
    },
    
    // SECTION_SCENARIOS
    {
        captures: {
            [SECTION_OPERATOR_INDEX]: '#',
            [SECTION_KEY_INDEX]: 'Key'
        },
        syntax: '# Key',
        variants: space('#', 'Key')
    },
    {
        captures: {
            [SECTION_OPERATOR_INDEX]: '##',
            [SECTION_KEY_INDEX]: 'The Key'
        },
        syntax: '## The Key',
        variants: space('##', 'The Key')
    },
    {
        captures: {
            [SECTION_OPERATOR_INDEX]: '#',
            [SECTION_KEY_INDEX]: '# Other Key'
        },
        syntax: '# # Other Key',
        variants: space('#', ' ', '# Other Key')
    },
    {
        captures: {
            [SECTION_OPERATOR_INDEX]: '###',
            [SECTION_KEY_INDEX]: '## ###'
        },
        syntax: '### ## ###',
        variants: space('###', ' ', '## ###')
    }
];
