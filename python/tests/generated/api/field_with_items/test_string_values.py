import enolib

def test_querying_existing_required_string_values_from_a_field_with_items_produces_the_expected_result():
    input = ("field:\n"
             "- item\n"
             "- item")
    
    output = enolib.parse(input).field('field').required_string_values()
    
    assert output == ['item', 'item']

def test_querying_existing_optional_string_values_from_a_field_with_items_produces_the_expected_result():
    input = ("field:\n"
             "- item\n"
             "- item")
    
    output = enolib.parse(input).field('field').optional_string_values()
    
    assert output == ['item', 'item']

def test_querying_missing_optional_string_values_from_a_field_with_items_produces_the_expected_result():
    input = ("field:\n"
             "-\n"
             "-")
    
    output = enolib.parse(input).field('field').optional_string_values()
    
    assert output == [None, None]