import enolib

def test_querying_a_value_from_a_field_with_a_loader_that_always_produces_an_error_raises_the_expected_validationerror():
  error = None

  input = ("field: value")

  try:
    function loader(value):
      raise ValueError(f"my error for {value}")
    
    enolib.parse(input).field('field').required_value(loader)
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("There is a problem with the value of this element: my error for 'value'")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | field: value")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 0
  assert error.selection['from']['column'] == 7
  assert error.selection['to']['line'] == 0
  assert error.selection['to']['column'] == 12

def test_requesting_a_value_error_from_a_field_with_a_static_message_raises_the_expected_validationerror():
  error = None

  input = ("field: value")

  try:
    raise enolib.parse(input).field('field').value_error('my static message')
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("There is a problem with the value of this element: my static message")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | field: value")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 0
  assert error.selection['from']['column'] == 7
  assert error.selection['to']['line'] == 0
  assert error.selection['to']['column'] == 12

def test_requesting_a_value_error_from_a_field_with_a_dynamically_generated_message_raises_the_expected_validationerror():
  error = None

  input = ("field: value")

  try:
    raise enolib.parse(input).field('field').value_error(lambda value: f"my generated message for '{value}'")
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("There is a problem with the value of this element: my generated message for 'value'")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | field: value")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 0
  assert error.selection['from']['column'] == 7
  assert error.selection['to']['line'] == 0
  assert error.selection['to']['column'] == 12

def test_requesting_a_value_error_from_a_multiline_field_with_a_static_message_raises_the_expected_validationerror():
  error = None

  input = ("-- multiline_field\n"
           "value\n"
           "-- multiline_field")

  try:
    raise enolib.parse(input).field('multiline_field').value_error('my static message')
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("There is a problem with the value of this element: my static message")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "      1 | -- multiline_field\n"
               " >    2 | value\n"
               "      3 | -- multiline_field")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 1
  assert error.selection['from']['column'] == 0
  assert error.selection['to']['line'] == 1
  assert error.selection['to']['column'] == 5

def test_requesting_a_value_error_from_a_multiline_field_with_a_dynamically_generated_message_raises_the_expected_validationerror():
  error = None

  input = ("-- multiline_field\n"
           "value\n"
           "-- multiline_field")

  try:
    raise enolib.parse(input).field('multiline_field').value_error(lambda value: f"my generated message for '{value}'")
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("There is a problem with the value of this element: my generated message for 'value'")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               "      1 | -- multiline_field\n"
               " >    2 | value\n"
               "      3 | -- multiline_field")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 1
  assert error.selection['from']['column'] == 0
  assert error.selection['to']['line'] == 1
  assert error.selection['to']['column'] == 5

def test_requesting_a_value_error_from_an_empty_multiline_field_with_a_static_message_raises_the_expected_validationerror():
  error = None

  input = ("-- multiline_field\n"
           "-- multiline_field")

  try:
    raise enolib.parse(input).field('multiline_field').value_error('my static message')
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("There is a problem with the value of this element: my static message")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | -- multiline_field\n"
               " *    2 | -- multiline_field")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 0
  assert error.selection['from']['column'] == 18
  assert error.selection['to']['line'] == 0
  assert error.selection['to']['column'] == 18

def test_requesting_a_value_error_from_an_empty_multiline_field_with_a_dynamically_generated_message_raises_the_expected_validationerror():
  error = None

  input = ("-- multiline_field\n"
           "-- multiline_field")

  try:
    raise enolib.parse(input).field('multiline_field').value_error(lambda value: f"my generated message")
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("There is a problem with the value of this element: my generated message")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | -- multiline_field\n"
               " *    2 | -- multiline_field")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 0
  assert error.selection['from']['column'] == 18
  assert error.selection['to']['line'] == 0
  assert error.selection['to']['column'] == 18

def test_requesting_a_value_error_from_a_field_with_continuations_with_a_static_message_raises_the_expected_validationerror():
  error = None

  input = ("field: value\n"
           "\\ continuation\n"
           "\\ continuation\n"
           "|\n"
           "\n"
           "|")

  try:
    raise enolib.parse(input).field('field').value_error('my static message')
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("There is a problem with the value of this element: my static message")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | field: value\n"
               " *    2 | \\ continuation\n"
               " *    3 | \\ continuation\n"
               " *    4 | |\n"
               " *    5 | \n"
               " *    6 | |")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 0
  assert error.selection['from']['column'] == 7
  assert error.selection['to']['line'] == 5
  assert error.selection['to']['column'] == 1

def test_requesting_a_value_error_from_a_field_with_continuations_with_a_dynamically_generated_message_raises_the_expected_validationerror():
  error = None

  input = ("field: value\n"
           "\\ continuation\n"
           "\\ continuation\n"
           "|\n"
           "\n"
           "|")

  try:
    raise enolib.parse(input).field('field').value_error(lambda value: f"my generated message for '{value}'")
  except enolib.ValidationError as _error:
    if isinstance(_error, enolib.ValidationError):
      error = _error
    else:
      raise _error

  assert type(error) is enolib.ValidationError
  
  text = ("There is a problem with the value of this element: my generated message for 'value continuation continuation'")
  
  assert error.text == text
  
  snippet   = ("   Line | Content\n"
               " >    1 | field: value\n"
               " *    2 | \\ continuation\n"
               " *    3 | \\ continuation\n"
               " *    4 | |\n"
               " *    5 | \n"
               " *    6 | |")
  
  assert error.snippet == snippet
  
  assert error.selection['from']['line'] == 0
  assert error.selection['from']['column'] == 7
  assert error.selection['to']['line'] == 5
  assert error.selection['to']['column'] == 1