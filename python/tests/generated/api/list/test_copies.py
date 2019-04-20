import enolib

def test_querying_four_items_from_a_list_all_of_them_copied_from_another_list_produces_the_expected_result():
    input = ("list:\n"
             "- 1\n"
             "- 2\n"
             "- 3\n"
             "- 4\n"
             "\n"
             "copy < list")

    output = enolib.parse(input).list('copy').required_string_values()

    assert output == ['1', '2', '3', '4']

def test_querying_four_items_from_a_list_two_of_them_copied_from_another_list_produces_the_expected_result():
    input = ("list:\n"
             "- 1\n"
             "- 2\n"
             "\n"
             "copy < list\n"
             "- 3\n"
             "- 4")

    output = enolib.parse(input).list('copy').required_string_values()

    assert output == ['1', '2', '3', '4']