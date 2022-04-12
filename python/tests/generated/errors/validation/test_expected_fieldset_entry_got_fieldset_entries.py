import enolib

def test_expecting_a_fieldset_entry_but_getting_two_fieldset_entries_raises_the_expected_validationerror():
    error = None
    
    input = ("fieldset:\n"
             "entry = value\n"
             "entry = value")
    
    try:
        enolib.parse(input).fieldset('fieldset').entry('entry')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("Only a single fieldset entry with the key 'entry' was expected.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               "      1 | fieldset:\n"
               " >    2 | entry = value\n"
               " >    3 | entry = value")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 1
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 1
    assert error.selection['to']['column'] == 13

def test_expecting_a_fieldset_entry_but_getting_two_fieldset_entries_with_comments_empty_lines_and_continuations_raises_the_expected_validationerror():
    error = None
    
    input = ("fieldset:\n"
             "> comment\n"
             "entry = value\n"
             "\\ continuation\n"
             "\\ continuation\n"
             "\n"
             "> comment\n"
             "entry = value\n"
             "| continuation")
    
    try:
        enolib.parse(input).fieldset('fieldset').entry('entry')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("Only a single fieldset entry with the key 'entry' was expected.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               "      1 | fieldset:\n"
               "      2 | > comment\n"
               " >    3 | entry = value\n"
               " *    4 | \\ continuation\n"
               " *    5 | \\ continuation\n"
               "      6 | \n"
               "      7 | > comment\n"
               " >    8 | entry = value\n"
               " *    9 | | continuation")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 2
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 4
    assert error.selection['to']['column'] == 14