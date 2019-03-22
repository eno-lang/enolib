import enolib

def test_querying_all_entries_from_a_fieldset_produces_the_expected_result():
  input = ("fieldset:\n"
           "1 = 1\n"
           "2 = 2")

  output = [entry.required_string_value() for entry in enolib.parse(input).fieldset('fieldset').entries()]

  assert output == ['1', '2']

def test_querying_entries_from_a_fieldset_by_key_produces_the_expected_result():
  input = ("fieldset:\n"
           "entry = value\n"
           "other = one\n"
           "other = two")

  output = [entry.required_string_value() for entry in enolib.parse(input).fieldset('fieldset').entries('other')]

  assert output == ['one', 'two']