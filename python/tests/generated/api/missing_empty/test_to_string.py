import enolib

def test_a_missing_empty_queried_without_a_key_leaves_out_the_key_in_the_debug_string_representation_produces_the_expected_result():
    input = ("")

    output = repr(enolib.parse(input).empty())

    assert output == '<class MissingEmpty>'

def test_a_missing_empty_queried_with_a_key_includes_the_key_in_the_debug_string_representation_produces_the_expected_result():
    input = ("")

    output = repr(enolib.parse(input).empty('key'))

    assert output == '<class MissingEmpty key=key>'