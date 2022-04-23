# frozen_string_literal: true

require_relative './space.rb'

SCENARIOS = [
  # DIRECT_CONTINUATION_SCENARIOS
  {
    captures: {
      Enolib::Grammar::CONTINUATION_OPERATOR_INDEX => '|'
    },
    syntax: '|',
    variants: space('|')
  },
  {
    captures: {
      Enolib::Grammar::CONTINUATION_OPERATOR_INDEX => '|',
      Enolib::Grammar::CONTINUATION_VALUE_INDEX => 'Value'
    },
    syntax: '| Value',
    variants: space('|', 'Value')
  },
  {
    captures: {
      Enolib::Grammar::CONTINUATION_OPERATOR_INDEX => '|',
      Enolib::Grammar::CONTINUATION_VALUE_INDEX => '|'
    },
    syntax: '| |',
    variants: space('|', '|')
  },

  # SPACED_CONTINUATION_SCENARIOS
  {
    captures: {
      Enolib::Grammar::CONTINUATION_OPERATOR_INDEX => '\\'
    },
    syntax: '\\',
    variants: space('\\')
  },
  {
    captures: {
      Enolib::Grammar::CONTINUATION_OPERATOR_INDEX => '\\',
      Enolib::Grammar::CONTINUATION_VALUE_INDEX => 'Value'
    },
    syntax: '\\ Value',
    variants: space('\\', 'Value')
  },
  {
    captures: {
      Enolib::Grammar::CONTINUATION_OPERATOR_INDEX => '\\',
      Enolib::Grammar::CONTINUATION_VALUE_INDEX => '\\'
    },
    syntax: '\\ \\',
    variants: space('\\', '\\')
  },

  # EMBED_SCENARIOS
  {
    captures: {
      Enolib::Grammar::EMBED_OPERATOR_INDEX => '--',
      Enolib::Grammar::EMBED_KEY_INDEX => 'Key'
    },
    syntax: '-- Key',
    variants: space('--', 'Key')
  },
  {
    captures: {
      Enolib::Grammar::EMBED_OPERATOR_INDEX => '--',
      Enolib::Grammar::EMBED_KEY_INDEX => '--'
    },
    syntax: '-- --',
    variants: space('--', ' ', '--')
  },
  {
    captures: {
      Enolib::Grammar::EMBED_OPERATOR_INDEX => '---',
      Enolib::Grammar::EMBED_KEY_INDEX => 'The Key'
    },
    syntax: '--- The Key',
    variants: space('---', 'The Key')
  },
  {
    captures: {
      Enolib::Grammar::EMBED_OPERATOR_INDEX => '---',
      Enolib::Grammar::EMBED_KEY_INDEX => '---'
    },
    syntax: '--- ---',
    variants: space('---', ' ', '---')
  },

  # COMMENT_SCENARIOS
  {
    captures: {
      Enolib::Grammar::COMMENT_OPERATOR_INDEX => '>',
      Enolib::Grammar::COMMENT_VALUE_INDEX => 'Comment Value'
    },
    syntax: '>Comment Value',
    variants: ['>Comment Value', ' >Comment Value', '   >Comment Value']
  },
  {
    captures: {
      Enolib::Grammar::COMMENT_OPERATOR_INDEX => '>',
      Enolib::Grammar::COMMENT_VALUE_INDEX => 'Comment Value'
    },
    syntax: '> Comment Value',
    variants: ['> Comment Value', ' > Comment Value', '   > Comment Value']
  },
  {
    captures: {
      Enolib::Grammar::COMMENT_OPERATOR_INDEX => '>',
      Enolib::Grammar::COMMENT_VALUE_INDEX => 'Comment Value'
    },
    syntax: '> Comment Value ',
    variants: ['> Comment Value ', ' > Comment Value ', '   > Comment Value ']
  },
  {
    captures: {
      Enolib::Grammar::COMMENT_OPERATOR_INDEX => '>',
      Enolib::Grammar::COMMENT_VALUE_INDEX => 'Comment Value'
    },
    syntax: '>   Comment Value   ',
    variants: ['>   Comment Value   ', ' >   Comment Value   ', '   >   Comment Value   ']
  },

  # ATTRIBUTE_SCENARIOS
  {
    captures: {
      Enolib::Grammar::KEY_UNESCAPED_INDEX => 'Key',
      Enolib::Grammar::ATTRIBUTE_OPERATOR_INDEX => '=',
      Enolib::Grammar::ATTRIBUTE_VALUE_INDEX => 'Value'
    },
    syntax: 'Key = Value',
    variants: space('Key', '=', 'Value')
  },
  {
    captures: {
      Enolib::Grammar::KEY_UNESCAPED_INDEX => 'The Key',
      Enolib::Grammar::ATTRIBUTE_OPERATOR_INDEX => '=',
      Enolib::Grammar::ATTRIBUTE_VALUE_INDEX => 'The Value'
    },
    syntax: 'The Key = The Value',
    variants: space('The Key', '=', 'The Value')
  },
  {
    captures: {
      Enolib::Grammar::KEY_UNESCAPED_INDEX => 'Key',
      Enolib::Grammar::ATTRIBUTE_OPERATOR_INDEX => '=',
      Enolib::Grammar::ATTRIBUTE_VALUE_INDEX => '='
    },
    syntax: 'Key = =',
    variants: space('Key', '=', ' ', '=')
  },
  {
    captures: {
      Enolib::Grammar::KEY_UNESCAPED_INDEX => 'Key',
      Enolib::Grammar::ATTRIBUTE_OPERATOR_INDEX => '=',
      Enolib::Grammar::ATTRIBUTE_VALUE_INDEX => ':'
    },
    syntax: 'Key = :',
    variants: space('Key', '=', ' ', ':')
  },
  {
    captures: {
      Enolib::Grammar::KEY_ESCAPE_BEGIN_OPERATOR_INDEX => '`',
      Enolib::Grammar::KEY_ESCAPED_INDEX => '=:',
      Enolib::Grammar::KEY_ESCAPE_END_OPERATOR_INDEX => '`',
      Enolib::Grammar::ATTRIBUTE_OPERATOR_INDEX => '=',
      Enolib::Grammar::ATTRIBUTE_VALUE_INDEX => '`=:`'
    },
    syntax: '`=:` = `=:`',
    variants: space('`', '=:', '`', '=', '`=:`')
  },
  {
    captures: {
      Enolib::Grammar::KEY_ESCAPE_BEGIN_OPERATOR_INDEX => '```',
      Enolib::Grammar::KEY_ESCAPED_INDEX => '`=``:',
      Enolib::Grammar::KEY_ESCAPE_END_OPERATOR_INDEX => '```',
      Enolib::Grammar::ATTRIBUTE_OPERATOR_INDEX => '=',
      Enolib::Grammar::ATTRIBUTE_VALUE_INDEX => '`=:`'
    },
    syntax: '``` `=``:``` = `=:`',
    variants: space('```', ' ', '`=``:', '```', '=', '`=:`')
  },

  # EMPTY_LINE_SCENARIOS
  {
    captures: {
      Enolib::Grammar::EMPTY_LINE_INDEX => ''
    },
    syntax: '',
    variants: space('')
  },

  # FIELD_SCENARIOS
  {
    captures: {
      Enolib::Grammar::KEY_UNESCAPED_INDEX => 'Key',
      Enolib::Grammar::FIELD_OPERATOR_INDEX => ':',
      Enolib::Grammar::FIELD_VALUE_INDEX => 'Value'
    },
    syntax: 'Key: Value',
    variants: space('Key', ':', 'Value')
  },
  {
    captures: {
      Enolib::Grammar::KEY_UNESCAPED_INDEX => 'The Key',
      Enolib::Grammar::FIELD_OPERATOR_INDEX => ':',
      Enolib::Grammar::FIELD_VALUE_INDEX => 'The Value'
    },
    syntax: 'The Key: The Value',
    variants: space('The Key', ':', 'The Value')
  },
  {
    captures: {
      Enolib::Grammar::KEY_UNESCAPED_INDEX => 'Key',
      Enolib::Grammar::FIELD_OPERATOR_INDEX => ':',
      Enolib::Grammar::FIELD_VALUE_INDEX => ':'
    },
    syntax: 'Key: :',
    variants: space('Key', ':', ' ', ':')
  },
  {
    captures: {
      Enolib::Grammar::KEY_ESCAPE_BEGIN_OPERATOR_INDEX => '`',
      Enolib::Grammar::KEY_ESCAPED_INDEX => '=:',
      Enolib::Grammar::KEY_ESCAPE_END_OPERATOR_INDEX => '`',
      Enolib::Grammar::FIELD_OPERATOR_INDEX => ':',
      Enolib::Grammar::FIELD_VALUE_INDEX => '`=:`'
    },
    syntax: '`=:` : `=:`',
    variants: space('`', '=:', '`', ':', '`=:`')
  },
  {
    captures: {
      Enolib::Grammar::KEY_ESCAPE_BEGIN_OPERATOR_INDEX => '```',
      Enolib::Grammar::KEY_ESCAPED_INDEX => '`=``:',
      Enolib::Grammar::KEY_ESCAPE_END_OPERATOR_INDEX => '```',
      Enolib::Grammar::FIELD_OPERATOR_INDEX => ':',
      Enolib::Grammar::FIELD_VALUE_INDEX => '`=:`'
    },
    syntax: '``` `=``:``` : `=:`',
    variants: space('```', ' ', '`=``:', '```', ':', '`=:`')
  },

  # INVALID_SCENARIOS
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
    syntax: ": Invalid\nValid:",
    variants: space(':', 'Invalid', "\n", 'Valid', ':')
  },
  {
    syntax: ": Invalid\nValid:Valid",
    variants: space(':', 'Invalid', "\n", 'Valid', ':', 'Valid')
  },

  # ITEM_SCENARIOS
  {
    captures: {
      Enolib::Grammar::ITEM_OPERATOR_INDEX => '-'
    },
    syntax: '-',
    variants: space('-')
  },
  {
    captures: {
      Enolib::Grammar::ITEM_OPERATOR_INDEX => '-',
      Enolib::Grammar::ITEM_VALUE_INDEX => 'Item'
    },
    syntax: '- Item',
    variants: space('-', 'Item')
  },
  {
    captures: {
      Enolib::Grammar::ITEM_OPERATOR_INDEX => '-',
      Enolib::Grammar::ITEM_VALUE_INDEX => 'The Item'
    },
    syntax: '- The Item',
    variants: space('-', 'The Item')
  },
  {
    captures: {
      Enolib::Grammar::ITEM_OPERATOR_INDEX => '-',
      Enolib::Grammar::ITEM_VALUE_INDEX => '-'
    },
    syntax: '- -',
    variants: space('-', ' ', '-')
  },

  # FIELD_OR_FIELDSET_OR_LIST_SCENARIOS
  {
    captures: {
      Enolib::Grammar::KEY_UNESCAPED_INDEX => 'Key',
      Enolib::Grammar::FIELD_OPERATOR_INDEX => ':'
    },
    syntax: 'Key:',
    variants: space('Key', ':')
  },
  {
    captures: {
      Enolib::Grammar::KEY_UNESCAPED_INDEX => 'The Key',
      Enolib::Grammar::FIELD_OPERATOR_INDEX => ':'
    },
    syntax: 'The Key:',
    variants: space('The Key', ':')
  },
  {
    captures: {
      Enolib::Grammar::KEY_ESCAPE_BEGIN_OPERATOR_INDEX => '`',
      Enolib::Grammar::KEY_ESCAPED_INDEX => '=:',
      Enolib::Grammar::KEY_ESCAPE_END_OPERATOR_INDEX => '`',
      Enolib::Grammar::FIELD_OPERATOR_INDEX => ':'
    },
    syntax: '`=:`:',
    variants: space('`', '=:', '`', ':')
  },
  {
    captures: {
      Enolib::Grammar::KEY_ESCAPE_BEGIN_OPERATOR_INDEX => '```',
      Enolib::Grammar::KEY_ESCAPED_INDEX => '`=``:',
      Enolib::Grammar::KEY_ESCAPE_END_OPERATOR_INDEX => '```',
      Enolib::Grammar::FIELD_OPERATOR_INDEX => ':'
    },
    syntax: '``` `=``:```:',
    variants: space('```', ' ', '`=``:', '```', ':')
  },

  # SECTION_SCENARIOS
  {
    captures: {
      Enolib::Grammar::SECTION_OPERATOR_INDEX => '#',
      Enolib::Grammar::SECTION_KEY_INDEX => 'Key'
    },
    syntax: '# Key',
    variants: space('#', 'Key')
  },
  {
    captures: {
      Enolib::Grammar::SECTION_OPERATOR_INDEX => '##',
      Enolib::Grammar::SECTION_KEY_INDEX => 'The Key'
    },
    syntax: '## The Key',
    variants: space('##', 'The Key')
  },
  {
    captures: {
      Enolib::Grammar::SECTION_OPERATOR_INDEX => '#',
      Enolib::Grammar::SECTION_KEY_INDEX => '# Other Key'
    },
    syntax: '# # Other Key',
    variants: space('#', ' ', '# Other Key')
  },
  {
    captures: {
      Enolib::Grammar::SECTION_OPERATOR_INDEX => '###',
      Enolib::Grammar::SECTION_KEY_INDEX => '## ###'
    },
    syntax: '### ## ###',
    variants: space('###', ' ', '## ###')
  },
  {
    captures: {
      Enolib::Grammar::SECTION_OPERATOR_INDEX => '#',
      Enolib::Grammar::SECTION_KEY_INDEX => '`=:` `=:`'
    },
    syntax: '# `=:` `=:`',
    variants: space('#', '`=:` `=:`')
  },
  {
    captures: {
      Enolib::Grammar::SECTION_OPERATOR_INDEX => '#',
      Enolib::Grammar::SECTION_KEY_INDEX => '``` `=``:```  ``` `=``:```'
    },
    syntax: '# ``` `=``:```  ``` `=``:```',
    variants: space('#', '``` `=``:```  ``` `=``:```')
  }
].freeze
