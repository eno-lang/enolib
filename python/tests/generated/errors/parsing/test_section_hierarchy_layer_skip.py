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
  
  selection = [[1,0], [1,17]]
  
  assert error.selection == selection