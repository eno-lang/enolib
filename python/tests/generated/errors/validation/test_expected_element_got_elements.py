import enolib

def test_expecting_an_element_but_getting_two_elements_raises_the_expected_validationerror():
  error = None

  input = ("element:\n"
           "element:")

  try:
    enolib.parse(input).element('element')
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("Only a single element with the key 'element' was expected.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | element:\n"
               " >    2 | element:")
  
  assert error.snippet == snippet
  
  selection = [[0,0], [0,8]]
  
  assert error.selection == selection

def test_expecting_an_element_but_getting_two_elements_with_comments_and_empty_lines_raises_the_expected_validationerror():
  error = None

  input = ("> comment\n"
           "element:\n"
           "\n"
           "> comment\n"
           "element:")

  try:
    enolib.parse(input).element('element')
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("Only a single element with the key 'element' was expected.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "      1 | > comment\n"
               " >    2 | element:\n"
               "      3 | \n"
               "      4 | > comment\n"
               " >    5 | element:")
  
  assert error.snippet == snippet
  
  selection = [[1,0], [1,8]]
  
  assert error.selection == selection