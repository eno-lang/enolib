import enolib

def test_querying_existing_required_string_values_from_a_list_produces_the_expected_result():
  input = ("list:\n"
           "- item\n"
           "- item")

  output = enolib.parse(input).list('list').required_string_values()

  assert output == ['item', 'item']

def test_querying_existing_optional_string_values_from_a_list_produces_the_expected_result():
  input = ("list:\n"
           "- item\n"
           "- item")

  output = enolib.parse(input).list('list').optional_string_values()

  assert output == ['item', 'item']

def test_querying_missing_optional_string_values_from_a_list_produces_the_expected_result():
  input = ("list:\n"
           "-\n"
           "-")

  output = enolib.parse(input).list('list').optional_string_values()

  assert output == [None, None]