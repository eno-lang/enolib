import enolib

def test_copying_a_non_section_element_that_does_not_exist_raises_the_expected_parseerror():
    error = None

    input = ("copy < element")

    try:
        enolib.parse(input)
    except enolib.ParseError as _error:
        if isinstance(_error, enolib.ParseError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ParseError
    
    text = ("In line 1 the non-section element 'element' should be copied, but it was not found.")
    
    assert error.text == text
    
    snippet   = ("   Line | Content\n"
                 " >    1 | copy < element")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 0
    assert error.selection['to']['column'] == 14

def test_copying_a_non_section_element_whose_key_only_exists_on_a_section_raises_the_expected_parseerror():
    error = None

    input = ("# section\n"
             "\n"
             "# other_section\n"
             "\n"
             "copy < section")

    try:
        enolib.parse(input)
    except enolib.ParseError as _error:
        if isinstance(_error, enolib.ParseError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ParseError
    
    text = ("In line 5 the non-section element 'section' should be copied, but it was not found.")
    
    assert error.text == text
    
    snippet   = ("   Line | Content\n"
                 "   ...\n"
                 "      3 | # other_section\n"
                 "      4 | \n"
                 " >    5 | copy < section")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 4
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 4
    assert error.selection['to']['column'] == 14

def test_copying_an_implied_fieldset_whose_key_only_exists_on_a_section_raises_the_expected_parseerror():
    error = None

    input = ("# section\n"
             "\n"
             "# other_section\n"
             "\n"
             "copy < section\n"
             "entry = value")

    try:
        enolib.parse(input)
    except enolib.ParseError as _error:
        if isinstance(_error, enolib.ParseError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ParseError
    
    text = ("In line 5 the non-section element 'section' should be copied, but it was not found.")
    
    assert error.text == text
    
    snippet   = ("   Line | Content\n"
                 "   ...\n"
                 "      3 | # other_section\n"
                 "      4 | \n"
                 " >    5 | copy < section\n"
                 "      6 | entry = value")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 4
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 4
    assert error.selection['to']['column'] == 14

def test_copying_an_implied_list_whose_key_only_exists_on_a_section_raises_the_expected_parseerror():
    error = None

    input = ("# section\n"
             "\n"
             "# other_section\n"
             "\n"
             "copy < section\n"
             "- item")

    try:
        enolib.parse(input)
    except enolib.ParseError as _error:
        if isinstance(_error, enolib.ParseError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ParseError
    
    text = ("In line 5 the non-section element 'section' should be copied, but it was not found.")
    
    assert error.text == text
    
    snippet   = ("   Line | Content\n"
                 "   ...\n"
                 "      3 | # other_section\n"
                 "      4 | \n"
                 " >    5 | copy < section\n"
                 "      6 | - item")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 4
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 4
    assert error.selection['to']['column'] == 14