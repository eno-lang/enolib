import enolib

def test_an_embed_without_a_key_raises_the_expected_parseerror():
    error = None
    
    input = ("--\n"
             "value")
    
    try:
        enolib.parse(input)
    except enolib.ParseError as _error:
        if isinstance(_error, enolib.ParseError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ParseError
    
    text = ("The embed in line 1 has no key.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | --\n"
               "      2 | value")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 2
    assert error.selection['to']['line'] == 0
    assert error.selection['to']['column'] == 2