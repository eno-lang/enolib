import enolib

def test_copying_a_field_that_exists_twice_raises_the_expected_parseerror():
  error = None

  input = ("field: value\n"
           "field: value\n"
           "\n"
           "copy < field")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("There are at least two elements with the key 'field' that qualify for being copied here, it is not clear which to copy.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " ?    1 | field: value\n"
               " ?    2 | field: value\n"
               "      3 | \n"
               " >    4 | copy < field")
  
  assert error.snippet == snippet
  
  selection = [[3,0], [3,12]]
  
  assert error.selection == selection

def test_copying_a_section_that_exists_twice_raises_the_expected_parseerror():
  error = None

  input = ("# section\n"
           "\n"
           "# section\n"
           "\n"
           "# copy < section")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("There are at least two elements with the key 'section' that qualify for being copied here, it is not clear which to copy.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " ?    1 | # section\n"
               "      2 | \n"
               " ?    3 | # section\n"
               "      4 | \n"
               " >    5 | # copy < section")
  
  assert error.snippet == snippet
  
  selection = [[4,0], [4,16]]
  
  assert error.selection == selection