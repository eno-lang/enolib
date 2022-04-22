# Study this file from the bottom up

import re


class Grammar:
    OPTIONAL = r'([^\n]+?)?'
    REQUIRED = r'(\S[^\n]*?)'

    #
    EMPTY_LINE = '()'
    EMPTY_LINE_INDEX = 1

    # | value
    # \ value
    CONTINUATION = rf"([|\\])[^\S\n]*{OPTIONAL}"
    CONTINUATION_OPERATOR_INDEX = 2
    CONTINUATION_VALUE_INDEX = 3

    # > comment
    COMMENT = rf"(>)[^\S\n]*{OPTIONAL}"
    COMMENT_OPERATOR_INDEX = 4
    COMMENT_VALUE_INDEX = 5

    # - value
    ITEM = rf"(-)(?!-)[^\S\n]*{OPTIONAL}"
    ITEM_OPERATOR_INDEX = 6
    ITEM_VALUE_INDEX = 7

    # -- key
    EMBED = rf"(-{{2,}})(?!-)[^\S\n]*{REQUIRED}"
    EMBED_OPERATOR_INDEX = 8
    EMBED_KEY_INDEX = 9

    # # key
    SECTION = rf"(#+)(?!#)[^\S\n]*{REQUIRED}"
    SECTION_OPERATOR_INDEX = 10
    SECTION_KEY_INDEX = 11

    EARLY_DETERMINED = f"{CONTINUATION}|{COMMENT}|{ITEM}|{EMBED}|{SECTION}"

    # key
    KEY_UNESCAPED = r'([^\s>#\-`\\|:=][^\n:=]*?)'
    KEY_UNESCAPED_INDEX = 12

    # `key`
    KEY_ESCAPE_BEGIN_OPERATOR_INDEX = 13
    KEY_ESCAPED = rf"(`+)(?!`)[^\S\n]*(\S[^\n]*?)[^\S\n]*(\{KEY_ESCAPE_BEGIN_OPERATOR_INDEX})"
    KEY_ESCAPED_INDEX = 14
    KEY_ESCAPE_END_OPERATOR_INDEX = 15

    KEY = f"(?:{KEY_UNESCAPED}|{KEY_ESCAPED})"

    # :
    # : value
    FIELD = rf"(:)[^\S\n]*{OPTIONAL}"
    FIELD_OPERATOR_INDEX = 16
    FIELD_VALUE_INDEX = 17

    # =
    # = value
    ATTRIBUTE = rf"(=)[^\S\n]*{OPTIONAL}"
    ATTRIBUTE_OPERATOR_INDEX = 18
    ATTRIBUTE_VALUE_INDEX = 19

    LATE_DETERMINED = rf"{KEY}\s*(?:{FIELD}|{ATTRIBUTE})?"

    NON_EMPTY_LINE = f"(?:{EARLY_DETERMINED}|{LATE_DETERMINED})"

    REGEX = re.compile(rf"[^\S\n]*(?:{EMPTY_LINE}|{NON_EMPTY_LINE})[^\S\n]*(?=\n|$)")
