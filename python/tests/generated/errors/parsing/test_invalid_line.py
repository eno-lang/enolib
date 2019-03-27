import enolib

def test_a_line_without_operators_raises_the_expected_parseerror():
  error = None

  input = ("list:\n"
           "- item\n"
           "- item\n"
           "illegal")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("Line 4 does not follow any specified pattern.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "   ...\n"
               "      2 | - item\n"
               "      3 | - item\n"
               " >    4 | illegal")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 3
  assert error.selection['from']['column'] == 0
  assert error.selection['to']['line'] == 3
  assert error.selection['to']['column'] == 7