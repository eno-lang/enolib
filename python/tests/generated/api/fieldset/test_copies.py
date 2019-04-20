import enolib

def test_querying_four_entries_from_a_fieldset_all_of_them_copied_from_another_fieldset_produces_the_expected_result():
    input = ("fieldset:\n"
             "1 = 1\n"
             "2 = 2\n"
             "3 = 3\n"
             "4 = 4\n"
             "\n"
             "copy < fieldset")

    output = [entry.required_string_value() for entry in enolib.parse(input).fieldset('copy').entries()]

    assert output == ['1', '2', '3', '4']

def test_querying_four_entries_from_a_fieldset_two_of_them_copied_from_another_fieldset_produces_the_expected_result():
    input = ("fieldset:\n"
             "1 = 1\n"
             "2 = 2\n"
             "\n"
             "copy < fieldset\n"
             "3 = 3\n"
             "4 = 4")

    output = [entry.required_string_value() for entry in enolib.parse(input).fieldset('copy').entries()]

    assert output == ['1', '2', '3', '4']

def test_querying_three_entries_from_a_fieldset_one_owned_one_replaced_one_copied_produces_the_expected_result():
    input = ("fieldset:\n"
             "1 = 1\n"
             "2 = 0\n"
             "\n"
             "copy < fieldset\n"
             "2 = 2\n"
             "3 = 3")

    output = [entry.required_string_value() for entry in enolib.parse(input).fieldset('copy').entries()]

    assert output == ['1', '2', '3']