import enolib

def test_parsing_a_line_continuation_without_any_prior_element_raises_the_expected_parseerror():
    error = None

    input = ("| continuation")

    try:
        enolib.parse(input)
    except enolib.ParseError as _error:
        if isinstance(_error, enolib.ParseError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ParseError
    
    text = ("Line 1 contains a line continuation without a continuable element being specified before.")
    
    assert error.text == text
    
    snippet   = ("   Line | Content\n"
                 " >    1 | | continuation")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 0
    assert error.selection['to']['column'] == 14