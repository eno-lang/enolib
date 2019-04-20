import enolib

def test_querying_a_missing_field_on_the_document_when_all_elements_are_required_raises_the_expected_validationerror():
    error = None

    input = ("")

    try:
        document = enolib.parse(input)
        
        document.all_elements_required()
        document.field('field')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("The field 'field' is missing - in case it has been specified look for typos and also check for correct capitalization.")
    
    assert error.text == text

def test_querying_a_missing_fieldset_on_the_document_when_all_elements_are_required_raises_the_expected_validationerror():
    error = None

    input = ("")

    try:
        document = enolib.parse(input)
        
        document.all_elements_required()
        document.fieldset('fieldset')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("The fieldset 'fieldset' is missing - in case it has been specified look for typos and also check for correct capitalization.")
    
    assert error.text == text

def test_querying_a_missing_list_on_the_document_when_all_elements_are_required_raises_the_expected_validationerror():
    error = None

    input = ("")

    try:
        document = enolib.parse(input)
        
        document.all_elements_required()
        document.list('list')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("The list 'list' is missing - in case it has been specified look for typos and also check for correct capitalization.")
    
    assert error.text == text

def test_querying_a_missing_section_on_the_document_when_all_elements_are_required_raises_the_expected_validationerror():
    error = None

    input = ("")

    try:
        document = enolib.parse(input)
        
        document.all_elements_required()
        document.section('section')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("The section 'section' is missing - in case it has been specified look for typos and also check for correct capitalization.")
    
    assert error.text == text

def test_querying_a_missing_field_on_the_document_when_requiring_all_elements_is_explicitly_disabled_produces_the_expected_result():
    input = ("")

    document = enolib.parse(input)
    
    document.all_elements_required(False)
    document.field('field')

    assert bool('it passes') is True

def test_querying_a_missing_field_on_the_document_when_requiring_all_elements_is_enabled_and_disabled_again_produces_the_expected_result():
    input = ("")

    document = enolib.parse(input)
    
    document.all_elements_required(True)
    document.all_elements_required(False)
    document.field('field')

    assert bool('it passes') is True