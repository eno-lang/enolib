import enolib

def test_a_missing_flag_queried_without_a_key_leaves_out_the_key_in_the_debug_string_representation_produces_the_expected_result():
    input = ("")
    
    output = repr(enolib.parse(input).flag())
    
    assert output == '<class MissingFlag>'

def test_a_missing_flag_queried_with_a_key_includes_the_key_in_the_debug_string_representation_produces_the_expected_result():
    input = ("")
    
    output = repr(enolib.parse(input).flag('key'))
    
    assert output == '<class MissingFlag key=key>'