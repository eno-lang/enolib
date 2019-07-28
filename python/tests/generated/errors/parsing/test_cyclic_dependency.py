import enolib

def test_multiple_sections_with_multiple_cyclical_copy_chains_raises_the_expected_parseerror():
    error = None

    input = ("# section_1 < section_2\n"
             "field: value\n"
             "\n"
             "## subsection_1 < subsection_2\n"
             "field: value\n"
             "\n"
             "# section_2 < section_1\n"
             "field: value\n"
             "\n"
             "## subsection_2 < section_1\n"
             "field: value")

    try:
        enolib.parse(input)
    except enolib.ParseError as _error:
        if isinstance(_error, enolib.ParseError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ParseError
    
    text = ("In line 10 'section_1' is copied into itself.")
    
    assert error.text == text
    
    snippet   = ("   Line | Content\n"
                 " *    1 | # section_1 < section_2\n"
                 "      2 | field: value\n"
                 "      3 | \n"
                 " *    4 | ## subsection_1 < subsection_2\n"
                 "      5 | field: value\n"
                 "      6 | \n"
                 "   ...\n"
                 "      8 | field: value\n"
                 "      9 | \n"
                 " >   10 | ## subsection_2 < section_1\n"
                 "     11 | field: value")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 9
    assert error.selection['from']['column'] == 18
    assert error.selection['to']['line'] == 9
    assert error.selection['to']['column'] == 27

def test_three_ambiguous_elements_copying_each_other_two_of_them_cyclically_raises_the_expected_parseerror():
    error = None

    input = ("copy < empty\n"
             "empty < cyclic\n"
             "cyclic < empty")

    try:
        enolib.parse(input)
    except enolib.ParseError as _error:
        if isinstance(_error, enolib.ParseError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ParseError
    
    text = ("In line 3 'empty' is copied into itself.")
    
    assert error.text == text
    
    snippet   = ("   Line | Content\n"
                 "      1 | copy < empty\n"
                 " *    2 | empty < cyclic\n"
                 " >    3 | cyclic < empty")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 2
    assert error.selection['from']['column'] == 9
    assert error.selection['to']['line'] == 2
    assert error.selection['to']['column'] == 14

def test_three_sections_with_one_being_copied_into_its_own_subsection_raises_the_expected_parseerror():
    error = None

    input = ("# section\n"
             "## copied_subsection < section\n"
             "# copied_section < section")

    try:
        enolib.parse(input)
    except enolib.ParseError as _error:
        if isinstance(_error, enolib.ParseError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ParseError
    
    text = ("In line 2 'section' is copied into itself.")
    
    assert error.text == text
    
    snippet   = ("   Line | Content\n"
                 " *    1 | # section\n"
                 " >    2 | ## copied_subsection < section\n"
                 "      3 | # copied_section < section")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 1
    assert error.selection['from']['column'] == 23
    assert error.selection['to']['line'] == 1
    assert error.selection['to']['column'] == 30

def test_three_sections_with_one_being_copied_into_its_own_subsubsection_raises_the_expected_parseerror():
    error = None

    input = ("# section\n"
             "## subsection\n"
             "### copied_subsubsection < section")

    try:
        enolib.parse(input)
    except enolib.ParseError as _error:
        if isinstance(_error, enolib.ParseError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ParseError
    
    text = ("In line 3 'section' is copied into itself.")
    
    assert error.text == text
    
    snippet   = ("   Line | Content\n"
                 " *    1 | # section\n"
                 " *    2 | ## subsection\n"
                 " >    3 | ### copied_subsubsection < section")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 2
    assert error.selection['from']['column'] == 27
    assert error.selection['to']['line'] == 2
    assert error.selection['to']['column'] == 34

def test_two_fieldsets_mutually_copying_each_other_raises_the_expected_parseerror():
    error = None

    input = ("copy < fieldset\n"
             "entry = value\n"
             "\n"
             "fieldset < copy\n"
             "entry = value")

    try:
        enolib.parse(input)
    except enolib.ParseError as _error:
        if isinstance(_error, enolib.ParseError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ParseError
    
    text = ("In line 4 'copy' is copied into itself.")
    
    assert error.text == text
    
    snippet   = ("   Line | Content\n"
                 " *    1 | copy < fieldset\n"
                 "      2 | entry = value\n"
                 "      3 | \n"
                 " >    4 | fieldset < copy\n"
                 "      5 | entry = value")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 3
    assert error.selection['from']['column'] == 11
    assert error.selection['to']['line'] == 3
    assert error.selection['to']['column'] == 15

def test_two_lists_mutually_copying_each_other_raises_the_expected_parseerror():
    error = None

    input = ("copy < list\n"
             "- item\n"
             "\n"
             "list < copy\n"
             "- item")

    try:
        enolib.parse(input)
    except enolib.ParseError as _error:
        if isinstance(_error, enolib.ParseError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ParseError
    
    text = ("In line 4 'copy' is copied into itself.")
    
    assert error.text == text
    
    snippet   = ("   Line | Content\n"
                 " *    1 | copy < list\n"
                 "      2 | - item\n"
                 "      3 | \n"
                 " >    4 | list < copy\n"
                 "      5 | - item")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 3
    assert error.selection['from']['column'] == 7
    assert error.selection['to']['line'] == 3
    assert error.selection['to']['column'] == 11