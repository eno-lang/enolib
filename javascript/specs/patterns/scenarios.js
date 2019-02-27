const matcher = require('../../lib/grammar_matcher.js');
const { space } = require('./space.js');

// TODO: Left bounding ````` foo ```, right bounding `foo`` scenarios?

exports.SCENARIOS = [
  // DIRECT_LINE_CONTINUATION_SCENARIOS
  {
    captures: {
      [matcher.DIRECT_LINE_CONTINUATION_OPERATOR_INDEX]: '|'
    },
    syntax: '|',
    variants: space('|')
  },
  {
    captures: {
      [matcher.DIRECT_LINE_CONTINUATION_OPERATOR_INDEX]: '|',
      [matcher.DIRECT_LINE_CONTINUATION_VALUE_INDEX]: 'Value'
    },
    syntax: '| Value',
    variants: space('|', 'Value')
  },
  {
    captures: {
      [matcher.DIRECT_LINE_CONTINUATION_OPERATOR_INDEX]: '|',
      [matcher.DIRECT_LINE_CONTINUATION_VALUE_INDEX]: '|'
    },
    syntax: '| |',
    variants: space('|', '|')
  },

  // SPACED_LINE_CONTINUATION_SCENARIOS
  {
    captures: {
      [matcher.SPACED_LINE_CONTINUATION_OPERATOR_INDEX]: '\\'
    },
    syntax: '\\',
    variants: space('\\')
  },
  {
    captures: {
      [matcher.SPACED_LINE_CONTINUATION_OPERATOR_INDEX]: '\\',
      [matcher.SPACED_LINE_CONTINUATION_VALUE_INDEX]: 'Value'
    },
    syntax: '\\ Value',
    variants: space('\\', 'Value')
  },
  {
    captures: {
      [matcher.SPACED_LINE_CONTINUATION_OPERATOR_INDEX]: '\\',
      [matcher.SPACED_LINE_CONTINUATION_VALUE_INDEX]: '\\'
    },
    syntax: '\\ \\',
    variants: space('\\', '\\')
  },

  // MULTILINE_FIELD_SCENARIOS
  {
    captures: {
      [matcher.MULTILINE_FIELD_OPERATOR_INDEX]: '--',
      [matcher.MULTILINE_FIELD_KEY_INDEX]: 'Key'
    },
    syntax: '-- Key',
    variants: space('--', 'Key')
  },
  {
    captures: {
      [matcher.MULTILINE_FIELD_OPERATOR_INDEX]: '--',
      [matcher.MULTILINE_FIELD_KEY_INDEX]: '--'
    },
    syntax: '-- --',
    variants: space('--', ' ', '--')
  },
  {
    captures: {
      [matcher.MULTILINE_FIELD_OPERATOR_INDEX]: '---',
      [matcher.MULTILINE_FIELD_KEY_INDEX]: 'The Key'
    },
    syntax: '--- The Key',
    variants: space('---', 'The Key')
  },
  {
    captures: {
      [matcher.MULTILINE_FIELD_OPERATOR_INDEX]: '---',
      [matcher.MULTILINE_FIELD_KEY_INDEX]: '---'
    },
    syntax: '--- ---',
    variants: space('---', ' ', '---')
  },

  // COMMENT_SCENARIOS
  {
    captures: {
      [matcher.COMMENT_OPERATOR_INDEX]: '>',
      [matcher.COMMENT_VALUE_INDEX]: 'Comment Value'
    },
    syntax: '>Comment Value',
    variants: ['>Comment Value', ' >Comment Value', '   >Comment Value']
  },
  {
    captures: {
      [matcher.COMMENT_OPERATOR_INDEX]: '>',
      [matcher.COMMENT_VALUE_INDEX]: 'Comment Value'
    },
    syntax: '> Comment Value',
    variants: ['> Comment Value', ' > Comment Value', '   > Comment Value']
  },
  {
    captures: {
      [matcher.COMMENT_OPERATOR_INDEX]: '>',
      [matcher.COMMENT_VALUE_INDEX]: 'Comment Value'
    },
    syntax: '> Comment Value ',
    variants: ['> Comment Value ', ' > Comment Value ', '   > Comment Value ']
  },
  {
    captures: {
      [matcher.COMMENT_OPERATOR_INDEX]: '>',
      [matcher.COMMENT_VALUE_INDEX]: 'Comment Value'
    },
    syntax: '>   Comment Value   ',
    variants: ['>   Comment Value   ', ' >   Comment Value   ', '   >   Comment Value   ']
  },

  // COPY_SCENARIOS
  {
    captures: {
      [matcher.KEY_UNESCAPED_INDEX]: 'Key',
      [matcher.COPY_OPERATOR_INDEX]: '<',
      [matcher.TEMPLATE_INDEX]: 'Other Key'
    },
    syntax: 'Key < Other Key',
    variants: space('Key', '<', 'Other Key')
  },
  {
    captures: {
      [matcher.KEY_UNESCAPED_INDEX]: 'Key',
      [matcher.COPY_OPERATOR_INDEX]: '<',
      [matcher.TEMPLATE_INDEX]: '<'
    },
    syntax: 'Key < <',
    variants: space('Key', '<', ' ', '<')
  },
  {
    captures: {
      [matcher.KEY_UNESCAPED_INDEX]: 'Key',
      [matcher.COPY_OPERATOR_INDEX]: '<<',
      [matcher.TEMPLATE_INDEX]: '<'
    },
    syntax: 'Key << <',
    variants: space('Key', '<<', '<')
  },

  // FIELDSET_ENTRY_SCENARIOS
  {
    captures: {
      [matcher.KEY_UNESCAPED_INDEX]: 'Key',
      [matcher.FIELDSET_ENTRY_OPERATOR_INDEX]: '=',
      [matcher.FIELDSET_ENTRY_VALUE_INDEX]: 'Value'
    },
    syntax: 'Key = Value',
    variants: space('Key', '=', 'Value')
  },
  {
    captures: {
      [matcher.KEY_UNESCAPED_INDEX]: 'The Key',
      [matcher.FIELDSET_ENTRY_OPERATOR_INDEX]: '=',
      [matcher.FIELDSET_ENTRY_VALUE_INDEX]: 'The Value'
    },
    syntax: 'The Key = The Value',
    variants: space('The Key', '=', 'The Value')
  },
  {
    captures: {
      [matcher.KEY_UNESCAPED_INDEX]: 'Key',
      [matcher.FIELDSET_ENTRY_OPERATOR_INDEX]: '=',
      [matcher.FIELDSET_ENTRY_VALUE_INDEX]: '='
    },
    syntax: 'Key = =',
    variants: space('Key', '=', ' ', '=')
  },
  {
    captures: {
      [matcher.KEY_UNESCAPED_INDEX]: 'Key',
      [matcher.FIELDSET_ENTRY_OPERATOR_INDEX]: '=',
      [matcher.FIELDSET_ENTRY_VALUE_INDEX]: ':'
    },
    syntax: 'Key = :',
    variants: space('Key', '=', ' ', ':')
  },
  {
    captures: {
      [matcher.KEY_ESCAPE_BEGIN_OPERATOR_INDEX]: '`',
      [matcher.KEY_ESCAPED_INDEX]: '<=:',
      [matcher.FIELDSET_ENTRY_OPERATOR_INDEX]: '=',
      [matcher.FIELDSET_ENTRY_VALUE_INDEX]: '`<=:`'
    },
    syntax: '`<=:` = `<=:`',
    variants: space('`', '<=:', '`', '=', '`<=:`')
  },
  {
    captures: {
      [matcher.KEY_ESCAPE_BEGIN_OPERATOR_INDEX]: '```',
      [matcher.KEY_ESCAPED_INDEX]: '<`=``:',
      [matcher.FIELDSET_ENTRY_OPERATOR_INDEX]: '=',
      [matcher.FIELDSET_ENTRY_VALUE_INDEX]: '`<=:`'
    },
    syntax: '```<`=``:``` = `<=:`',
    variants: space('```', '<`=``:', '```', '=', '`<=:`')
  },

  // EMPTY_LINE_SCENARIOS
  {
    captures: {
      [matcher.EMPTY_LINE_INDEX]: ''
    },
    syntax: '',
    variants: space('')
  },

  // FIELD_SCENARIOS
  {
    captures: {
      [matcher.KEY_UNESCAPED_INDEX]: 'Key',
      [matcher.ELEMENT_OPERATOR_INDEX]: ':',
      [matcher.FIELD_VALUE_INDEX]: 'Value'
    },
    syntax: 'Key: Value',
    variants: space('Key', ':', 'Value')
  },
  {
    captures: {
      [matcher.KEY_UNESCAPED_INDEX]: 'The Key',
      [matcher.ELEMENT_OPERATOR_INDEX]: ':',
      [matcher.FIELD_VALUE_INDEX]: 'The Value'
    },
    syntax: 'The Key: The Value',
    variants: space('The Key', ':', 'The Value')
  },
  {
    captures: {
      [matcher.KEY_UNESCAPED_INDEX]: 'Key',
      [matcher.ELEMENT_OPERATOR_INDEX]: ':',
      [matcher.FIELD_VALUE_INDEX]: ':'
    },
    syntax: 'Key: :',
    variants: space('Key', ':', ' ', ':')
  },
  {
    captures: {
      [matcher.KEY_ESCAPE_BEGIN_OPERATOR_INDEX]: '`',
      [matcher.KEY_ESCAPED_INDEX]: '<=:',
      [matcher.ELEMENT_OPERATOR_INDEX]: ':',
      [matcher.FIELD_VALUE_INDEX]: '`<=:`'
    },
    syntax: '`<=:` : `<=:`',
    variants: space('`', '<=:', '`', ':', '`<=:`')
  },
  {
    captures: {
      [matcher.KEY_ESCAPE_BEGIN_OPERATOR_INDEX]: '```',
      [matcher.KEY_ESCAPED_INDEX]: '<`=``:',
      [matcher.ELEMENT_OPERATOR_INDEX]: ':',
      [matcher.FIELD_VALUE_INDEX]: '`<=:`'
    },
    syntax: '```<`=``:``` : `<=:`',
    variants: space('```', '<`=``:', '```', ':', '`<=:`')
  },

  // INVALID_SCENARIOS
  {
    syntax: 'Invalid',
    variants: space('Invalid')
  },
  {
    syntax: 'Invalid <',
    variants: space('Invalid', '<')
  },
  {
    syntax: '< Invalid',
    variants: space('<', 'Invalid')
  },
  {
    syntax: '<',
    variants: space('<')
  },
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
    syntax: '### `Invalid',
    variants: space('###', '`Invalid')
  },
  {
    syntax: '---',
    variants: space('---')
  },
  {
    syntax: 'Invalid\nValid:',
    variants: space('Invalid', '\n', 'Valid', ':')
  },
  {
    syntax: 'Invalid\nValid:Valid',
    variants: space('Invalid', '\n', 'Valid', ':', 'Valid')
  },

  // LIST_ITEM_SCENARIOS
  {
    captures: {
      [matcher.LIST_ITEM_OPERATOR_INDEX]: '-'
    },
    syntax: '-',
    variants: space('-')
  },
  {
    captures: {
      [matcher.LIST_ITEM_OPERATOR_INDEX]: '-',
      [matcher.LIST_ITEM_VALUE_INDEX]: 'Item'
    },
    syntax: '- Item',
    variants: space('-', 'Item')
  },
  {
    captures: {
      [matcher.LIST_ITEM_OPERATOR_INDEX]: '-',
      [matcher.LIST_ITEM_VALUE_INDEX]: 'The Item'
    },
    syntax: '- The Item',
    variants: space('-', 'The Item')
  },
  {
    captures: {
      [matcher.LIST_ITEM_OPERATOR_INDEX]: '-',
      [matcher.LIST_ITEM_VALUE_INDEX]: '-'
    },
    syntax: '- -',
    variants: space('-', ' ', '-')
  },

  // EMPTY_SCENARIOS
  {
    captures: {
      [matcher.KEY_UNESCAPED_INDEX]: 'Key',
      [matcher.ELEMENT_OPERATOR_INDEX]: ':'
    },
    syntax: 'Key:',
    variants: space('Key', ':')
  },
  {
    captures: {
      [matcher.KEY_UNESCAPED_INDEX]: 'The Key',
      [matcher.ELEMENT_OPERATOR_INDEX]: ':'
    },
    syntax: 'The Key:',
    variants: space('The Key', ':')
  },
  {
    captures: {
      [matcher.KEY_ESCAPE_BEGIN_OPERATOR_INDEX]: '`',
      [matcher.KEY_ESCAPED_INDEX]: '<=:',
      [matcher.ELEMENT_OPERATOR_INDEX]: ':'
    },
    syntax: '`<=:`:',
    variants: space('`', '<=:', '`', ':')
  },
  {
    captures: {
      [matcher.KEY_ESCAPE_BEGIN_OPERATOR_INDEX]: '```',
      [matcher.KEY_ESCAPED_INDEX]: '<`=``:',
      [matcher.ELEMENT_OPERATOR_INDEX]: ':'
    },
    syntax: '```<`=``:```:',
    variants: space('```', '<`=``:', '```', ':')
  },

  // SECTION_SCENARIOS
  {
    captures: {
      [matcher.SECTION_OPERATOR_INDEX]: '#',
      [matcher.SECTION_KEY_UNESCAPED_INDEX]: 'Key'
    },
    syntax: '# Key',
    variants: space('#', 'Key')
  },
  {
    captures: {
      [matcher.SECTION_OPERATOR_INDEX]: '##',
      [matcher.SECTION_KEY_UNESCAPED_INDEX]: 'The Key'
    },
    syntax: '## The Key',
    variants: space('##', 'The Key')
  },
  {
    captures: {
      [matcher.SECTION_OPERATOR_INDEX]: '#',
      [matcher.SECTION_KEY_UNESCAPED_INDEX]: '#',
      [matcher.SECTION_COPY_OPERATOR_INDEX]: '<',
      [matcher.SECTION_TEMPLATE_INDEX]: 'Other Key'
    },
    syntax: '# # < Other Key',
    variants: space('#', ' ', '#', '<', 'Other Key')
  },
  {
    captures: {
      [matcher.SECTION_OPERATOR_INDEX]: '###',
      [matcher.SECTION_KEY_UNESCAPED_INDEX]: '##',
      [matcher.SECTION_COPY_OPERATOR_INDEX]: '<',
      [matcher.SECTION_TEMPLATE_INDEX]: '###'
    },
    syntax: '### ## < ###',
    variants: space('###', ' ', '##', '<', '###')
  },
  {
    captures: {
      [matcher.SECTION_OPERATOR_INDEX]: '#',
      [matcher.SECTION_KEY_ESCAPE_BEGIN_OPERATOR_INDEX]: '`',
      [matcher.SECTION_KEY_ESCAPED_INDEX]: '<=:',
      [matcher.SECTION_COPY_OPERATOR_INDEX]: '<',
      [matcher.SECTION_TEMPLATE_INDEX]: '`<=:`'
    },
    syntax: '# `<=:` < `<=:`',
    variants: space('#', '`<=:`', '<', '`<=:`')
  },
  {
    captures: {
      [matcher.SECTION_OPERATOR_INDEX]: '#',
      [matcher.SECTION_KEY_ESCAPE_BEGIN_OPERATOR_INDEX]: '```',
      [matcher.SECTION_KEY_ESCAPED_INDEX]: '<`=``:',
      [matcher.SECTION_COPY_OPERATOR_INDEX]: '<',
      [matcher.SECTION_TEMPLATE_INDEX]: '```<`=``:```'
    },
    syntax: '# ```<`=``:``` < ```<`=``:```',
    variants: space('#', '```<`=``:```', '<', '```<`=``:```')
  },
  {
    captures: {
      [matcher.SECTION_OPERATOR_INDEX]: '#',
      [matcher.SECTION_KEY_UNESCAPED_INDEX]: 'Key',
      [matcher.SECTION_COPY_OPERATOR_INDEX]: '<<',
      [matcher.SECTION_TEMPLATE_INDEX]: 'Other Key'
    },
    syntax: '# Key << Other Key',
    variants: space('#', ' ', 'Key', '<<', 'Other Key')
  }
];
