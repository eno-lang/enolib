import enolib

def test_copying_a_field_that_exists_twice_raises_the_expected_parseerror():
    error = None

    input = ("field: value\n"
             "field: value\n"
             "\n"
             "copy < field")

    try:
        enolib.parse(input)
    except enolib.ParseError as _error:
        if isinstance(_error, enolib.ParseError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ParseError
    
    text = ("There are at least two elements with the key 'field' that qualify for being copied here, it is not clear which to copy.")
    
    assert error.text == text
    
    snippet   = ("   Line | Content\n"
                 " ?    1 | field: value\n"
                 " ?    2 | field: value\n"
                 "      3 | \n"
                 " >    4 | copy < field")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 3
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 3
    assert error.selection['to']['column'] == 12

def test_copying_a_section_that_exists_twice_raises_the_expected_parseerror():
    error = None

    input = ("# section\n"
             "\n"
             "# section\n"
             "\n"
             "# copy < section")

    try:
        enolib.parse(input)
    except enolib.ParseError as _error:
        if isinstance(_error, enolib.ParseError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ParseError
    
    text = ("There are at least two elements with the key 'section' that qualify for being copied here, it is not clear which to copy.")
    
    assert error.text == text
    
    snippet   = ("   Line | Content\n"
                 " ?    1 | # section\n"
                 "      2 | \n"
                 " ?    3 | # section\n"
                 "      4 | \n"
                 " >    5 | # copy < section")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 4
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 4
    assert error.selection['to']['column'] == 16