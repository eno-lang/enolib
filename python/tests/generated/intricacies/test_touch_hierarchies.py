import enolib

def test_touching_elements_in_a_section_that_were_copied_from_another_section_does_not_touch_the_original_elements_raises_the_expected_validationerror():
  error = None

  input = ("# section\n"
           "field: value\n"
           "\n"
           "# copy < section")

  try:
    document = enolib.parse(input)
    
    document.section('section').string_key()
    document.section('copy').field('field').string_key()
    
    document.assert_all_touched()
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("This element was not expected, make sure it is at the right place in the document and that its key is not mis-typed.")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "      1 | # section\n"
               " >    2 | field: value\n"
               "      3 | \n"
               "      4 | # copy < section")
  
  assert error.snippet == snippet
  
  selection = [[1,0], [1,12]]
  
  assert error.selection == selection