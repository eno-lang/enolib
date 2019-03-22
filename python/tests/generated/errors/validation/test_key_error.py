import enolib

def test_triggering_an_error_inside_a_custom_loader_when_querying_the_key_of_a_field_raises_the_expected_validationerror():
  error = None

  input = ("field: value")

  try:
    def loader(value):
      raise ValueError('my error')
    
    enolib.parse(input).field('field').key(loader)
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("There is a problem with the key of this element: my error")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | field: value")
  
  assert error.snippet == snippet
  
  selection = [[0,0], [0,5]]
  
  assert error.selection == selection