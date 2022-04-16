import enolib

def test_querying_an_attribute_for_a_required_but_missing_value_raises_the_expected_validationerror():
    error = None
    
    input = ("field:\n"
             "attribute =")
    
    try:
        enolib.parse(input).field('field').attribute('attribute').required_string_value()
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("The attribute 'attribute' must contain a value.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               "      1 | field:\n"
               " >    2 | attribute =")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 1
    assert error.selection['from']['column'] == 11
    assert error.selection['to']['line'] == 1
    assert error.selection['to']['column'] == 11

def test_querying_a_field_for_a_required_but_missing_value_raises_the_expected_validationerror():
    error = None
    
    input = ("field:")
    
    try:
        enolib.parse(input).field('field').required_string_value()
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("The field 'field' must contain a value.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | field:")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 6
    assert error.selection['to']['line'] == 0
    assert error.selection['to']['column'] == 6

def test_querying_a_field_with_empty_line_continuations_for_a_required_but_missing_value_raises_the_expected_validationerror():
    error = None
    
    input = ("field:\n"
             "|\n"
             "\n"
             "|")
    
    try:
        enolib.parse(input).field('field').required_string_value()
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("The field 'field' must contain a value.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | field:\n"
               " *    2 | |\n"
               " *    3 | \n"
               " *    4 | |")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 6
    assert error.selection['to']['line'] == 3
    assert error.selection['to']['column'] == 1

def test_querying_a_field_with_an_empty_item_for_required_values_raises_the_expected_validationerror():
    error = None
    
    input = ("field:\n"
             "- item\n"
             "-")
    
    try:
        enolib.parse(input).field('field').required_string_values()
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("The field 'field' may not contain empty items.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               "      1 | field:\n"
               "      2 | - item\n"
               " >    3 | -")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 2
    assert error.selection['from']['column'] == 1
    assert error.selection['to']['line'] == 2
    assert error.selection['to']['column'] == 1