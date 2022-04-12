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
    
    text = ("Line 1 contains an item without a field being specified before.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | - item")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 0
    assert error.selection['to']['column'] == 6

def test_parsing_an_item_preceded_by_a_line_continuation_raises_the_expected_parseerror():
    error = None
    
    input = ("field:\n"
             "| continuation\n"
             "- item")
    
    try:
        enolib.parse(input)
    except enolib.ParseError as _error:
        if isinstance(_error, enolib.ParseError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ParseError
    
    text = ("Line 3 contains an item without a field being specified before.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               "      1 | field:\n"
               "      2 | | continuation\n"
               " >    3 | - item")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 2
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 2
    assert error.selection['to']['column'] == 6

def test_parsing_an_item_preceded_by_an_attribute_raises_the_expected_parseerror():
    error = None
    
    input = ("field:\n"
             "attribute = value\n"
             "- item")
    
    try:
        enolib.parse(input)
    except enolib.ParseError as _error:
        if isinstance(_error, enolib.ParseError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ParseError
    
    text = ("Line 3 contains an item without a field being specified before.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               "      1 | field:\n"
               "      2 | attribute = value\n"
               " >    3 | - item")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 2
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 2
    assert error.selection['to']['column'] == 6