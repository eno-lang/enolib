import enolib

def test_parsing_an_item_without_any_previous_element_raises_the_expected_parseerror():
    error = None
    
    input = ("- item")
    
    try:
        enolib.parse(input)
    except enolib.ParseError as _error:
        if isinstance(_error, enolib.ParseError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ParseError
    
    text = ("The item in line 1 is not contained within a field.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | - item")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 0
    assert error.selection['to']['column'] == 6