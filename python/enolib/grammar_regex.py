# Note: Study this file from the bottom up

import re


class Grammar:
    OPTIONAL = r'([^\n]+?)?'
    REQUIRED = r'(\S[^\n]*?)'

    #
    EMPTY_LINE = '()'
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

    # key
    SECTION = rf"(#+)(?!#)[^\S\n]*{REQUIRED}"
    SECTION_OPERATOR_INDEX = 12
    SECTION_KEY_INDEX = 13

    EARLY_DETERMINED = f"{CONTINUATION}|{COMMENT}|{LIST_ITEM}|{MULTILINE_FIELD}|{SECTION}"

    # key
    KEY_UNESCAPED = r'([^\s>#\-`\\|:=][^\n:=]*?)'
    KEY_UNESCAPED_INDEX = 14

    # `key`
    KEY_ESCAPE_BEGIN_OPERATOR_INDEX = 15
    KEY_ESCAPED = rf"(`+)(?!`)[^\S\n]*(\S[^\n]*?)[^\S\n]*(\{KEY_ESCAPE_BEGIN_OPERATOR_INDEX})"
    KEY_ESCAPED_INDEX = 16
    KEY_ESCAPE_END_OPERATOR_INDEX = 17

    KEY = f"(?:{KEY_UNESCAPED}|{KEY_ESCAPED})"

    # :
    # : value
    FIELD_OR_FIELDSET_OR_LIST = rf"(:)[^\S\n]*{OPTIONAL}"
    ELEMENT_OPERATOR_INDEX = 18
    FIELD_VALUE_INDEX = 19

    # =
    # = value
    FIELDSET_ENTRY = rf"(=)[^\S\n]*{OPTIONAL}"
    FIELDSET_ENTRY_OPERATOR_INDEX = 20
    FIELDSET_ENTRY_VALUE_INDEX = 21

    LATE_DETERMINED = rf"{KEY}\s*(?:{FIELD_OR_FIELDSET_OR_LIST}|{FIELDSET_ENTRY})?"

    NON_EMPTY_LINE = f"(?:{EARLY_DETERMINED}|{LATE_DETERMINED})"

    REGEX = re.compile(rf"[^\S\n]*(?:{EMPTY_LINE}|{NON_EMPTY_LINE})[^\S\n]*(?=\n|$)")
