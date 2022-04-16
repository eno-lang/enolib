import enolib

def test_expecting_an_attribute_but_getting_two_attributes_raises_the_expected_validationerror():
    error = None
    
    input = ("field:\n"
             "attribute = value\n"
             "attribute = value")
    
    try:
        enolib.parse(input).field('field').attribute('attribute')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("This field was expected to contain only a single attribute with the key 'attribute'.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               "      1 | field:\n"
               " >    2 | attribute = value\n"
               " >    3 | attribute = value")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 1
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 1
    assert error.selection['to']['column'] == 17

def test_expecting_an_attribute_but_getting_two_attributes_with_comments_empty_lines_and_continuations_raises_the_expected_validationerror():
    error = None
    
    input = ("field:\n"
             "> comment\n"
             "attribute = value\n"
             "\\ continuation\n"
             "\\ continuation\n"
             "\n"
             "> comment\n"
             "attribute = value\n"
             "| continuation")
    
    try:
        enolib.parse(input).field('field').attribute('attribute')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("This field was expected to contain only a single attribute with the key 'attribute'.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               "      1 | field:\n"
               "      2 | > comment\n"
               " >    3 | attribute = value\n"
               " *    4 | \\ continuation\n"
               " *    5 | \\ continuation\n"
               "      6 | \n"
               "      7 | > comment\n"
               " >    8 | attribute = value\n"
               " *    9 | | continuation")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 2
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 4
    assert error.selection['to']['column'] == 14