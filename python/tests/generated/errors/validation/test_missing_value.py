import enolib

def test_querying_a_fieldset_entry_for_a_required_but_missing_value_raises_the_expected_validationerror():
    error = None

    input = ("fieldset:\n"
             "entry =")

    try:
        enolib.parse(input).fieldset('fieldset').entry('entry').required_string_value()
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("The fieldset entry 'entry' must contain a value.")
    
    assert error.text == text
    
    snippet   = ("   Line | Content\n"
                 "      1 | fieldset:\n"
                 " >    2 | entry =")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 1
    assert error.selection['from']['column'] == 7
    assert error.selection['to']['line'] == 1
    assert error.selection['to']['column'] == 7

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
    
    snippet   = ("   Line | Content\n"
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
    
    snippet   = ("   Line | Content\n"
                 " >    1 | field:\n"
                 " *    2 | |\n"
                 " *    3 | \n"
                 " *    4 | |")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 6
    assert error.selection['to']['line'] == 3
    assert error.selection['to']['column'] == 1

def test_querying_a_list_with_an_empty_item_for_required_values_raises_the_expected_validationerror():
    error = None

    input = ("list:\n"
             "- item\n"
             "-")

    try:
        enolib.parse(input).list('list').required_string_values()
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("The list 'list' may not contain empty items.")
    
    assert error.text == text
    
    snippet   = ("   Line | Content\n"
                 "      1 | list:\n"
                 "      2 | - item\n"
                 " >    3 | -")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 2
    assert error.selection['from']['column'] == 1
    assert error.selection['to']['line'] == 2
    assert error.selection['to']['column'] == 1