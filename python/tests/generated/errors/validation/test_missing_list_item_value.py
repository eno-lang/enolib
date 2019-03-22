import enolib

def test_directly_querying_a_list_item_for_a_required_but_missing_value_raises_the_expected_validationerror():
  error = None

  input = ("list:\n"
           "-")

  try:
    enolib.parse(input).list('list').items()[0].required_string_value()
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("The list 'list' may not contain empty items.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "      1 | list:\n"
               " >    2 | -")
  
  assert error.snippet == snippet
  
  selection = [[1,1], [1,1]]
  
  assert error.selection == selection

def test_indirectly_querying_a_list_with_empty_items_for_required_values_raises_the_expected_validationerror():
  error = None

  input = ("list:\n"
           "-")

  try:
    enolib.parse(input).list('list').required_string_values()
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("The list 'list' may not contain empty items.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "      1 | list:\n"
               " >    2 | -")
  
  assert error.snippet == snippet
  
  selection = [[1,1], [1,1]]
  
  assert error.selection == selection