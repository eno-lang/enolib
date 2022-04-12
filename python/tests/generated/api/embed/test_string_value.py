import enolib

def test_querying_an_existing_required_string_value_from_an_embed_produces_the_expected_result():
    input = ("-- embed\n"
             "value\n"
             "-- embed")
    
    output = enolib.parse(input).embed('embed').required_string_value()
    
    expected = ("value")
    
    assert output == expected

def test_querying_an_existing_optional_string_value_from_an_embed_produces_the_expected_result():
    input = ("-- embed\n"
             "value\n"
             "-- embed")
    
    output = enolib.parse(input).embed('embed').optional_string_value()
    
    expected = ("value")
    
    assert output == expected

def test_querying_a_missing_optional_string_value_from_an_embed_produces_the_expected_result():
    input = ("-- embed\n"
             "-- embed")
    
    output = enolib.parse(input).embed('embed').optional_string_value()
    
    assert output == None