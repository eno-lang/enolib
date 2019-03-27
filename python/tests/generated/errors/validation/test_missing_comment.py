import enolib

def test_querying_a_section_for_a_required_but_missing_comment_raises_the_expected_validationerror():
  error = None

  input = ("# section")

  try:
    enolib.parse(input).section('section').required_string_comment()
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("A required comment for this element is missing.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | # section")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 0
  assert error.selection['from']['column'] == 0
  assert error.selection['to']['line'] == 0
  assert error.selection['to']['column'] == 0