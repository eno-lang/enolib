import enolib

def test_querying_a_field_for_a_required_but_missing_value_raises_the_expected_validationerror():
  error = None

  input = ("field:")

  try:
    enolib.parse(input).field('field').required_string_value()
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("The field 'field' must contain a value.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | field:")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 0
  assert error.selection['from']['column'] == 6
  assert error.selection['to']['line'] == 0
  assert error.selection['to']['column'] == 6