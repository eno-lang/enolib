import enolib

def test_a_single_field_with_an_unterminated_escaped_key_raises_the_expected_parseerror():
    error = None
    
    input = ("`field: value")
    
    try:
        enolib.parse(input)
    except enolib.ParseError as _error:
        if isinstance(_error, enolib.ParseError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ParseError
    
    text = ("The key escape sequence in line 1 is not terminated before the end of the line.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | `field: value")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 1
    assert error.selection['to']['line'] == 0
    assert error.selection['to']['column'] == 13