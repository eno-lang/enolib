import enolib

def test_expecting_lists_but_getting_an_empty_section_raises_the_expected_validationerror():
  error = None

  input = ("# section")

  try:
    enolib.parse(input).lists('section')
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("Only lists with the key 'section' were expected.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | # section")
  
  assert error.snippet == snippet
  
  selection = [[0,0], [0,9]]
  
  assert error.selection == selection

def test_expecting_lists_but_getting_a_section_with_a_field_and_a_list_raises_the_expected_validationerror():
  error = None

  input = ("# section\n"
           "\n"
           "field: value\n"
           "\n"
           "list:\n"
           "- item\n"
           "- item")

  try:
    enolib.parse(input).lists('section')
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("Only lists with the key 'section' were expected.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | # section\n"
               " *    2 | \n"
               " *    3 | field: value\n"
               " *    4 | \n"
               " *    5 | list:\n"
               " *    6 | - item\n"
               " *    7 | - item")
  
  assert error.snippet == snippet
  
  selection = [[0,0], [6,6]]
  
  assert error.selection == selection

def test_expecting_lists_but_getting_a_section_with_subsections_raises_the_expected_validationerror():
  error = None

  input = ("# section\n"
           "\n"
           "## subsection\n"
           "\n"
           "field: value\n"
           "\n"
           "## subsection\n"
           "\n"
           "list:\n"
           "- item\n"
           "- item")

  try:
    enolib.parse(input).lists('section')
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("Only lists with the key 'section' were expected.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | # section\n"
               " *    2 | \n"
               " *    3 | ## subsection\n"
               " *    4 | \n"
               " *    5 | field: value\n"
               " *    6 | \n"
               " *    7 | ## subsection\n"
               " *    8 | \n"
               " *    9 | list:\n"
               " *   10 | - item\n"
               " *   11 | - item")
  
  assert error.snippet == snippet
  
  selection = [[0,0], [10,6]]
  
  assert error.selection == selection