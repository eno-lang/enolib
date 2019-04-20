# Note: Study this file from the bottom up

import re


class Grammar:
    OPTIONAL = r'([^\n]+?)?'
    REQUIRED = r'(\S[^\n]*?)'

    #
    EMPTY = '()'
    EMPTY_LINE_INDEX = 1

    # TODO: Here and in other implementations possibly unify CONTINUATION REGEX into one, evaluate type of continuation operator in analyzer then
    # | value
    DIRECT_LINE_CONTINUATION = rf"(\|)[^\S\n]*{OPTIONAL}"
    DIRECT_LINE_CONTINUATION_OPERATOR_INDEX = 2
    DIRECT_LINE_CONTINUATION_VALUE_INDEX = 3

    # \ value
    SPACED_LINE_CONTINUATION = rf"(\\)[^\S\n]*{OPTIONAL}"
    SPACED_LINE_CONTINUATION_OPERATOR_INDEX = 4
    SPACED_LINE_CONTINUATION_VALUE_INDEX = 5

    CONTINUATION = f"{DIRECT_LINE_CONTINUATION}|{SPACED_LINE_CONTINUATION}"

    # > Comment
    COMMENT = rf"(>)[^\S\n]*{OPTIONAL}"
    COMMENT_OPERATOR_INDEX = 6
    COMMENT_VALUE_INDEX = 7

    # - value
    LIST_ITEM = rf"(-)(?!-)[^\S\n]*{OPTIONAL}"
    LIST_ITEM_OPERATOR_INDEX = 8
    LIST_ITEM_VALUE_INDEX = 9

    # -- key
    MULTILINE_FIELD = rf"(-{{2,}})(?!-)[^\S\n]*{REQUIRED}"
    MULTILINE_FIELD_OPERATOR_INDEX = 10
    MULTILINE_FIELD_KEY_INDEX = 11

    # #
    SECTION_OPERATOR = '(#+)(?!#)'
    SECTION_OPERATOR_INDEX = 12

    # # key
    SECTION_KEY_UNESCAPED = r'([^\s`<][^<\n]*?)'
    SECTION_KEY_UNESCAPED_INDEX = 13

    # # `key`
    SECTION_KEY_ESCAPE_BEGIN_OPERATOR_INDEX = 14
    SECTION_KEY_ESCAPED = rf"(`+)(?!`)[^\S\n]*(\S[^\n]*?)[^\S\n]*(\{SECTION_KEY_ESCAPE_BEGIN_OPERATOR_INDEX})" # TODO: Should this exclude the backreference inside the quotes? (as in ((?:(?!\\1).)+) ) here and elsewhere (probably not because it's not greedy.?)
    SECTION_KEY_ESCAPED_INDEX = 15
    SECTION_KEY_ESCAPE_END_OPERATOR_INDEX = 16

    # # key < template
    # # `key` < template
    SECTION_KEY = f"(?:{SECTION_KEY_UNESCAPED}|{SECTION_KEY_ESCAPED})"
    SECTION_TEMPLATE = rf"(?:(<(?!<)|<<)[^\S\n]*{REQUIRED})?"
    SECTION = rf"{SECTION_OPERATOR}\s*{SECTION_KEY}[^\S\n]*{SECTION_TEMPLATE}"
    SECTION_COPY_OPERATOR_INDEX = 17
    SECTION_TEMPLATE_INDEX = 18

    EARLY_DETERMINED = f"{CONTINUATION}|{COMMENT}|{LIST_ITEM}|{MULTILINE_FIELD}|{SECTION}"

    # key
    KEY_UNESCAPED = r'([^\s>#\-`\\|:=<][^\n:=<]*?)'
    KEY_UNESCAPED_INDEX = 19

    # `key`
    KEY_ESCAPE_BEGIN_OPERATOR_INDEX = 20
    KEY_ESCAPED = rf"(`+)(?!`)[^\S\n]*(\S[^\n]*?)[^\S\n]*(\{KEY_ESCAPE_BEGIN_OPERATOR_INDEX})"
    KEY_ESCAPED_INDEX = 21
    KEY_ESCAPE_END_OPERATOR_INDEX = 22

    KEY = f"(?:{KEY_UNESCAPED}|{KEY_ESCAPED})"

    # :
    # : value
    ELEMENT_OR_FIELD = rf"(:)[^\S\n]*{OPTIONAL}"
    ELEMENT_OPERATOR_INDEX = 23
    FIELD_VALUE_INDEX = 24

    # =
    # = value
    FIELDSET_ENTRY = rf"(=)[^\S\n]*{OPTIONAL}"
    FIELDSET_ENTRY_OPERATOR_INDEX = 25
    FIELDSET_ENTRY_VALUE_INDEX = 26

    # < template
    COPY = rf"(<)\s*{REQUIRED}"
    COPY_OPERATOR_INDEX = 27
    TEMPLATE_INDEX = 28

    LATE_DETERMINED = rf"{KEY}\s*(?:{ELEMENT_OR_FIELD}|{FIELDSET_ENTRY}|{COPY})"

    NOT_EMPTY = f"(?:{EARLY_DETERMINED}|{LATE_DETERMINED})"

    REGEX = re.compile(rf"[^\S\n]*(?:{EMPTY}|{NOT_EMPTY})[^\S\n]*(?=\n|$)")
