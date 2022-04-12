import enolib

def test_expecting_fieldsets_but_getting_a_list_with_one_item_raises_the_expected_validationerror():
    error = None
    
    input = ("list:\n"
             "- item")
    
    try:
        enolib.parse(input).fieldsets('list')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("Only fieldsets with the key 'list' were expected.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | list:\n"
               " *    2 | - item")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 1
    assert error.selection['to']['column'] == 6

def test_expecting_fieldsets_but_getting_a_list_with_empty_lines_and_multiple_items_raises_the_expected_validationerror():
    error = None
    
    input = ("list:\n"
             "\n"
             "- item\n"
             "\n"
             "- item\n"
             "\n"
             "- item\n"
             "")
    
    try:
        enolib.parse(input).fieldsets('list')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("Only fieldsets with the key 'list' were expected.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | list:\n"
               " *    2 | \n"
               " *    3 | - item\n"
               " *    4 | \n"
               " *    5 | - item\n"
               " *    6 | \n"
               " *    7 | - item\n"
               "      8 | ")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 6
    assert error.selection['to']['column'] == 6

def test_expecting_fieldsets_but_getting_a_list_with_two_items_with_comments_raises_the_expected_validationerror():
    error = None
    
    input = ("list:\n"
             "> comment\n"
             "- item\n"
             "\n"
             "> comment\n"
             "- item")
    
    try:
        enolib.parse(input).fieldsets('list')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("Only fieldsets with the key 'list' were expected.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | list:\n"
               " *    2 | > comment\n"
               " *    3 | - item\n"
               " *    4 | \n"
               " *    5 | > comment\n"
               " *    6 | - item")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 5
    assert error.selection['to']['column'] == 6