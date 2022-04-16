import enolib

def test_querying_all_attributes_from_a_field_produces_the_expected_result():
    input = ("field:\n"
             "1 = 1\n"
             "2 = 2")
    
    output = [attribute.required_string_value() for attribute in enolib.parse(input).field('field').attributes()]
    
    assert output == ['1', '2']

def test_querying_attributes_from_a_field_by_key_produces_the_expected_result():
    input = ("field:\n"
             "attribute = value\n"
             "other = one\n"
             "other = two")
    
    output = [attribute.required_string_value() for attribute in enolib.parse(input).field('field').attributes('other')]
    
    assert output == ['one', 'two']