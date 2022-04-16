import enolib

def test_parsing_an_attribute_without_a_field_raises_the_expected_parseerror():
    error = None
    
    input = ("attribute = value")
    
    try:
        enolib.parse(input)
    except enolib.ParseError as _error:
        if isinstance(_error, enolib.ParseError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ParseError
    
    text = ("The attribute in line 1 is not contained within a field.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | attribute = value")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 0
    assert error.selection['to']['column'] == 17