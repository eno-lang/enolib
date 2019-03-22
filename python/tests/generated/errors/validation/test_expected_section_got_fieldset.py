import enolib

def test_expecting_a_section_but_getting_a_fieldset_with_one_item_raises_the_expected_validationerror():
  error = None

  input = ("fieldset:\n"
           "entry = value")

  try:
    enolib.parse(input).section('fieldset')
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("A section with the key 'fieldset' was expected.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | fieldset:\n"
               " *    2 | entry = value")
  
  assert error.snippet == snippet
  
  selection = [[0,0], [1,13]]
  
  assert error.selection == selection

def test_expecting_a_section_but_getting_a_fieldset_with_empty_lines_and_multiple_entries_raises_the_expected_validationerror():
  error = None

  input = ("fieldset:\n"
           "\n"
           "entry = value\n"
           "\n"
           "entry = value\n"
           "\n"
           "entry = value\n"
           "")

  try:
    enolib.parse(input).section('fieldset')
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("A section with the key 'fieldset' was expected.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | fieldset:\n"
               " *    2 | \n"
               " *    3 | entry = value\n"
               " *    4 | \n"
               " *    5 | entry = value\n"
               " *    6 | \n"
               " *    7 | entry = value\n"
               "      8 | ")
  
  assert error.snippet == snippet
  
  selection = [[0,0], [6,13]]
  
  assert error.selection == selection

def test_expecting_a_section_but_getting_a_fieldset_with_two_entries_with_comments_raises_the_expected_validationerror():
  error = None

  input = ("fieldset:\n"
           "> comment\n"
           "entry = value\n"
           "\n"
           "> comment\n"
           "entry = value")

  try:
    enolib.parse(input).section('fieldset')
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("A section with the key 'fieldset' was expected.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | fieldset:\n"
               " *    2 | > comment\n"
               " *    3 | entry = value\n"
               " *    4 | \n"
               " *    5 | > comment\n"
               " *    6 | entry = value")
  
  assert error.snippet == snippet
  
  selection = [[0,0], [5,13]]
  
  assert error.selection == selection