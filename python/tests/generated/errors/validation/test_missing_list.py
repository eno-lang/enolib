import enolib

def test_querying_the_document_for_a_required_but_missing_list_raises_the_expected_validationerror():
  error = None

  input = ("")

  try:
    enolib.parse(input).required_list('list')
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("The list 'list' is missing - in case it has been specified look for typos and also check for correct capitalization.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " ?    1 | ")
  
  assert error.snippet == snippet
  
  selection = [[0,0], [0,0]]
  
  assert error.selection == selection

def test_querying_a_section_for_a_required_but_missing_list_raises_the_expected_validationerror():
  error = None

  input = ("# section")

  try:
    enolib.parse(input).section('section').required_list('list')
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("The list 'list' is missing - in case it has been specified look for typos and also check for correct capitalization.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " *    1 | # section")
  
  assert error.snippet == snippet
  
  selection = [[0,9], [0,9]]
  
  assert error.selection == selection