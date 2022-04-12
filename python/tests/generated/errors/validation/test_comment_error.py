import enolib

def test_triggering_an_error_inside_a_custom_loader_when_querying_a_required_comment_on_a_field_raises_the_expected_validationerror():
    error = None
    
    input = ("> comment\n"
             "field: value")
    
    try:
        def loader(value):
          raise ValueError('my error')
        
        enolib.parse(input).field('field').required_comment(loader)
    except enolib.ValidationError as _error:
        if isinstance(_error, enolib.ValidationError):
            error = _error
        else:
            raise _error

    assert type(error) is enolib.ValidationError
    
    text = ("There is a problem with the comment of this element: my error")
    
    assert error.text == text
    
    snippet = ("   Line | Content\n"
               " >    1 | > comment\n"
               " *    2 | field: value")
    
    assert error.snippet == snippet
    
    assert error.selection['from']['line'] == 0
    assert error.selection['from']['column'] == 2
    assert error.selection['to']['line'] == 0
    assert error.selection['to']['column'] == 9