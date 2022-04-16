import enolib

def test_querying_an_empty_field_for_a_required_but_missing_attribute_raises_the_expected_validationerror():
    error = None
    
    input = ("field:")
    
    try:
        enolib.parse(input).field('field').required_attribute('attribute')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("The attribute 'attribute' is missing - in case it has been specified look for typos and also check for correct capitalization.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " *    1 | field:")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 6
    assert error.selection['to']['line'] == 0
    assert error.selection['to']['column'] == 6

def test_querying_a_field_with_two_attributes_for_a_required_but_missing_attribute_raises_the_expected_validationerror():
    error = None
    
    input = ("field:\n"
             "attribute = value\n"
             "attribute = value")
    
    try:
        enolib.parse(input).field('field').required_attribute('missing')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("The attribute 'missing' is missing - in case it has been specified look for typos and also check for correct capitalization.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " *    1 | field:\n"
               " ?    2 | attribute = value\n"
               " ?    3 | attribute = value")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 6
    assert error.selection['to']['line'] == 0
    assert error.selection['to']['column'] == 6

def test_querying_a_field_with_attributes_empty_lines_and_comments_for_a_required_but_missing_attribute_raises_the_expected_validationerror():
    error = None
    
    input = ("field:\n"
             "\n"
             "> comment\n"
             "attribute = value\n"
             "\n"
             "> comment\n"
             "attribute = value")
    
    try:
        enolib.parse(input).field('field').required_attribute('missing')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("The attribute 'missing' is missing - in case it has been specified look for typos and also check for correct capitalization.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " *    1 | field:\n"
               " ?    2 | \n"
               " ?    3 | > comment\n"
               " ?    4 | attribute = value\n"
               " ?    5 | \n"
               " ?    6 | > comment\n"
               " ?    7 | attribute = value")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 6
    assert error.selection['to']['line'] == 0
    assert error.selection['to']['column'] == 6