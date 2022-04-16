import enolib

def test_a_valid_escape_sequence_continued_invalidly_raises_the_expected_parseerror():
    error = None
    
    input = ("`key` value")
    
    try:
        enolib.parse(input)
    except enolib.ParseError as _error:
        if isinstance(_error, enolib.ParseError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ParseError
    
    text = ("The escape sequence in line 1 can only be followed by an attribute or field operator.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | `key` value")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 6
    assert error.selection['to']['line'] == 0
    assert error.selection['to']['column'] == 11