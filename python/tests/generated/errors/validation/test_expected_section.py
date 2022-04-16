import enolib

def test_expecting_a_section_but_getting_a_field_raises_the_expected_validationerror():
    error = None
    
    input = ("element: value")
    
    try:
        enolib.parse(input).section('element')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("A section with the key 'element' was expected.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | element: value")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 0
    assert error.selection['to']['column'] == 14

def test_expecting_a_section_but_getting_a_field_with_one_attribute_raises_the_expected_validationerror():
    error = None
    
    input = ("element:\n"
             "attribute = value")
    
    try:
        enolib.parse(input).section('element')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("A section with the key 'element' was expected.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | element:\n"
               " *    2 | attribute = value")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 1
    assert error.selection['to']['column'] == 17

def test_expecting_a_section_but_getting_a_field_with_empty_lines_and_three_attributes_raises_the_expected_validationerror():
    error = None
    
    input = ("element:\n"
             "\n"
             "attribute = value\n"
             "\n"
             "attribute = value\n"
             "\n"
             "attribute = value\n"
             "")
    
    try:
        enolib.parse(input).section('element')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("A section with the key 'element' was expected.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | element:\n"
               " *    2 | \n"
               " *    3 | attribute = value\n"
               " *    4 | \n"
               " *    5 | attribute = value\n"
               " *    6 | \n"
               " *    7 | attribute = value\n"
               "      8 | ")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 6
    assert error.selection['to']['column'] == 17

def test_expecting_a_section_but_getting_a_field_with_two_attributes_with_comments_raises_the_expected_validationerror():
    error = None
    
    input = ("element:\n"
             "> comment\n"
             "attribute = value\n"
             "\n"
             "> comment\n"
             "attribute = value")
    
    try:
        enolib.parse(input).section('element')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("A section with the key 'element' was expected.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | element:\n"
               " *    2 | > comment\n"
               " *    3 | attribute = value\n"
               " *    4 | \n"
               " *    5 | > comment\n"
               " *    6 | attribute = value")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 5
    assert error.selection['to']['column'] == 17

def test_expecting_a_section_but_getting_a_field_with_one_item_raises_the_expected_validationerror():
    error = None
    
    input = ("element:\n"
             "- item")
    
    try:
        enolib.parse(input).section('element')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("A section with the key 'element' was expected.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | element:\n"
               " *    2 | - item")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 1
    assert error.selection['to']['column'] == 6

def test_expecting_a_section_but_getting_a_field_with_empty_lines_and_three_items_raises_the_expected_validationerror():
    error = None
    
    input = ("element:\n"
             "\n"
             "- item\n"
             "\n"
             "- item\n"
             "\n"
             "- item\n"
             "")
    
    try:
        enolib.parse(input).section('element')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("A section with the key 'element' was expected.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | element:\n"
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

def test_expecting_a_section_but_getting_a_field_with_two_items_with_comments_raises_the_expected_validationerror():
    error = None
    
    input = ("element:\n"
             "> comment\n"
             "- item\n"
             "\n"
             "> comment\n"
             "- item")
    
    try:
        enolib.parse(input).section('element')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("A section with the key 'element' was expected.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | element:\n"
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

def test_expecting_a_section_but_getting_a_field_with_continuations_raises_the_expected_validationerror():
    error = None
    
    input = ("element:\n"
             "| continuation\n"
             "| continuation")
    
    try:
        enolib.parse(input).section('element')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("A section with the key 'element' was expected.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | element:\n"
               " *    2 | | continuation\n"
               " *    3 | | continuation")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 2
    assert error.selection['to']['column'] == 14

def test_expecting_a_section_but_getting_a_field_with_continuations_separated_by_idle_lines_raises_the_expected_validationerror():
    error = None
    
    input = ("element: value\n"
             "| continuation\n"
             "| continuation\n"
             "\n"
             "> comment\n"
             "| continuation")
    
    try:
        enolib.parse(input).section('element')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("A section with the key 'element' was expected.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | element: value\n"
               " *    2 | | continuation\n"
               " *    3 | | continuation\n"
               " *    4 | \n"
               " *    5 | > comment\n"
               " *    6 | | continuation")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 5
    assert error.selection['to']['column'] == 14

def test_expecting_a_section_but_getting_a_flag_raises_the_expected_validationerror():
    error = None
    
    input = ("element")
    
    try:
        enolib.parse(input).section('element')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("A section with the key 'element' was expected.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | element")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 0
    assert error.selection['to']['column'] == 7