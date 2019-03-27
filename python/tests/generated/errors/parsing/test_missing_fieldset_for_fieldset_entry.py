import enolib

def test_parsing_a_fieldset_entry_without_a_fieldset_raises_the_expected_parseerror():
  error = None

  input = ("entry = value")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("Line 1 contains a fieldset entry without a fieldset being specified before.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | entry = value")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 0
  assert error.selection['from']['column'] == 0
  assert error.selection['to']['line'] == 0
  assert error.selection['to']['column'] == 13

def test_parsing_a_fieldset_entry_preceded_by_a_line_continuation_raises_the_expected_parseerror():
  error = None

  input = ("field:\n"
           "| line_continuation\n"
           "entry = value")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("Line 3 contains a fieldset entry without a fieldset being specified before.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "      1 | field:\n"
               "      2 | | line_continuation\n"
               " >    3 | entry = value")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 2
  assert error.selection['from']['column'] == 0
  assert error.selection['to']['line'] == 2
  assert error.selection['to']['column'] == 13

def test_parsing_a_fieldset_entry_preceded_by_a_field_raises_the_expected_parseerror():
  error = None

  input = ("field: value\n"
           "entry = value")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("Line 2 contains a fieldset entry without a fieldset being specified before.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "      1 | field: value\n"
               " >    2 | entry = value")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 1
  assert error.selection['from']['column'] == 0
  assert error.selection['to']['line'] == 1
  assert error.selection['to']['column'] == 13

def test_parsing_a_fieldset_entry_preceded_by_a_list_item_raises_the_expected_parseerror():
  error = None

  input = ("list:\n"
           "- item\n"
           "entry = value")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("Line 3 contains a fieldset entry without a fieldset being specified before.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "      1 | list:\n"
               "      2 | - item\n"
               " >    3 | entry = value")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 2
  assert error.selection['from']['column'] == 0
  assert error.selection['to']['line'] == 2
  assert error.selection['to']['column'] == 13

def test_parsing_a_fieldset_entry_preceded_by_a_copied_field_raises_the_expected_parseerror():
  error = None

  input = ("field: value\n"
           "\n"
           "copy < field\n"
           "entry = value")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("Line 4 contains a fieldset entry without a fieldset being specified before.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "   ...\n"
               "      2 | \n"
               "      3 | copy < field\n"
               " >    4 | entry = value")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 3
  assert error.selection['from']['column'] == 0
  assert error.selection['to']['line'] == 3
  assert error.selection['to']['column'] == 13

def test_parsing_a_fieldset_entry_preceded_by_a_copied_list_raises_the_expected_parseerror():
  error = None

  input = ("list:\n"
           "- item\n"
           "\n"
           "copy < list\n"
           "entry = value")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("Line 5 contains a fieldset entry without a fieldset being specified before.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "   ...\n"
               "      3 | \n"
               "      4 | copy < list\n"
               " >    5 | entry = value")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 4
  assert error.selection['from']['column'] == 0
  assert error.selection['to']['line'] == 4
  assert error.selection['to']['column'] == 13

def test_parsing_a_fieldset_entry_preceded_by_a_copied_empty_multiline_field_raises_the_expected_parseerror():
  error = None

  input = ("-- multiline field\n"
           "-- multiline field\n"
           "\n"
           "copy < multiline field\n"
           "entry = value")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("Line 5 contains a fieldset entry without a fieldset being specified before.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "   ...\n"
               "      3 | \n"
               "      4 | copy < multiline field\n"
               " >    5 | entry = value")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 4
  assert error.selection['from']['column'] == 0
  assert error.selection['to']['line'] == 4
  assert error.selection['to']['column'] == 13

def test_parsing_a_fieldset_entry_preceded_by_a_copied_multiline_field_raises_the_expected_parseerror():
  error = None

  input = ("-- multiline field\n"
           "value\n"
           "-- multiline field\n"
           "\n"
           "copy < multiline field\n"
           "entry = value")

  try:
    enolib.parse(input)
  except enolib.ParseError as _error:
    if isinstance(_error, enolib.ParseError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ParseError
  
  text = ("Line 6 contains a fieldset entry without a fieldset being specified before.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "   ...\n"
               "      4 | \n"
               "      5 | copy < multiline field\n"
               " >    6 | entry = value")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 5
  assert error.selection['from']['column'] == 0
  assert error.selection['to']['line'] == 5
  assert error.selection['to']['column'] == 13