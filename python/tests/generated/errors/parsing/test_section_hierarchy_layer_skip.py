import enolib

def test_starting_a_section_two_levels_deeper_than_the_current_one_raises_the_expected_parseerror():
  error = None

  input = ("# section\n"
           "### subsubsection")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("Line 2 starts a section that is more than one level deeper than the current one.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " *    1 | # section\n"
               " >    2 | ### subsubsection")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 1
  assert error.selection['from']['column'] == 0
  assert error.selection['to']['line'] == 1
  assert error.selection['to']['column'] == 17