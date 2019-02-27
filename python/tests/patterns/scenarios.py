from tests.patterns.util import space
from enolib.grammar_regex import Grammar

SCENARIOS = [

  # DIRECT_LINE_CONTINUATION_SCENARIOS
  {
    'captures': {
      Grammar.DIRECT_LINE_CONTINUATION_OPERATOR_INDEX: '|'
    },
    'syntax': '|',
    'variants': space('|')
  },
  {
    'captures': {
      Grammar.DIRECT_LINE_CONTINUATION_OPERATOR_INDEX: '|',
      Grammar.DIRECT_LINE_CONTINUATION_VALUE_INDEX: 'Value'
    },
    'syntax': '| Value',
    'variants': space('|', 'Value')
  },
  {
    'captures': {
      Grammar.DIRECT_LINE_CONTINUATION_OPERATOR_INDEX: '|',
      Grammar.DIRECT_LINE_CONTINUATION_VALUE_INDEX: '|'
    },
    'syntax': '| |',
    'variants': space('|', '|')
  },

  # SPACED_LINE_CONTINUATION_SCENARIOS
  {
    'captures': {
      Grammar.SPACED_LINE_CONTINUATION_OPERATOR_INDEX: '\\'
    },
    'syntax': '\\',
    'variants': space('\\')
  },
  {
    'captures': {
      Grammar.SPACED_LINE_CONTINUATION_OPERATOR_INDEX: '\\',
      Grammar.SPACED_LINE_CONTINUATION_VALUE_INDEX: 'Value'
    },
    'syntax': '\\ Value',
    'variants': space('\\', 'Value')
  },
  {
    'captures': {
      Grammar.SPACED_LINE_CONTINUATION_OPERATOR_INDEX: '\\',
      Grammar.SPACED_LINE_CONTINUATION_VALUE_INDEX: '\\'
    },
    'syntax': '\\ \\',
    'variants': space('\\', '\\')
  },

  # MULTILINE_FIELD_SCENARIOS
  {
    'captures': {
      Grammar.MULTILINE_FIELD_OPERATOR_INDEX: '--',
      Grammar.MULTILINE_FIELD_KEY_INDEX: 'Key'
    },
    'syntax': '-- Key',
    'variants': space('--', 'Key')
  },
  {
    'captures': {
      Grammar.MULTILINE_FIELD_OPERATOR_INDEX: '--',
      Grammar.MULTILINE_FIELD_KEY_INDEX: '--'
    },
    'syntax': '-- --',
    'variants': space('--', ' ', '--')
  },
  {
    'captures': {
      Grammar.MULTILINE_FIELD_OPERATOR_INDEX: '---',
      Grammar.MULTILINE_FIELD_KEY_INDEX: 'The Key'
    },
    'syntax': '--- The Key',
    'variants': space('---', 'The Key')
  },
  {
    'captures': {
      Grammar.MULTILINE_FIELD_OPERATOR_INDEX: '---',
      Grammar.MULTILINE_FIELD_KEY_INDEX: '---'
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

  # COPY_SCENARIOS
  {
    'captures': {
      Grammar.KEY_UNESCAPED_INDEX: 'Key',
      Grammar.COPY_OPERATOR_INDEX: '<',
      Grammar.TEMPLATE_INDEX: 'Other Key'
    },
    'syntax': 'Key < Other Key',
    'variants': space('Key', '<', 'Other Key')
  },
  {
    'captures': {
      Grammar.KEY_UNESCAPED_INDEX: 'Key',
      Grammar.COPY_OPERATOR_INDEX: '<',
      Grammar.TEMPLATE_INDEX: '<'
    },
    'syntax': 'Key < <',
    'variants': space('Key', '<', '<')
  },
  {
    'captures': {
      Grammar.KEY_UNESCAPED_INDEX: 'Key',
      Grammar.COPY_OPERATOR_INDEX: '<',
      Grammar.TEMPLATE_INDEX: '<'
    },
    'syntax': 'Key <<',
    'variants': space('Key', '<<')
  },

  # FIELDSET_ENTRY_SCENARIOS
  {
    'captures': {
      Grammar.KEY_UNESCAPED_INDEX: 'Key',
      Grammar.FIELDSET_ENTRY_OPERATOR_INDEX: '=',
      Grammar.FIELDSET_ENTRY_VALUE_INDEX: 'Value'
    },
    'syntax': 'Key = Value',
    'variants': space('Key', '=', 'Value')
  },
  {
    'captures': {
      Grammar.KEY_UNESCAPED_INDEX: 'The Key',
      Grammar.FIELDSET_ENTRY_OPERATOR_INDEX: '=',
      Grammar.FIELDSET_ENTRY_VALUE_INDEX: 'The Value'
    },
    'syntax': 'The Key = The Value',
    'variants': space('The Key', '=', 'The Value')
  },
  {
    'captures': {
      Grammar.KEY_UNESCAPED_INDEX: 'Key',
      Grammar.FIELDSET_ENTRY_OPERATOR_INDEX: '=',
      Grammar.FIELDSET_ENTRY_VALUE_INDEX: '='
    },
    'syntax': 'Key = =',
    'variants': space('Key', '=', ' ', '=')
  },
  {
    'captures': {
      Grammar.KEY_UNESCAPED_INDEX: 'Key',
      Grammar.FIELDSET_ENTRY_OPERATOR_INDEX: '=',
      Grammar.FIELDSET_ENTRY_VALUE_INDEX: ':'
    },
    'syntax': 'Key = :',
    'variants': space('Key', '=', ' ', ':')
  },
  {
    'captures': {
      Grammar.KEY_ESCAPE_BEGIN_OPERATOR_INDEX: '`',
      Grammar.KEY_ESCAPED_INDEX: '<=:',
      Grammar.KEY_ESCAPE_END_OPERATOR_INDEX: '`',
      Grammar.FIELDSET_ENTRY_OPERATOR_INDEX: '=',
      Grammar.FIELDSET_ENTRY_VALUE_INDEX: '`<=:`'
    },
    'syntax': '`<=:` = `<=:`',
    'variants': space('`', '<=:', '`', '=', '`<=:`')
  },
  {
    'captures': {
      Grammar.KEY_ESCAPE_BEGIN_OPERATOR_INDEX: '```',
      Grammar.KEY_ESCAPED_INDEX: '<`=``:',
      Grammar.KEY_ESCAPE_END_OPERATOR_INDEX: '```',
      Grammar.FIELDSET_ENTRY_OPERATOR_INDEX: '=',
      Grammar.FIELDSET_ENTRY_VALUE_INDEX: '`<=:`'
    },
    'syntax': '```<`=``:``` = `<=:`',
    'variants': space('```', '<`=``:', '```', '=', '`<=:`')
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
      Grammar.ELEMENT_OPERATOR_INDEX: ':',
      Grammar.FIELD_VALUE_INDEX: 'Value'
    },
    'syntax': 'Key: Value',
    'variants': space('Key', ':', 'Value')
  },
  {
    'captures': {
      Grammar.KEY_UNESCAPED_INDEX: 'The Key',
      Grammar.ELEMENT_OPERATOR_INDEX: ':',
      Grammar.FIELD_VALUE_INDEX: 'The Value'
    },
    'syntax': 'The Key: The Value',
    'variants': space('The Key', ':', 'The Value')
  },
  {
    'captures': {
      Grammar.KEY_UNESCAPED_INDEX: 'Key',
      Grammar.ELEMENT_OPERATOR_INDEX: ':',
      Grammar.FIELD_VALUE_INDEX: ':'
    },
    'syntax': 'Key: :',
    'variants': space('Key', ':', ' ', ':')
  },
  {
    'captures': {
      Grammar.KEY_ESCAPE_BEGIN_OPERATOR_INDEX: '`',
      Grammar.KEY_ESCAPED_INDEX: '<=:',
      Grammar.KEY_ESCAPE_END_OPERATOR_INDEX: '`',
      Grammar.ELEMENT_OPERATOR_INDEX: ':',
      Grammar.FIELD_VALUE_INDEX: '`<=:`'
    },
    'syntax': '`<=:` : `<=:`',
    'variants': space('`', '<=:', '`', ':', '`<=:`')
  },
  {
    'captures': {
      Grammar.KEY_ESCAPE_BEGIN_OPERATOR_INDEX: '```',
      Grammar.KEY_ESCAPED_INDEX: '<`=``:',
      Grammar.KEY_ESCAPE_END_OPERATOR_INDEX: '```',
      Grammar.ELEMENT_OPERATOR_INDEX: ':',
      Grammar.FIELD_VALUE_INDEX: '`<=:`'
    },
    'syntax': '```<`=``:``` : `<=:`',
    'variants': space('```', '<`=``:', '```', ':', '`<=:`')
  },

  # INVALID_SCENARIOS
  {
    'syntax': 'Invalid',
    'variants': space('Invalid')
  },
  {
    'syntax': 'Invalid <',
    'variants': space('Invalid', '<')
  },
  {
    'syntax': '< Invalid',
    'variants': space('<', 'Invalid')
  },
  {
    'syntax': '<',
    'variants': space('<')
  },
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
    'syntax': '### `Invalid',
    'variants': space('###', '`Invalid')
  },
  {
    'syntax': '---',
    'variants': space('---')
  },
  {
    'syntax': 'Invalid\nValid:',
    'variants': space('Invalid', '\n', 'Valid', ':')
  },
  {
    'syntax': 'Invalid\nValid:Valid',
    'variants': space('Invalid', '\n', 'Valid', ':', 'Valid')
  },

  # LIST_ITEM_SCENARIOS
  {
    'captures': {
      Grammar.LIST_ITEM_OPERATOR_INDEX: '-'
    },
    'syntax': '-',
    'variants': space('-')
  },
  {
    'captures': {
      Grammar.LIST_ITEM_OPERATOR_INDEX: '-',
      Grammar.LIST_ITEM_VALUE_INDEX: 'Item'
    },
    'syntax': '- Item',
    'variants': space('-', 'Item')
  },
  {
    'captures': {
      Grammar.LIST_ITEM_OPERATOR_INDEX: '-',
      Grammar.LIST_ITEM_VALUE_INDEX: 'The Item'
    },
    'syntax': '- The Item',
    'variants': space('-', 'The Item')
  },
  {
    'captures': {
      Grammar.LIST_ITEM_OPERATOR_INDEX: '-',
      Grammar.LIST_ITEM_VALUE_INDEX: '-'
    },
    'syntax': '- -',
    'variants': space('-', ' ', '-')
  },

  # KEY_SCENARIOS
  {
    'captures': {
      Grammar.KEY_UNESCAPED_INDEX: 'Key',
      Grammar.ELEMENT_OPERATOR_INDEX: ':'
    },
    'syntax': 'Key:',
    'variants': space('Key', ':')
  },
  {
    'captures': {
      Grammar.KEY_UNESCAPED_INDEX: 'The Key',
      Grammar.ELEMENT_OPERATOR_INDEX: ':'
    },
    'syntax': 'The Key:',
    'variants': space('The Key', ':')
  },
  {
    'captures': {
      Grammar.KEY_ESCAPE_BEGIN_OPERATOR_INDEX: '`',
      Grammar.KEY_ESCAPED_INDEX: '<=:',
      Grammar.KEY_ESCAPE_END_OPERATOR_INDEX: '`',
      Grammar.ELEMENT_OPERATOR_INDEX: ':'
    },
    'syntax': '`<=:`:',
    'variants': space('`', '<=:', '`', ':')
  },
  {
    'captures': {
      Grammar.KEY_ESCAPE_BEGIN_OPERATOR_INDEX: '```',
      Grammar.KEY_ESCAPED_INDEX: '<`=``:',
      Grammar.KEY_ESCAPE_END_OPERATOR_INDEX: '```',
      Grammar.ELEMENT_OPERATOR_INDEX: ':'
    },
    'syntax': '```<`=``:```:',
    'variants': space('```', '<`=``:', '```', ':')
  },

  # SECTION_SCENARIOS
  {
    'captures': {
      Grammar.SECTION_OPERATOR_INDEX: '#',
      Grammar.SECTION_KEY_UNESCAPED_INDEX: 'Key'
    },
    'syntax': '# Key',
    'variants': space('#', 'Key')
  },
  {
    'captures': {
      Grammar.SECTION_OPERATOR_INDEX: '##',
      Grammar.SECTION_KEY_UNESCAPED_INDEX: 'The Key'
    },
    'syntax': '## The Key',
    'variants': space('##', 'The Key')
  },
  {
    'captures': {
      Grammar.SECTION_OPERATOR_INDEX: '#',
      Grammar.SECTION_KEY_UNESCAPED_INDEX: '#',
      Grammar.SECTION_COPY_OPERATOR_INDEX: '<',
      Grammar.SECTION_TEMPLATE_INDEX: 'Other Key'
    },
    'syntax': '# # < Other Key',
    'variants': space('#', ' ', '#', '<', 'Other Key')
  },
  {
    'captures': {
      Grammar.SECTION_OPERATOR_INDEX: '###',
      Grammar.SECTION_KEY_UNESCAPED_INDEX: '##',
      Grammar.SECTION_COPY_OPERATOR_INDEX: '<',
      Grammar.SECTION_TEMPLATE_INDEX: '###'
    },
    'syntax': '### ## < ###',
    'variants': space('###', ' ', '##', '<', '###')
  },
  {
    'captures': {
      Grammar.SECTION_OPERATOR_INDEX: '#',
      Grammar.SECTION_KEY_ESCAPE_BEGIN_OPERATOR_INDEX: '`',
      Grammar.SECTION_KEY_ESCAPED_INDEX: '<=:',
      Grammar.SECTION_KEY_ESCAPE_END_OPERATOR_INDEX: '`',
      Grammar.SECTION_COPY_OPERATOR_INDEX: '<',
      Grammar.SECTION_TEMPLATE_INDEX: '`<=:`'
    },
    'syntax': '# `<=:` < `<=:`',
    'variants': space('#', '`<=:`', '<', '`<=:`')
  },
  {
    'captures': {
      Grammar.SECTION_OPERATOR_INDEX: '#',
      Grammar.SECTION_KEY_ESCAPE_BEGIN_OPERATOR_INDEX: '```',
      Grammar.SECTION_KEY_ESCAPED_INDEX: '<`=``:',
      Grammar.SECTION_KEY_ESCAPE_END_OPERATOR_INDEX: '```',
      Grammar.SECTION_COPY_OPERATOR_INDEX: '<',
      Grammar.SECTION_TEMPLATE_INDEX: '```<`=``:```'
    },
    'syntax': '# ```<`=``:``` < ```<`=``:```',
    'variants': space('#', '```<`=``:```', '<', '```<`=``:```')
  },
  {
    'captures': {
      Grammar.SECTION_OPERATOR_INDEX: '#',
      Grammar.SECTION_KEY_UNESCAPED_INDEX: 'Key',
      Grammar.SECTION_COPY_OPERATOR_INDEX: '<<',
      Grammar.SECTION_TEMPLATE_INDEX: 'Other Key'
    },
    'syntax': '# Key << Other Key',
    'variants': space('#', ' ', 'Key', '<<', 'Other Key')
  }
]
