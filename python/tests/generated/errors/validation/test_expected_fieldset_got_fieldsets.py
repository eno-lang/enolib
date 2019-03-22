import enolib

def test_expecting_a_fieldset_but_getting_two_fieldsets_raises_the_expected_validationerror():
  error = None

  input = ("fieldset:\n"
           "entry = value\n"
           "fieldset:\n"
           "entry = value")

  try:
    enolib.parse(input).fieldset('fieldset')
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("Only a single fieldset with the key 'fieldset' was expected.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | fieldset:\n"
               " *    2 | entry = value\n"
               " >    3 | fieldset:\n"
               " *    4 | entry = value")
  
  assert error.snippet == snippet
  
  selection = [[0,0], [1,13]]
  
  assert error.selection == selection

def test_expecting_a_fieldset_but_getting_two_fieldsets_with_comments_empty_lines_and_continuations_raises_the_expected_validationerror():
  error = None

  input = ("> comment\n"
           "fieldset:\n"
           "entry = value\n"
           "\n"
           "entry = value\n"
           "\n"
           "fieldset:\n"
           "> comment\n"
           "entry = value")

  try:
    enolib.parse(input).fieldset('fieldset')
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("Only a single fieldset with the key 'fieldset' was expected.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "      1 | > comment\n"
               " >    2 | fieldset:\n"
               " *    3 | entry = value\n"
               " *    4 | \n"
               " *    5 | entry = value\n"
               "      6 | \n"
               " >    7 | fieldset:\n"
               " *    8 | > comment\n"
               " *    9 | entry = value")
  
  assert error.snippet == snippet
  
  selection = [[1,0], [4,13]]
  
  assert error.selection == selection