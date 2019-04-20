import enolib

def test_obtaining_and_throwing_an_error_with_a_custom_message_in_the_context_of_a_field_s_value_raises_the_expected_validationerror():
    error = None

    input = ("field: value")

    try:
        raise enolib.parse(input).field('field').value_error('my message')
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("There is a problem with the value of this element: my message")
    
    assert error.text == text
    
    snippet   = ("   Line | Content\n"
                 " >    1 | field: value")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 7
    assert error.selection['to']['line'] == 0
    assert error.selection['to']['column'] == 12

def test_obtaining_and_throwing_an_error_with_a_custom_generated_message_in_the_context_of_a_field_s_value_raises_the_expected_validationerror():
    error = None

    input = ("field: value")

    try:
        raise enolib.parse(input).field('field').value_error(lambda value: f"my generated message for value '{value}'")
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("There is a problem with the value of this element: my generated message for value 'value'")
    
    assert error.text == text
    
    snippet   = ("   Line | Content\n"
                 " >    1 | field: value")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 7
    assert error.selection['to']['line'] == 0
    assert error.selection['to']['column'] == 12