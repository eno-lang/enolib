import enolib

def test_querying_a_section_for_a_required_but_missing_fieldset_raises_the_expected_validationerror():
  error = None

  input = ("# section")

  try:
    enolib.parse(input).section('section').required_fieldset('fieldset')
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("The fieldset 'fieldset' is missing - in case it has been specified look for typos and also check for correct capitalization.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " *    1 | # section")
  
  assert error.snippet == snippet
  
  selection = [[0,9], [0,9]]
  
  assert error.selection == selection