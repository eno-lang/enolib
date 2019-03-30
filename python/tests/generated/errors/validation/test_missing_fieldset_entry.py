import enolib

def test_querying_an_empty_fieldset_for_a_required_but_missing_entry_raises_the_expected_validationerror():
  error = None

  input = ("fieldset:")

  try:
    enolib.parse(input).fieldset('fieldset').required_entry('entry')
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("The fieldset entry 'entry' is missing - in case it has been specified look for typos and also check for correct capitalization.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " *    1 | fieldset:")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 0
  assert error.selection['from']['column'] == 9
  assert error.selection['to']['line'] == 0
  assert error.selection['to']['column'] == 9

def test_querying_a_fieldset_with_two_entries_for_a_required_but_missing_entry_raises_the_expected_validationerror():
  error = None

  input = ("fieldset:\n"
           "entry = value\n"
           "entry = value")

  try:
    enolib.parse(input).fieldset('fieldset').required_entry('missing')
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("The fieldset entry 'missing' is missing - in case it has been specified look for typos and also check for correct capitalization.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " *    1 | fieldset:\n"
               " ?    2 | entry = value\n"
               " ?    3 | entry = value")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 0
  assert error.selection['from']['column'] == 9
  assert error.selection['to']['line'] == 0
  assert error.selection['to']['column'] == 9

def test_querying_a_fieldset_with_entries_empty_lines_and_comments_for_a_required_but_missing_entry_raises_the_expected_validationerror():
  error = None

  input = ("fieldset:\n"
           "\n"
           "> comment\n"
           "entry = value\n"
           "\n"
           "> comment\n"
           "entry = value")

  try:
    enolib.parse(input).fieldset('fieldset').required_entry('missing')
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("The fieldset entry 'missing' is missing - in case it has been specified look for typos and also check for correct capitalization.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " *    1 | fieldset:\n"
               " ?    2 | \n"
               " ?    3 | > comment\n"
               " ?    4 | entry = value\n"
               " ?    5 | \n"
               " ?    6 | > comment\n"
               " ?    7 | entry = value")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 0
  assert error.selection['from']['column'] == 9
  assert error.selection['to']['line'] == 0
  assert error.selection['to']['column'] == 9