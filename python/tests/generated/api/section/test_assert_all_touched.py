import enolib

def test_asserting_everything_was_touched_on_an_empty_document_produces_the_expected_result():
  input = ("")

  enolib.parse(input).assert_all_touched()

  assert bool('it passes') is True

def test_asserting_everything_was_touched_on_an_untouched_document_containing_a_single_field_raises_the_expected_validationerror():
  error = None

  input = ("field: value")

  try:
    enolib.parse(input).assert_all_touched()
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("This element was not expected, make sure it is at the right place in the document and that its key is not mis-typed.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | field: value")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 0
  assert error.selection['from']['column'] == 0
  assert error.selection['to']['line'] == 0
  assert error.selection['to']['column'] == 12

def test_asserting_everything_was_touched_on_an_untouched_document_containing_a_single_field_with_a_custom_message_raises_the_expected_validationerror():
  error = None

  input = ("field: value")

  try:
    enolib.parse(input).assert_all_touched('my message')
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("my message")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | field: value")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 0
  assert error.selection['from']['column'] == 0
  assert error.selection['to']['line'] == 0
  assert error.selection['to']['column'] == 12

def test_asserting_everything_was_touched_on_an_untouched_document_containing_a_single_field_with_a_custom_message_function_raises_the_expected_validationerror():
  error = None

  input = ("field: value")

  try:
    enolib.parse(input).assert_all_touched(lambda element: f"my generated message for unexpected element '{element.string_key()}'")
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("my generated message for unexpected element 'field'")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | field: value")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 0
  assert error.selection['from']['column'] == 0
  assert error.selection['to']['line'] == 0
  assert error.selection['to']['column'] == 12