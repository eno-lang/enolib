import enolib

def test_asserting_everything_was_touched_on_an_untouched_document_raises_the_expected_validationerror():
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
  
  selection = [[0,0], [0,12]]
  
  assert error.selection == selection

def test_asserting_everything_was_touched_on_an_untouched_document_with_a_custom_message_raises_the_expected_validationerror():
  error = None

  input = ("field: value")

  try:
    enolib.parse(input).assert_all_touched('my custom message')
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("my custom message")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | field: value")
  
  assert error.snippet == snippet
  
  selection = [[0,0], [0,12]]
  
  assert error.selection == selection