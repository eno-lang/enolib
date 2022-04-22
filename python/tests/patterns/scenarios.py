from tests.patterns.util import space
from enolib.grammar_regex import Grammar

SCENARIOS = [

    # DIRECT_CONTINUATION_SCENARIOS
    {
        'captures': {
            Grammar.CONTINUATION_OPERATOR_INDEX: '|'
        },
        'syntax': '|',
        'variants': space('|')
    },
    {
        'captures': {
            Grammar.CONTINUATION_OPERATOR_INDEX: '|',
            Grammar.CONTINUATION_VALUE_INDEX: 'Value'
        },
        'syntax': '| Value',
        'variants': space('|', 'Value')
    },
    {
        'captures': {
            Grammar.CONTINUATION_OPERATOR_INDEX: '|',
            Grammar.CONTINUATION_VALUE_INDEX: '|'
        },
        'syntax': '| |',
        'variants': space('|', '|')
    },

    # SPACED_CONTINUATION_SCENARIOS
    {
        'captures': {
            Grammar.CONTINUATION_OPERATOR_INDEX: '\\'
        },
        'syntax': '\\',
        'variants': space('\\')
    },
    {
        'captures': {
            Grammar.CONTINUATION_OPERATOR_INDEX: '\\',
            Grammar.CONTINUATION_VALUE_INDEX: 'Value'
        },
        'syntax': '\\ Value',
        'variants': space('\\', 'Value')
    },
    {
        'captures': {
            Grammar.CONTINUATION_OPERATOR_INDEX: '\\',
            Grammar.CONTINUATION_VALUE_INDEX: '\\'
        },
        'syntax': '\\ \\',
        'variants': space('\\', '\\')
    },

    # EMBED_SCENARIOS
    {
        'captures': {
            Grammar.EMBED_OPERATOR_INDEX: '--',
            Grammar.EMBED_KEY_INDEX: 'Key'
        },
        'syntax': '-- Key',
        'variants': space('--', 'Key')
    },
    {
        'captures': {
            Grammar.EMBED_OPERATOR_INDEX: '--',
            Grammar.EMBED_KEY_INDEX: '--'
        },
        'syntax': '-- --',
        'variants': space('--', ' ', '--')
    },
    {
        'captures': {
            Grammar.EMBED_OPERATOR_INDEX: '---',
            Grammar.EMBED_KEY_INDEX: 'The Key'
        },
        'syntax': '--- The Key',
        'variants': space('---', 'The Key')
    },
    {
        'captures': {
            Grammar.EMBED_OPERATOR_INDEX: '---',
            Grammar.EMBED_KEY_INDEX: '---'
        },
        'syntax': '--- ---',
        'variants': space('---', ' ', '---')
    },

    # COMMENT_SCENARIOS
    {
        'captures': {
            Grammar.COMMENT_OPERATOR_INDEX: '>',
            Grammar.COMMENT_VALUE_INDEX: 'Comment Value'
        },
        'syntax': '>Comment Value',
        'variants': ['>Comment Value', ' >Comment Value', '   >Comment Value']
    },
    {
        'captures': {
            Grammar.COMMENT_OPERATOR_INDEX: '>',
            Grammar.COMMENT_VALUE_INDEX: 'Comment Value'
        },
        'syntax': '> Comment Value',
        'variants': ['> Comment Value', ' > Comment Value', '   > Comment Value']
    },
    {
        'captures': {
            Grammar.COMMENT_OPERATOR_INDEX: '>',
            Grammar.COMMENT_VALUE_INDEX: 'Comment Value'
        },
        'syntax': '> Comment Value ',
        'variants': ['> Comment Value ', ' > Comment Value ', '   > Comment Value ']
    },
    {
        'captures': {
            Grammar.COMMENT_OPERATOR_INDEX: '>',
            Grammar.COMMENT_VALUE_INDEX: 'Comment Value'
        },
        'syntax': '>   Comment Value   ',
        'variants': ['>   Comment Value   ', ' >   Comment Value   ', '   >   Comment Value   ']
    },

    # ATTRIBUTE_SCENARIOS
    {
        'captures': {
            Grammar.KEY_UNESCAPED_INDEX: 'Key',
            Grammar.ATTRIBUTE_OPERATOR_INDEX: '=',
            Grammar.ATTRIBUTE_VALUE_INDEX: 'Value'
        },
        'syntax': 'Key = Value',
        'variants': space('Key', '=', 'Value')
    },
    {
        'captures': {
            Grammar.KEY_UNESCAPED_INDEX: 'The Key',
            Grammar.ATTRIBUTE_OPERATOR_INDEX: '=',
            Grammar.ATTRIBUTE_VALUE_INDEX: 'The Value'
        },
        'syntax': 'The Key = The Value',
        'variants': space('The Key', '=', 'The Value')
    },
    {
        'captures': {
            Grammar.KEY_UNESCAPED_INDEX: 'Key',
            Grammar.ATTRIBUTE_OPERATOR_INDEX: '=',
            Grammar.ATTRIBUTE_VALUE_INDEX: '='
        },
        'syntax': 'Key = =',
        'variants': space('Key', '=', ' ', '=')
    },
    {
        'captures': {
            Grammar.KEY_UNESCAPED_INDEX: 'Key',
            Grammar.ATTRIBUTE_OPERATOR_INDEX: '=',
            Grammar.ATTRIBUTE_VALUE_INDEX: ':'
        },
        'syntax': 'Key = :',
        'variants': space('Key', '=', ' ', ':')
    },
    {
        'captures': {
            Grammar.KEY_ESCAPE_BEGIN_OPERATOR_INDEX: '`',
            Grammar.KEY_ESCAPED_INDEX: '=:',
            Grammar.KEY_ESCAPE_END_OPERATOR_INDEX: '`',
            Grammar.ATTRIBUTE_OPERATOR_INDEX: '=',
            Grammar.ATTRIBUTE_VALUE_INDEX: '`=:`'
        },
        'syntax': '`=:` = `=:`',
        'variants': space('`', '=:', '`', '=', '`=:`')
    },
    {
        'captures': {
            Grammar.KEY_ESCAPE_BEGIN_OPERATOR_INDEX: '```',
            Grammar.KEY_ESCAPED_INDEX: '`=``:',
            Grammar.KEY_ESCAPE_END_OPERATOR_INDEX: '```',
            Grammar.ATTRIBUTE_OPERATOR_INDEX: '=',
            Grammar.ATTRIBUTE_VALUE_INDEX: '`=:`'
        },
        'syntax': '``` `=``:``` = `=:`',
        'variants': space('```', ' ', '`=``:', '```', '=', '`=:`')
    },

    # EMPTY_LINE_SCENARIOS
    {
        'captures': {
            Grammar.EMPTY_LINE_INDEX: ''
        },
        'syntax': '',
        'variants': space('')
    },

    # FIELD_SCENARIOS
    {
        'captures': {
            Grammar.KEY_UNESCAPED_INDEX: 'Key',
            Grammar.FIELD_OPERATOR_INDEX: ':',
            Grammar.FIELD_VALUE_INDEX: 'Value'
        },
        'syntax': 'Key: Value',
        'variants': space('Key', ':', 'Value')
    },
    {
        'captures': {
            Grammar.KEY_UNESCAPED_INDEX: 'The Key',
            Grammar.FIELD_OPERATOR_INDEX: ':',
            Grammar.FIELD_VALUE_INDEX: 'The Value'
        },
        'syntax': 'The Key: The Value',
        'variants': space('The Key', ':', 'The Value')
    },
    {
        'captures': {
            Grammar.KEY_UNESCAPED_INDEX: 'Key',
            Grammar.FIELD_OPERATOR_INDEX: ':',
            Grammar.FIELD_VALUE_INDEX: ':'
        },
        'syntax': 'Key: :',
        'variants': space('Key', ':', ' ', ':')
    },
    {
        'captures': {
            Grammar.KEY_ESCAPE_BEGIN_OPERATOR_INDEX: '`',
            Grammar.KEY_ESCAPED_INDEX: '=:',
            Grammar.KEY_ESCAPE_END_OPERATOR_INDEX: '`',
            Grammar.FIELD_OPERATOR_INDEX: ':',
            Grammar.FIELD_VALUE_INDEX: '`=:`'
        },
        'syntax': '`=:` : `=:`',
        'variants': space('`', '=:', '`', ':', '`=:`')
    },
    {
        'captures': {
            Grammar.KEY_ESCAPE_BEGIN_OPERATOR_INDEX: '```',
            Grammar.KEY_ESCAPED_INDEX: '`=``:',
            Grammar.KEY_ESCAPE_END_OPERATOR_INDEX: '```',
            Grammar.FIELD_OPERATOR_INDEX: ':',
            Grammar.FIELD_VALUE_INDEX: '`=:`'
        },
        'syntax': '``` `=``:``` : `=:`',
        'variants': space('```', ' ', '`=``:', '```', ':', '`=:`')
    },

    # INVALID_SCENARIOS
    {
      'syntax': '#',
        'variants': space('#')
    },
    {
      'syntax': '--',
        'variants': space('--')
    },
    {
      'syntax': ':',
        'variants': space(':')
    },
    {
      'syntax': ': Invalid',
        'variants': space(':', 'Invalid')
    },
    {
      'syntax': '=',
        'variants': space('=')
    },
    {
      'syntax': '= Invalid',
        'variants': space('=', 'Invalid')
    },
    {
      'syntax': '---',
        'variants': space('---')
    },
    {
      'syntax': ': Invalid\nValid:',
        'variants': space(':', 'Invalid', '\n', 'Valid', ':')
    },
    {
      'syntax': ': Invalid\nValid:Valid',
        'variants': space(':', 'Invalid', '\n', 'Valid', ':', 'Valid')
    },

    # ITEM_SCENARIOS
    {
        'captures': {
            Grammar.ITEM_OPERATOR_INDEX: '-'
        },
        'syntax': '-',
        'variants': space('-')
    },
    {
        'captures': {
            Grammar.ITEM_OPERATOR_INDEX: '-',
            Grammar.ITEM_VALUE_INDEX: 'Item'
        },
        'syntax': '- Item',
        'variants': space('-', 'Item')
    },
    {
        'captures': {
            Grammar.ITEM_OPERATOR_INDEX: '-',
            Grammar.ITEM_VALUE_INDEX: 'The Item'
        },
        'syntax': '- The Item',
        'variants': space('-', 'The Item')
    },
    {
        'captures': {
            Grammar.ITEM_OPERATOR_INDEX: '-',
            Grammar.ITEM_VALUE_INDEX: '-'
        },
        'syntax': '- -',
        'variants': space('-', ' ', '-')
    },

    # EMPTY_FIELD_SCENARIOS
    {
        'captures': {
            Grammar.KEY_UNESCAPED_INDEX: 'Key',
            Grammar.FIELD_OPERATOR_INDEX: ':'
        },
        'syntax': 'Key:',
        'variants': space('Key', ':')
    },
    {
        'captures': {
            Grammar.KEY_UNESCAPED_INDEX: 'The Key',
            Grammar.FIELD_OPERATOR_INDEX: ':'
        },
        'syntax': 'The Key:',
        'variants': space('The Key', ':')
    },
    {
        'captures': {
            Grammar.KEY_ESCAPE_BEGIN_OPERATOR_INDEX: '`',
            Grammar.KEY_ESCAPED_INDEX: '=:',
            Grammar.KEY_ESCAPE_END_OPERATOR_INDEX: '`',
            Grammar.FIELD_OPERATOR_INDEX: ':'
        },
        'syntax': '`=:`:',
        'variants': space('`', '=:', '`', ':')
    },
    {
        'captures': {
            Grammar.KEY_ESCAPE_BEGIN_OPERATOR_INDEX: '```',
            Grammar.KEY_ESCAPED_INDEX: '`=``:',
            Grammar.KEY_ESCAPE_END_OPERATOR_INDEX: '```',
            Grammar.FIELD_OPERATOR_INDEX: ':'
        },
        'syntax': '``` `=``:```:',
        'variants': space('```', ' ', '`=``:', '```', ':')
    },

    # SECTION_SCENARIOS
    {
        'captures': {
            Grammar.SECTION_OPERATOR_INDEX: '#',
            Grammar.SECTION_KEY_INDEX: 'Key'
        },
        'syntax': '# Key',
        'variants': space('#', 'Key')
    },
    {
        'captures': {
            Grammar.SECTION_OPERATOR_INDEX: '##',
            Grammar.SECTION_KEY_INDEX: 'The Key'
        },
        'syntax': '## The Key',
        'variants': space('##', 'The Key')
    },
    {
        'captures': {
            Grammar.SECTION_OPERATOR_INDEX: '#',
            Grammar.SECTION_KEY_INDEX: '# Other Key'
        },
        'syntax': '# # Other Key',
        'variants': space('#', ' ', '# Other Key')
    },
    {
        'captures': {
            Grammar.SECTION_OPERATOR_INDEX: '###',
            Grammar.SECTION_KEY_INDEX: '## ###'
        },
        'syntax': '### ## ###',
        'variants': space('###', ' ', '## ###')
    },
    {
        'captures': {
            Grammar.SECTION_OPERATOR_INDEX: '#',
            Grammar.SECTION_KEY_INDEX: '`=:` `=:`'
        },
        'syntax': '# `=:` `=:`',
        'variants': space('#', '`=:` `=:`')
    },
    {
        'captures': {
            Grammar.SECTION_OPERATOR_INDEX: '#',
            Grammar.SECTION_KEY_INDEX: '``` `=``:``` ``` `=``:```'
        },
        'syntax': '# ``` `=``:``` ``` `=``:```',
        'variants': space('#', '``` `=``:``` ``` `=``:```')
    }
]
