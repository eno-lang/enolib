import enolib

def test_expecting_a_section_but_getting_a_field_raises_the_expected_validationerror():
    error = None

    input = ("field: value")

    try:
        enolib.parse(input).section('field')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("A section with the key 'field' was expected.")
    
    assert error.text == text
    
    snippet   = ("   Line | Content\n"
                 " >    1 | field: value")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 0
    assert error.selection['to']['column'] == 12

def test_expecting_a_section_but_getting_a_field_with_continuations_raises_the_expected_validationerror():
    error = None

    input = ("field:\n"
             "| continuation\n"
             "| continuation")

    try:
        enolib.parse(input).section('field')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("A section with the key 'field' was expected.")
    
    assert error.text == text
    
    snippet   = ("   Line | Content\n"
                 " >    1 | field:\n"
                 " *    2 | | continuation\n"
                 " *    3 | | continuation")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 2
    assert error.selection['to']['column'] == 14

def test_expecting_a_section_but_getting_a_field_with_continuations_separated_by_idle_lines_raises_the_expected_validationerror():
    error = None

    input = ("field: value\n"
             "| continuation\n"
             "| continuation\n"
             "\n"
             "> comment\n"
             "| continuation")

    try:
        enolib.parse(input).section('field')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("A section with the key 'field' was expected.")
    
    assert error.text == text
    
    snippet   = ("   Line | Content\n"
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