import enolib

def test_a_field_without_a_key_raises_the_expected_parseerror():
    error = None
    
    input = ("field:\n"
             "- item\n"
             "- item\n"
             ": value")
    
    try:
        enolib.parse(input)
    except enolib.ParseError as _error:
        if isinstance(_error, enolib.ParseError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ParseError
    
    text = ("The field in line 4 has no key.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               "   ...\n"
               "      2 | - item\n"
               "      3 | - item\n"
               " >    4 | : value")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 3
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 3
    assert error.selection['to']['column'] == 0