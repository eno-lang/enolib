import enolib

def test_expecting_a_field_but_getting_two_fields_raises_the_expected_validationerror():
  error = None

  input = ("field: value\n"
           "field: value")

  try:
    enolib.parse(input).field('field')
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("Only a single field with the key 'field' was expected.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | field: value\n"
               " >    2 | field: value")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 0
  assert error.selection['from']['column'] == 0
  assert error.selection['to']['line'] == 0
  assert error.selection['to']['column'] == 12

def test_expecting_a_field_but_getting_two_fields_with_comments_empty_lines_and_continuations_raises_the_expected_validationerror():
  error = None

  input = ("> comment\n"
           "field: value\n"
           "\\ continuation\n"
           "\n"
           "\\ continuation\n"
           "\n"
           "field: value\n"
           "> comment\n"
           "| continutation")

  try:
    enolib.parse(input).field('field')
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("Only a single field with the key 'field' was expected.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "      1 | > comment\n"
               " >    2 | field: value\n"
               " *    3 | \\ continuation\n"
               " *    4 | \n"
               " *    5 | \\ continuation\n"
               "      6 | \n"
               " >    7 | field: value\n"
               " *    8 | > comment\n"
               " *    9 | | continutation")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 1
  assert error.selection['from']['column'] == 0
  assert error.selection['to']['line'] == 4
  assert error.selection['to']['column'] == 14