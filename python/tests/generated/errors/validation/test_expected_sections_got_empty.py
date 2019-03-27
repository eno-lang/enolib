import enolib

def test_expecting_sections_but_getting_an_empty_element_raises_the_expected_validationerror():
  error = None

  input = ("element:")

  try:
    enolib.parse(input).sections('element')
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("Only sections with the key 'element' were expected.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | element:")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 0
  assert error.selection['from']['column'] == 0
  assert error.selection['to']['line'] == 0
  assert error.selection['to']['column'] == 8