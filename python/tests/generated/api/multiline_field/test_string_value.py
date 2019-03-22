import enolib

def test_querying_an_existing_required_string_value_from_a_multline_field_produces_the_expected_result():
  input = ("-- multiline_field\n"
           "value\n"
           "-- multiline_field")

  output = enolib.parse(input).field('multiline_field').required_string_value()

  expected = ("value")
  
  assert output == expected

def test_querying_an_existing_optional_string_value_from_a_multline_field_produces_the_expected_result():
  input = ("-- multiline_field\n"
           "value\n"
           "-- multiline_field")

  output = enolib.parse(input).field('multiline_field').optional_string_value()

  expected = ("value")
  
  assert output == expected

def test_querying_a_missing_optional_string_value_from_a_multline_field_produces_the_expected_result():
  input = ("-- multiline_field\n"
           "-- multiline_field")

  output = enolib.parse(input).field('multiline_field').optional_string_value()

  assert output == None