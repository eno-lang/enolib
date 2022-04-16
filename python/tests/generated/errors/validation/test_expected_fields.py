import enolib

def test_expecting_fields_but_getting_an_empty_embed_raises_the_expected_validationerror():
    error = None
    
    input = ("-- element\n"
             "-- element")
    
    try:
        enolib.parse(input).fields('element')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("Only fields with the key 'element' were expected.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | -- element\n"
               " *    2 | -- element")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 1
    assert error.selection['to']['column'] == 10

def test_expecting_fields_but_getting_an_embed_with_a_value_raises_the_expected_validationerror():
    error = None
    
    input = ("-- element\n"
             "value\n"
             "-- element")
    
    try:
        enolib.parse(input).fields('element')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("Only fields with the key 'element' were expected.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | -- element\n"
               " *    2 | value\n"
               " *    3 | -- element")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 2
    assert error.selection['to']['column'] == 10

def test_expecting_fields_but_getting_an_embed_with_a_comment_raises_the_expected_validationerror():
    error = None
    
    input = ("> comment\n"
             "-- element\n"
             "value\n"
             "-- element")
    
    try:
        enolib.parse(input).fields('element')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("Only fields with the key 'element' were expected.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               "      1 | > comment\n"
               " >    2 | -- element\n"
               " *    3 | value\n"
               " *    4 | -- element")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 1
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 3
    assert error.selection['to']['column'] == 10

def test_expecting_fields_but_getting_a_flag_raises_the_expected_validationerror():
    error = None
    
    input = ("element")
    
    try:
        enolib.parse(input).fields('element')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("Only fields with the key 'element' were expected.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | element")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 0
    assert error.selection['to']['column'] == 7

def test_expecting_fields_but_getting_an_empty_section_raises_the_expected_validationerror():
    error = None
    
    input = ("# element")
    
    try:
        enolib.parse(input).fields('element')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("Only fields with the key 'element' were expected.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | # element")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 0
    assert error.selection['to']['column'] == 9

def test_expecting_fields_but_getting_a_section_with_a_field_with_a_value_and_a_field_with_items_raises_the_expected_validationerror():
    error = None
    
    input = ("# element\n"
             "\n"
             "field: value\n"
             "\n"
             "field:\n"
             "- item\n"
             "- item")
    
    try:
        enolib.parse(input).fields('element')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("Only fields with the key 'element' were expected.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | # element\n"
               " *    2 | \n"
               " *    3 | field: value\n"
               " *    4 | \n"
               " *    5 | field:\n"
               " *    6 | - item\n"
               " *    7 | - item")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 6
    assert error.selection['to']['column'] == 6

def test_expecting_fields_but_getting_a_section_with_subsections_raises_the_expected_validationerror():
    error = None
    
    input = ("# element\n"
             "\n"
             "## section\n"
             "\n"
             "field: value\n"
             "\n"
             "## section\n"
             "\n"
             "field:\n"
             "- item\n"
             "- item")
    
    try:
        enolib.parse(input).fields('element')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("Only fields with the key 'element' were expected.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | # element\n"
               " *    2 | \n"
               " *    3 | ## section\n"
               " *    4 | \n"
               " *    5 | field: value\n"
               " *    6 | \n"
               " *    7 | ## section\n"
               " *    8 | \n"
               " *    9 | field:\n"
               " *   10 | - item\n"
               " *   11 | - item")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 10
    assert error.selection['to']['column'] == 6