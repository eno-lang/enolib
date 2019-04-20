import enolib

def test_querying_a_missing_entry_on_a_fieldset_when_all_entries_are_required_raises_the_expected_validationerror():
    error = None

    input = ("fieldset:")

    try:
        fieldset = enolib.parse(input).fieldset('fieldset')
        
        fieldset.all_entries_required()
        fieldset.entry('entry')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("The fieldset entry 'entry' is missing - in case it has been specified look for typos and also check for correct capitalization.")
    
    assert error.text == text

def test_querying_a_missing_entry_on_a_fieldset_when_all_requiring_all_entries_is_explicitly_enabled_raises_the_expected_validationerror():
    error = None

    input = ("fieldset:")

    try:
        fieldset = enolib.parse(input).fieldset('fieldset')
        
        fieldset.all_entries_required(True)
        fieldset.entry('entry')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("The fieldset entry 'entry' is missing - in case it has been specified look for typos and also check for correct capitalization.")
    
    assert error.text == text

def test_querying_a_missing_entry_on_a_fieldset_when_requiring_all_entries_is_explicitly_disabled_produces_the_expected_result():
    input = ("fieldset:")

    fieldset = enolib.parse(input).fieldset('fieldset')
    
    fieldset.all_entries_required(False)
    fieldset.entry('entry')

    assert bool('it passes') is True

def test_querying_a_missing_entry_on_a_fieldset_when_requiring_all_entries_is_enabled_and_disabled_again_produces_the_expected_result():
    input = ("fieldset:")

    fieldset = enolib.parse(input).fieldset('fieldset')
    
    fieldset.all_entries_required(True)
    fieldset.all_entries_required(False)
    fieldset.entry('entry')

    assert bool('it passes') is True