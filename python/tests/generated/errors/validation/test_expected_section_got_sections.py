import enolib

def test_expecting_a_section_but_getting_two_sections_raises_the_expected_validationerror():
  error = None

  input = ("# section\n"
           "\n"
           "# section\n"
           "")

  try:
    enolib.parse(input).section('section')
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("Only a single section with the key 'section' was expected.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | # section\n"
               "      2 | \n"
               " >    3 | # section\n"
               "      4 | ")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 0
  assert error.selection['from']['column'] == 0
  assert error.selection['to']['line'] == 0
  assert error.selection['to']['column'] == 9

def test_expecting_a_section_but_getting_two_sections_with_elements_empty_lines_and_continuations_raises_the_expected_validationerror():
  error = None

  input = ("> comment\n"
           "# section\n"
           "\n"
           "field: value\n"
           "\n"
           "# section\n"
           "\n"
           "list:\n"
           "- item\n"
           "\\ continuation\n"
           "\n"
           "- item")

  try:
    enolib.parse(input).section('section')
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("Only a single section with the key 'section' was expected.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "      1 | > comment\n"
               " >    2 | # section\n"
               " *    3 | \n"
               " *    4 | field: value\n"
               "      5 | \n"
               " >    6 | # section\n"
               " *    7 | \n"
               " *    8 | list:\n"
               " *    9 | - item\n"
               " *   10 | \\ continuation\n"
               " *   11 | \n"
               " *   12 | - item")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 1
  assert error.selection['from']['column'] == 0
  assert error.selection['to']['line'] == 3
  assert error.selection['to']['column'] == 12