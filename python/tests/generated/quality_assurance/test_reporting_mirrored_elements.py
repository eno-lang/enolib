import enolib

def test_touching_elements_in_a_section_that_were_copied_from_another_section_does_not_touch_the_original_elements_raises_the_expected_validationerror():
    error = None

    input = ("field: value\n"
             "\n"
             "mirrored_field < field\n"
             "\n"
             "fieldset:\n"
             "1 = 1\n"
             "2 = 2\n"
             "\n"
             "mirrored_fieldset < fieldset\n"
             "\n"
             "list:\n"
             "- 1\n"
             "- 2\n"
             "\n"
             "mirrored_list < list\n"
             "\n"
             "# section\n"
             "\n"
             "# mirrored_section < section")

    try:
        document = enolib.parse(input)
        
        document.required_field('missing')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("The field 'missing' is missing - in case it has been specified look for typos and also check for correct capitalization.")
    
    assert error.text == text
    
    snippet   = ("   Line | Content\n"
                 " ?    1 | field: value\n"
                 " ?    2 | \n"
                 " ?    3 | mirrored_field < field\n"
                 " ?    4 | \n"
                 " ?    5 | fieldset:\n"
                 " ?    6 | 1 = 1\n"
                 " ?    7 | 2 = 2\n"
                 " ?    8 | \n"
                 " ?    9 | mirrored_fieldset < fieldset\n"
                 " ?   10 | \n"
                 " ?   11 | list:\n"
                 " ?   12 | - 1\n"
                 " ?   13 | - 2\n"
                 " ?   14 | \n"
                 " ?   15 | mirrored_list < list\n"
                 " ?   16 | \n"
                 " ?   17 | # section\n"
                 " ?   18 | \n"
                 " ?   19 | # mirrored_section < section")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 0
    assert error.selection['to']['column'] == 0