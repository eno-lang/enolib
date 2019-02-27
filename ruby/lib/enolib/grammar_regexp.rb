# frozen_string_literal: true

# Note: Study this file from the bottom up

# TODO: Try out possesive quantifiers (careful x{2,}+ does not work in ruby, only xx++ (!)) - benchmark?

module Enolib
  module Grammar
    OPTIONAL = /([^\n]+?)?/.source
    REQUIRED = /(\S[^\n]*?)/.source

    #
    EMPTY = /()/.source
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

    # #
    SECTION_OPERATOR = /(#+)(?!#)/.source
    SECTION_OPERATOR_INDEX = 12

    # # key
    SECTION_KEY_UNESCAPED = /([^\s`<][^<\n]*?)/.source
    SECTION_KEY_UNESCAPED_INDEX = 13

    # # `key`
    SECTION_KEY_ESCAPE_BEGIN_OPERATOR_INDEX = 14
    SECTION_KEY_ESCAPED = /(`+)(?!`)[^\S\n]*(\S[^\n]*?)[^\S\n]*(#{"\\#{SECTION_KEY_ESCAPE_BEGIN_OPERATOR_INDEX}"})/.source # TODO: Should this exclude the backreference inside the quotes? (as in ((?:(?!\1).)+) ) here and elsewhere (probably not because it's not greedy.?!
    SECTION_KEY_ESCAPED_INDEX = 15
    SECTION_KEY_ESCAPE_END_OPERATOR_INDEX = 16

    # # key < template
    # # `key` < template
    SECTION_KEY = /(?:#{SECTION_KEY_UNESCAPED}|#{SECTION_KEY_ESCAPED})/.source
    SECTION_TEMPLATE = /(?:(<(?!<)|<<)[^\S\n]*#{REQUIRED})?/.source
    SECTION = /#{SECTION_OPERATOR}\s*#{SECTION_KEY}[^\S\n]*#{SECTION_TEMPLATE}/.source
    SECTION_COPY_OPERATOR_INDEX = 17
    SECTION_TEMPLATE_INDEX = 18

    EARLY_DETERMINED = /#{CONTINUATION}|#{COMMENT}|#{LIST_ITEM}|#{MULTILINE_FIELD}|#{SECTION}/.source

    # key
    KEY_UNESCAPED = /([^\s>#\-`\\|:=<][^\n:=<]*?)/.source
    KEY_UNESCAPED_INDEX = 19

    # `key`
    KEY_ESCAPE_BEGIN_OPERATOR_INDEX = 20
    KEY_ESCAPED = /(`+)(?!`)[^\S\n]*(\S[^\n]*?)[^\S\n]*(#{"\\#{KEY_ESCAPE_BEGIN_OPERATOR_INDEX}"})/.source
    KEY_ESCAPED_INDEX = 21
    KEY_ESCAPE_END_OPERATOR_INDEX = 22

    KEY = /(?:#{KEY_UNESCAPED}|#{KEY_ESCAPED})/.source

    # :
    # : value
    ELEMENT_OR_FIELD = /(:)[^\S\n]*#{OPTIONAL}/.source
    ELEMENT_OPERATOR_INDEX = 23
    FIELD_VALUE_INDEX = 24

    # =
    # = value
    FIELDSET_ENTRY = /(=)[^\S\n]*#{OPTIONAL}/.source
    FIELDSET_ENTRY_OPERATOR_INDEX = 25
    FIELDSET_ENTRY_VALUE_INDEX = 26

    # < template
    # << template
    COPY = /(<(?!<)|<<)\s*#{REQUIRED}/.source
    COPY_OPERATOR_INDEX = 27
    TEMPLATE_INDEX = 28

    LATE_DETERMINED = /#{KEY}\s*(?:#{ELEMENT_OR_FIELD}|#{FIELDSET_ENTRY}|#{COPY})/.source

    NOT_EMPTY = /(?:#{EARLY_DETERMINED}|#{LATE_DETERMINED})/.source

    REGEX = /[^\S\n]*(?:#{EMPTY}|#{NOT_EMPTY})[^\S\n]*(?=\n|$)/
  end
end
