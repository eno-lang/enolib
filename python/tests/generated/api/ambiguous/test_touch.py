import enolib

def test_asserting_everything_was_touched_when_the_only_present_ambiguous_element_was_not_touched_raises_the_expected_validationerror():
    error = None

    input = ("ambiguous:")

    try:
        enolib.parse(input).assert_all_touched()
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("This element was not expected, make sure it is at the right place in the document and that its key is not mis-typed.")
    
    assert error.text == text
    
    snippet   = ("   Line | Content\n"
                 " >    1 | ambiguous:")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 0
    assert error.selection['to']['line'] == 0
    assert error.selection['to']['column'] == 10

def test_asserting_everything_was_touched_when_the_only_present_ambiguous_element_was_touched_produces_the_expected_result():
    input = ("ambiguous:")

    document = enolib.parse(input)
    
    document.element('ambiguous').touch()
    document.assert_all_touched()

    assert bool('it passes') is True

def test_asserting_everything_was_touched_when_the_only_present_ambiguous_element_was_touched_after_typecasting_to_a_field_produces_the_expected_result():
    input = ("ambiguous:")

    document = enolib.parse(input)
    
    document.field('ambiguous').touch()
    document.assert_all_touched()

    assert bool('it passes') is True

def test_asserting_everything_was_touched_when_the_only_present_ambiguous_element_was_touched_after_typecasting_to_a_fieldset_produces_the_expected_result():
    input = ("ambiguous:")

    document = enolib.parse(input)
    
    document.fieldset('ambiguous').touch()
    document.assert_all_touched()

    assert bool('it passes') is True

def test_asserting_everything_was_touched_when_the_only_present_ambiguous_element_was_touched_after_typecasting_to_a_list_produces_the_expected_result():
    input = ("ambiguous:")

    document = enolib.parse(input)
    
    document.list('ambiguous').touch()
    document.assert_all_touched()

    assert bool('it passes') is True