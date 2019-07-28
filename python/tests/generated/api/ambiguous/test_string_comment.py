import enolib

def test_querying_an_existing_single_line_required_string_comment_from_an_ambiguous_element_produces_the_expected_result():
    input = ("> comment\n"
             "ambiguous:")

    output = enolib.parse(input).element('ambiguous').required_string_comment()

    expected = ("comment")
    
    assert output == expected

def test_querying_an_existing_two_line_required_string_comment_from_an_ambiguous_element_produces_the_expected_result():
    input = (">comment\n"
             ">  comment\n"
             "ambiguous:")

    output = enolib.parse(input).element('ambiguous').required_string_comment()

    expected = ("comment\n"
                "  comment")
    
    assert output == expected

def test_querying_an_existing_required_string_comment_with_blank_lines_from_an_ambiguous_element_produces_the_expected_result():
    input = (">\n"
             ">     comment\n"
             ">\n"
             ">   comment\n"
             ">\n"
             "> comment\n"
             ">\n"
             "ambiguous:")

    output = enolib.parse(input).element('ambiguous').required_string_comment()

    expected = ("    comment\n"
                "\n"
                "  comment\n"
                "\n"
                "comment")
    
    assert output == expected

def test_querying_an_optional_existing_string_comment_from_an_ambiguous_element_produces_the_expected_result():
    input = ("> comment\n"
             "ambiguous:")

    output = enolib.parse(input).element('ambiguous').optional_string_comment()

    expected = ("comment")
    
    assert output == expected

def test_querying_an_optional_missing_string_comment_from_an_ambiguous_element_produces_the_expected_result():
    input = ("ambiguous:")

    output = enolib.parse(input).element('ambiguous').optional_string_comment()

    assert output == None