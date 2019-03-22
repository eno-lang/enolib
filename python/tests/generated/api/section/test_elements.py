import enolib

def test_querying_all_elements_from_a_section_produces_the_expected_result():
  input = ("# section\n"
           "one: value\n"
           "two: value")

  output = [element.string_key() for element in enolib.parse(input).section('section').elements()]

  assert output == ['one', 'two']

def test_querying_elements_from_a_section_by_key_produces_the_expected_result():
  input = ("# section\n"
           "field: value\n"
           "other: one\n"
           "other: two")

  output = [element.required_string_value() for element in enolib.parse(input).section('section').elements('other')]

  assert output == ['one', 'two']