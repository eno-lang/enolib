import enolib

def test_copying_a_section_that_does_not_exist_raises_the_expected_parseerror():
  error = None

  input = ("# copy < section")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("In line 1 the section 'section' should be copied, but it was not found.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | # copy < section")
  
  assert error.snippet == snippet
  
  selection = [[0,0], [0,16]]
  
  assert error.selection == selection

def test_copying_a_section_whose_key_only_exists_on_a_field_raises_the_expected_parseerror():
  error = None

  input = ("field: value\n"
           "\n"
           "# copy < field")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("In line 3 the section 'field' should be copied, but it was not found.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "      1 | field: value\n"
               "      2 | \n"
               " >    3 | # copy < field")
  
  assert error.snippet == snippet
  
  selection = [[2,0], [2,14]]
  
  assert error.selection == selection

def test_copying_a_section_whose_key_only_exists_on_a_fieldset_raises_the_expected_parseerror():
  error = None

  input = ("fieldset:\n"
           "entry = value\n"
           "\n"
           "# copy < fieldset")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("In line 4 the section 'fieldset' should be copied, but it was not found.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "   ...\n"
               "      2 | entry = value\n"
               "      3 | \n"
               " >    4 | # copy < fieldset")
  
  assert error.snippet == snippet
  
  selection = [[3,0], [3,17]]
  
  assert error.selection == selection

def test_copying_a_section_whose_key_only_exists_on_a_list_raises_the_expected_parseerror():
  error = None

  input = ("list:\n"
           "- item\n"
           "\n"
           "# copy < list")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("In line 4 the section 'list' should be copied, but it was not found.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "   ...\n"
               "      2 | - item\n"
               "      3 | \n"
               " >    4 | # copy < list")
  
  assert error.snippet == snippet
  
  selection = [[3,0], [3,13]]
  
  assert error.selection == selection

def test_copying_a_section_whose_key_only_exists_on_a_multiline_field_raises_the_expected_parseerror():
  error = None

  input = ("-- multiline_field\n"
           "value\n"
           "-- multiline_field\n"
           "\n"
           "# copy < multiline_field")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("In line 5 the section 'multiline_field' should be copied, but it was not found.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "   ...\n"
               "      3 | -- multiline_field\n"
               "      4 | \n"
               " >    5 | # copy < multiline_field")
  
  assert error.snippet == snippet
  
  selection = [[4,0], [4,24]]
  
  assert error.selection == selection

def test_copying_a_section_whose_key_only_exists_on_an_empty_multiline_field_raises_the_expected_parseerror():
  error = None

  input = ("-- multiline_field\n"
           "-- multiline_field\n"
           "\n"
           "# copy < multiline_field")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("In line 4 the section 'multiline_field' should be copied, but it was not found.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "   ...\n"
               "      2 | -- multiline_field\n"
               "      3 | \n"
               " >    4 | # copy < multiline_field")
  
  assert error.snippet == snippet
  
  selection = [[3,0], [3,24]]
  
  assert error.selection == selection

def test_copying_a_section_whose_key_only_exists_on_a_fieldset_entry_raises_the_expected_parseerror():
  error = None

  input = ("fieldset:\n"
           "entry = value\n"
           "\n"
           "# copy < entry")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("In line 4 the section 'entry' should be copied, but it was not found.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "   ...\n"
               "      2 | entry = value\n"
               "      3 | \n"
               " >    4 | # copy < entry")
  
  assert error.snippet == snippet
  
  selection = [[3,0], [3,14]]
  
  assert error.selection == selection