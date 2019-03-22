import enolib

def test_obtaining_and_throwing_an_error_with_a_custom_message_in_the_context_of_a_field_raises_the_expected_validationerror():
  error = None

  input = ("field: value")

  try:
    raise enolib.parse(input).field('field').error('my message')
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("my message")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | field: value")
  
  assert error.snippet == snippet
  
  selection = [[0,0], [0,12]]
  
  assert error.selection == selection

def test_obtaining_and_throwing_an_error_with_a_custom_generated_message_in_the_context_of_a_field_raises_the_expected_validationerror():
  error = None

  input = ("field: value")

  try:
    raise enolib.parse(input).field('field').error(lambda field: f"my generated message for field '{field.string_key()}'")
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("my generated message for field 'field'")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | field: value")
  
  assert error.snippet == snippet
  
  selection = [[0,0], [0,12]]
  
  assert error.selection == selection