import enolib

def test_querying_an_attribute_for_a_required_but_missing_value_raises_the_expected_validationerror():
    error = None
    
    input = ("field:\n"
             "attribute =")
    
    try:
        enolib.parse(input).field('field').attribute('attribute').required_string_value()
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("The attribute 'attribute' must contain a value.")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               "      1 | field:\n"
               " >    2 | attribute =")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 1
    assert error.selection['from']['column'] == 11
    assert error.selection['to']['line'] == 1
    assert error.selection['to']['column'] == 11