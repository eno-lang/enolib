import enolib

def test_querying_a_fieldset_entry_for_a_required_but_missing_value_raises_the_expected_validationerror():
  error = None

  input = ("fieldset:\n"
           "entry =")

  try:
    enolib.parse(input).fieldset('fieldset').entry('entry').required_string_value()
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("The fieldset entry 'entry' must contain a value.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "      1 | fieldset:\n"
               " >    2 | entry =")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 1
  assert error.selection['from']['column'] == 7
  assert error.selection['to']['line'] == 1
  assert error.selection['to']['column'] == 7