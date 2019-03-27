import enolib

def test_a_multiline_field_with_an_incomplete_multiline_field_operator_in_the_ending_line_raises_the_expected_parseerror():
  error = None

  input = ("-- multiline_field\n"
           "value\n"
           "value\n"
           "value\n"
           "- multiline_field")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("The multiline field 'multiline_field' starting in line 1 is not terminated until the end of the document.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | -- multiline_field\n"
               " *    2 | value\n"
               " *    3 | value\n"
               " *    4 | value\n"
               " *    5 | - multiline_field")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 0
  assert error.selection['from']['column'] == 0
  assert error.selection['to']['line'] == 0
  assert error.selection['to']['column'] == 18

def test_a_multiline_field_with_an_edge_case_key_and_missing_space_in_the_ending_line_raises_the_expected_parseerror():
  error = None

  input = ("-- -\n"
           "value\n"
           "value\n"
           "value\n"
           "---")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("The multiline field '-' starting in line 1 is not terminated until the end of the document.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | -- -\n"
               " *    2 | value\n"
               " *    3 | value\n"
               " *    4 | value\n"
               " *    5 | ---")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 0
  assert error.selection['from']['column'] == 0
  assert error.selection['to']['line'] == 0
  assert error.selection['to']['column'] == 4