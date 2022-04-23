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
    # \ value
    CONTINUATION = /([|\\])[^\S\n]*#{OPTIONAL}/.source
    CONTINUATION_OPERATOR_INDEX = 2
    CONTINUATION_VALUE_INDEX = 3

    # > comment
    COMMENT = /(>)[^\S\n]*#{OPTIONAL}/.source
    COMMENT_OPERATOR_INDEX = 4
    COMMENT_VALUE_INDEX = 5

    # - value
    ITEM = /(-)(?!-)[^\S\n]*#{OPTIONAL}/.source
    ITEM_OPERATOR_INDEX = 6
    ITEM_VALUE_INDEX = 7

    # -- key
    EMBED = /(-{2,})(?!-)[^\S\n]*#{REQUIRED}/.source
    EMBED_OPERATOR_INDEX = 8
    EMBED_KEY_INDEX = 9

    # # key
    SECTION = /(#+)(?!#)[^\S\n]*#{REQUIRED}/.source
    SECTION_OPERATOR_INDEX = 10
    SECTION_KEY_INDEX = 11

    EARLY_DETERMINED = /#{CONTINUATION}|#{COMMENT}|#{ITEM}|#{EMBED}|#{SECTION}/.source

    # key
    KEY_UNESCAPED = /([^\s>#\-`\\|:=<][^\n:=<]*?)/.source
    KEY_UNESCAPED_INDEX = 12

    # `key`
    KEY_ESCAPE_BEGIN_OPERATOR_INDEX = 13
    KEY_ESCAPED = /(`+)(?!`)[^\S\n]*(\S[^\n]*?)[^\S\n]*(#{"\\#{KEY_ESCAPE_BEGIN_OPERATOR_INDEX}"})/.source
    KEY_ESCAPED_INDEX = 14
    KEY_ESCAPE_END_OPERATOR_INDEX = 15

    KEY = /(?:#{KEY_UNESCAPED}|#{KEY_ESCAPED})/.source

    # :
    # : value
    FIELD = /(:)[^\S\n]*#{OPTIONAL}/.source
    FIELD_OPERATOR_INDEX = 16
    FIELD_VALUE_INDEX = 17

    # =
    # = value
    ATTRIBUTE = /(=)[^\S\n]*#{OPTIONAL}/.source
    ATTRIBUTE_OPERATOR_INDEX = 18
    ATTRIBUTE_VALUE_INDEX = 19

    LATE_DETERMINED = /#{KEY}\s*(?:#{FIELD}|#{ATTRIBUTE})?/.source

    NON_EMPTY_LINE = /(?:#{EARLY_DETERMINED}|#{LATE_DETERMINED})/.source

    REGEX = /[^\S\n]*(?:#{EMPTY_LINE}|#{NON_EMPTY_LINE})[^\S\n]*(?=\n|$)/.freeze
  end
end
