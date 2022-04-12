import enolib

def test_querying_a_missing_attribute_on_a_field_with_attributes_when_all_attributes_are_required_raises_the_expected_validationerror():
    error = None
    
    input = ("field:")
    
    try:
        field = enolib.parse(input).field('field')
        
        field.all_attributes_required()
        field.attribute('attribute')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("The attribute 'attribute' is missing - in case it has been specified look for typos and also check for correct capitalization.")
    
    assert error.text == text

def test_querying_a_missing_attribute_on_a_field_with_attributes_when_all_requiring_all_attributes_is_explicitly_enabled_raises_the_expected_validationerror():
    error = None
    
    input = ("field:")
    
    try:
        field = enolib.parse(input).field('field')
        
        field.all_attributes_required(True)
        field.attribute('attribute')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("The attribute 'attribute' is missing - in case it has been specified look for typos and also check for correct capitalization.")
    
    assert error.text == text

def test_querying_a_missing_attribute_on_a_field_with_attributes_when_requiring_all_attributes_is_explicitly_disabled_produces_the_expected_result():
    input = ("field:")
    
    field = enolib.parse(input).field('field')
    
    field.all_attributes_required(False)
    field.attribute('attribute')
    
    assert bool('it passes') is True

def test_querying_a_missing_attribute_on_a_field_with_attributes_when_requiring_all_attributes_is_enabled_and_disabled_again_produces_the_expected_result():
    input = ("field:")
    
    field = enolib.parse(input).field('field')
    
    field.all_attributes_required(True)
    field.all_attributes_required(False)
    field.attribute('attribute')
    
    assert bool('it passes') is True

def test_querying_a_missing_but_explicitly_optional_attribute_on_a_field_with_attributes_when_requiring_all_attributes_is_enabled_produces_the_expected_result():
    input = ("field:")
    
    field = enolib.parse(input).field('field')
    
    field.all_attributes_required()
    field.optional_attribute('attribute')
    
    assert bool('it passes') is True