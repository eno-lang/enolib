import enolib

def test_a_single_field_with_an_terminated_escaped_key_raises_the_expected_parseerror():
  error = None

  input = ("`field: value")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("In line 1 the key of an element is escaped, but the escape sequence is not terminated until the end of the line.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | `field: value")
  
  assert error.snippet == snippet
  
  selection = [[0,1], [0,13]]
  
  assert error.selection == selection

def test_a_single_section_with_an_unterminated_escaped_key_raises_the_expected_parseerror():
  error = None

  input = ("# `field: value")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("In line 1 the key of an element is escaped, but the escape sequence is not terminated until the end of the line.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | # `field: value")
  
  assert error.snippet == snippet
  
  selection = [[0,3], [0,15]]
  
  assert error.selection == selection