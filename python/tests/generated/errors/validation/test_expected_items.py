import enolib

def test_expecting_a_field_containing_items_but_getting_a_field_containing_a_value_raises_the_expected_validationerror():
    error = None
    
    input = ("field: value")
    
    try:
        enolib.parse(input).field('field').items()
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("This field was expected to contain only items.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | field: value")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 0
    assert error.selection['to']['column'] == 12

def test_expecting_a_field_containing_items_but_getting_a_field_containing_continuations_raises_the_expected_validationerror():
    error = None
    
    input = ("field:\n"
             "| continuation\n"
             "| continuation")
    
    try:
        enolib.parse(input).field('field').items()
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("This field was expected to contain only items.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | field:\n"
               " *    2 | | continuation\n"
               " *    3 | | continuation")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 2
    assert error.selection['to']['column'] == 14

def test_expecting_a_field_with_items_but_getting_a_field_containing_a_value_and_continuations_separated_by_idle_lines_raises_the_expected_validationerror():
    error = None
    
    input = ("field: value\n"
             "| continuation\n"
             "| continuation\n"
             "\n"
             "> comment\n"
             "| continuation")
    
    try:
        enolib.parse(input).field('field').items()
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("This field was expected to contain only items.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | field: value\n"
               " *    2 | | continuation\n"
               " *    3 | | continuation\n"
               " *    4 | \n"
               " *    5 | > comment\n"
               " *    6 | | continuation")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 5
    assert error.selection['to']['column'] == 14

def test_expecting_a_field_containing_items_but_getting_a_field_with_one_attribute_raises_the_expected_validationerror():
    error = None
    
    input = ("field:\n"
             "attribute = value")
    
    try:
        enolib.parse(input).field('field').items()
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("This field was expected to contain only items.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | field:\n"
               " *    2 | attribute = value")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 1
    assert error.selection['to']['column'] == 17

def test_expecting_a_field_containing_items_but_getting_a_field_containing_empty_lines_and_three_attributes_raises_the_expected_validationerror():
    error = None
    
    input = ("field:\n"
             "\n"
             "attribute = value\n"
             "\n"
             "attribute = value\n"
             "\n"
             "attribute = value\n"
             "")
    
    try:
        enolib.parse(input).field('field').items()
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("This field was expected to contain only items.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | field:\n"
               " *    2 | \n"
               " *    3 | attribute = value\n"
               " *    4 | \n"
               " *    5 | attribute = value\n"
               " *    6 | \n"
               " *    7 | attribute = value\n"
               "      8 | ")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 6
    assert error.selection['to']['column'] == 17

def test_expecting_a_field_containing_items_but_getting_a_field_containing_two_attributes_with_comments_raises_the_expected_validationerror():
    error = None
    
    input = ("field:\n"
             "> comment\n"
             "attribute = value\n"
             "\n"
             "> comment\n"
             "attribute = value")
    
    try:
        enolib.parse(input).field('field').items()
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("This field was expected to contain only items.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | field:\n"
               " *    2 | > comment\n"
               " *    3 | attribute = value\n"
               " *    4 | \n"
               " *    5 | > comment\n"
               " *    6 | attribute = value")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 5
    assert error.selection['to']['column'] == 17