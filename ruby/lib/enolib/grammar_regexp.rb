# frozen_string_literal: true

# Note: Study this file from the bottom up

module Enolib
  module Grammar
    OPTIONAL = /([^\n]+?)?/.source
    REQUIRED = /(\S[^\n]*?)/.source

    #
    EMPTY_LINE = /()/.source
    EMPTY_LINE_INDEX = 1

    # | value
    DIRECT_LINE_CONTINUATION = /(\|)[^\S\n]*#{OPTIONAL}/.source
    DIRECT_LINE_CONTINUATION_OPERATOR_INDEX = 2
    DIRECT_LINE_CONTINUATION_VALUE_INDEX = 3

    # \ value
    SPACED_LINE_CONTINUATION = /(\\)[^\S\n]*#{OPTIONAL}/.source
    SPACED_LINE_CONTINUATION_OPERATOR_INDEX = 4
    SPACED_LINE_CONTINUATION_VALUE_INDEX = 5

    CONTINUATION = /#{DIRECT_LINE_CONTINUATION}|#{SPACED_LINE_CONTINUATION}/.source

    # > Comment
    COMMENT = /(>)[^\S\n]*#{OPTIONAL}/.source
    COMMENT_OPERATOR_INDEX = 6
    COMMENT_VALUE_INDEX = 7

    # - value
    LIST_ITEM = /(-)(?!-)[^\S\n]*#{OPTIONAL}/.source
    LIST_ITEM_OPERATOR_INDEX = 8
    LIST_ITEM_VALUE_INDEX = 9

    # -- key
    MULTILINE_FIELD = /(-{2,})(?!-)[^\S\n]*#{REQUIRED}/.source
    MULTILINE_FIELD_OPERATOR_INDEX = 10
    MULTILINE_FIELD_KEY_INDEX = 11

    # # key
    SECTION = /(#+)(?!#)[^\S\n]*#{REQUIRED}/.source
    SECTION_OPERATOR_INDEX = 12
    SECTION_KEY_INDEX = 13

    EARLY_DETERMINED = /#{CONTINUATION}|#{COMMENT}|#{LIST_ITEM}|#{MULTILINE_FIELD}|#{SECTION}/.source

    # key
    KEY_UNESCAPED = /([^\s>#\-`\\|:=<][^\n:=<]*?)/.source
    KEY_UNESCAPED_INDEX = 14

    # `key`
    KEY_ESCAPE_BEGIN_OPERATOR_INDEX = 15
    KEY_ESCAPED = /(`+)(?!`)[^\S\n]*(\S[^\n]*?)[^\S\n]*(#{"\\#{KEY_ESCAPE_BEGIN_OPERATOR_INDEX}"})/.source
    KEY_ESCAPED_INDEX = 16
    KEY_ESCAPE_END_OPERATOR_INDEX = 17

    KEY = /(?:#{KEY_UNESCAPED}|#{KEY_ESCAPED})/.source

    # :
    # : value
    FIELD_OR_FIELDSET_OR_LIST = /(:)[^\S\n]*#{OPTIONAL}/.source
    ELEMENT_OPERATOR_INDEX = 18
    FIELD_VALUE_INDEX = 19

    # =
    # = value
    FIELDSET_ENTRY = /(=)[^\S\n]*#{OPTIONAL}/.source
    FIELDSET_ENTRY_OPERATOR_INDEX = 20
    FIELDSET_ENTRY_VALUE_INDEX = 21

    LATE_DETERMINED = /#{KEY}\s*(?:#{FIELD_OR_FIELDSET_OR_LIST}|#{FIELDSET_ENTRY})?/.source

    NON_EMPTY_LINE = /(?:#{EARLY_DETERMINED}|#{LATE_DETERMINED})/.source

    REGEX = /[^\S\n]*(?:#{EMPTY_LINE}|#{NON_EMPTY_LINE})[^\S\n]*(?=\n|$)/.freeze
  end
end
