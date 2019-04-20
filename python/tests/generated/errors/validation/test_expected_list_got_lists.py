import enolib

def test_expecting_a_list_but_getting_two_lists_raises_the_expected_validationerror():
    error = None

    input = ("list:\n"
             "- item\n"
             "list:\n"
             "- item")

    try:
        enolib.parse(input).list('list')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("Only a single list with the key 'list' was expected.")
    
    assert error.text == text
    
    snippet   = ("   Line | Content\n"
                 " >    1 | list:\n"
                 " *    2 | - item\n"
                 " >    3 | list:\n"
                 " *    4 | - item")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 1
    assert error.selection['to']['column'] == 6

def test_expecting_a_list_but_getting_two_lists_with_comments_empty_lines_and_continuations_raises_the_expected_validationerror():
    error = None

    input = ("> comment\n"
             "list:\n"
             "- item\n"
             "\n"
             "- item\n"
             "\n"
             "list:\n"
             "> comment\n"
             "- item\n"
             "\\ continuation")

    try:
        enolib.parse(input).list('list')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("Only a single list with the key 'list' was expected.")
    
    assert error.text == text
    
    snippet   = ("   Line | Content\n"
                 "      1 | > comment\n"
                 " >    2 | list:\n"
                 " *    3 | - item\n"
                 " *    4 | \n"
                 " *    5 | - item\n"
                 "      6 | \n"
                 " >    7 | list:\n"
                 " *    8 | > comment\n"
                 " *    9 | - item\n"
                 " *   10 | \\ continuation")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 1
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 4
    assert error.selection['to']['column'] == 6