import enolib

def test_asserting_everything_was_touched_when_the_only_present_multiline_field_was_not_touched_raises_the_expected_validationerror():
  error = None

  input = ("-- multiline_field\n"
           "value\n"
           "-- multiline_field")

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
               " >    1 | -- multiline_field\n"
               " *    2 | value\n"
               " *    3 | -- multiline_field")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 0
  assert error.selection['from']['column'] == 0
  assert error.selection['to']['line'] == 2
  assert error.selection['to']['column'] == 18

def test_asserting_everything_was_touched_when_the_only_present_multiline_field_was_touched_produces_the_expected_result():
  input = ("-- multiline_field\n"
           "value\n"
           "-- multiline_field")

  document = enolib.parse(input)
  
  document.field('multiline_field').touch()
  document.assert_all_touched()

  assert bool('it passes') is True