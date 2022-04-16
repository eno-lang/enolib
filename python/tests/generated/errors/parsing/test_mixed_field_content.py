import enolib

def test_parsing_an_attribute_preceded_by_a_continuation_raises_the_expected_parseerror():
    error = None
    
    input = ("field:\n"
             "| continuation\n"
             "attribute = value")
    
    try:
        enolib.parse(input)
    except enolib.ParseError as _error:
        if isinstance(_error, enolib.ParseError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ParseError
    
    text = ("The field in line 1 must contain either only attributes, only items, or only a value.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " *    1 | field:\n"
               " *    2 | | continuation\n"
               " >    3 | attribute = value")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 2
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 2
    assert error.selection['to']['column'] == 17

def test_parsing_an_attribute_preceded_by_a_value_raises_the_expected_parseerror():
    error = None
    
    input = ("field: value\n"
             "attribute = value")
    
    try:
        enolib.parse(input)
    except enolib.ParseError as _error:
        if isinstance(_error, enolib.ParseError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ParseError
    
    text = ("The field in line 1 must contain either only attributes, only items, or only a value.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " *    1 | field: value\n"
               " >    2 | attribute = value")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 1
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 1
    assert error.selection['to']['column'] == 17

def test_parsing_an_attribute_preceded_by_a_item_raises_the_expected_parseerror():
    error = None
    
    input = ("field:\n"
             "- item\n"
             "attribute = value")
    
    try:
        enolib.parse(input)
    except enolib.ParseError as _error:
        if isinstance(_error, enolib.ParseError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ParseError
    
    text = ("The field in line 1 must contain either only attributes, only items, or only a value.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " *    1 | field:\n"
               " *    2 | - item\n"
               " >    3 | attribute = value")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 2
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 2
    assert error.selection['to']['column'] == 17

def test_parsing_an_item_preceded_by_a_continuation_raises_the_expected_parseerror():
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
    
    text = ("The field in line 1 must contain either only attributes, only items, or only a value.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " *    1 | field:\n"
               " *    2 | | continuation\n"
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
    
    text = ("The field in line 1 must contain either only attributes, only items, or only a value.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " *    1 | field:\n"
               " *    2 | attribute = value\n"
               " >    3 | - item")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 2
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 2
    assert error.selection['to']['column'] == 6