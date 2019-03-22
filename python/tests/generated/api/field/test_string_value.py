import enolib

def test_querying_an_existing_required_string_value_from_a_field_produces_the_expected_result():
  input = ("field: value")

  output = enolib.parse(input).field('field').required_string_value()

  expected = ("value")
  
  assert output == expected

def test_querying_an_existing_optional_string_value_from_a_field_produces_the_expected_result():
  input = ("field: value")

  output = enolib.parse(input).field('field').optional_string_value()

  expected = ("value")
  
  assert output == expected

def test_querying_a_missing_optional_string_value_from_a_field_produces_the_expected_result():
  input = ("field:")

  output = enolib.parse(input).field('field').optional_string_value()

  assert output == None