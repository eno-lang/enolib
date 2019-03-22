import enolib

def test_parsing_a_list_item_without_any_previous_element_raises_the_expected_parseerror():
  error = None

  input = ("- item")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("Line 1 contains a list item without a list being specified before.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | - item")
  
  assert error.snippet == snippet
  
  selection = [[0,0], [0,6]]
  
  assert error.selection == selection

def test_parsing_a_list_item_preceded_by_a_line_continuation_raises_the_expected_parseerror():
  error = None

  input = ("field:\n"
           "| continuation\n"
           "- item")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("Line 3 contains a list item without a list being specified before.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "      1 | field:\n"
               "      2 | | continuation\n"
               " >    3 | - item")
  
  assert error.snippet == snippet
  
  selection = [[2,0], [2,6]]
  
  assert error.selection == selection

def test_parsing_a_list_item_preceded_by_a_fieldset_entry_raises_the_expected_parseerror():
  error = None

  input = ("fieldset:\n"
           "entry = value\n"
           "- item")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("Line 3 contains a list item without a list being specified before.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "      1 | fieldset:\n"
               "      2 | entry = value\n"
               " >    3 | - item")
  
  assert error.snippet == snippet
  
  selection = [[2,0], [2,6]]
  
  assert error.selection == selection

def test_parsing_a_list_item_preceded_by_a_copied_field_raises_the_expected_parseerror():
  error = None

  input = ("field: value\n"
           "\n"
           "copy < field\n"
           "- item")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("Line 4 contains a list item without a list being specified before.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "   ...\n"
               "      2 | \n"
               "      3 | copy < field\n"
               " >    4 | - item")
  
  assert error.snippet == snippet
  
  selection = [[3,0], [3,6]]
  
  assert error.selection == selection

def test_parsing_a_list_item_preceded_by_a_copied_fieldset_raises_the_expected_parseerror():
  error = None

  input = ("fieldset:\n"
           "entry = value\n"
           "\n"
           "copy < fieldset\n"
           "- item")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("Line 5 contains a list item without a list being specified before.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "   ...\n"
               "      3 | \n"
               "      4 | copy < fieldset\n"
               " >    5 | - item")
  
  assert error.snippet == snippet
  
  selection = [[4,0], [4,6]]
  
  assert error.selection == selection

def test_parsing_a_list_item_preceded_by_a_multiline_field_raises_the_expected_parseerror():
  error = None

  input = ("-- multiline_field\n"
           "value\n"
           "-- multiline_field\n"
           "\n"
           "copy < multiline_field\n"
           "- item")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("Line 6 contains a list item without a list being specified before.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "   ...\n"
               "      4 | \n"
               "      5 | copy < multiline_field\n"
               " >    6 | - item")
  
  assert error.snippet == snippet
  
  selection = [[5,0], [5,6]]
  
  assert error.selection == selection

def test_parsing_a_list_item_preceded_by_an_empty_multiline_field_raises_the_expected_parseerror():
  error = None

  input = ("-- multiline_field\n"
           "-- multiline_field\n"
           "\n"
           "copy < multiline_field\n"
           "- item")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("Line 5 contains a list item without a list being specified before.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "   ...\n"
               "      3 | \n"
               "      4 | copy < multiline_field\n"
               " >    5 | - item")
  
  assert error.snippet == snippet
  
  selection = [[4,0], [4,6]]
  
  assert error.selection == selection