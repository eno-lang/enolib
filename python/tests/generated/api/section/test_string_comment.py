import enolib

def test_querying_an_existing_single_line_required_string_comment_from_a_section_produces_the_expected_result():
    input = ("> comment\n"
             "# section")

    output = enolib.parse(input).section('section').required_string_comment()

    expected = ("comment")
    
    assert output == expected

def test_querying_an_existing_two_line_required_string_comment_from_a_section_produces_the_expected_result():
    input = (">comment\n"
             ">  comment\n"
             "# section")

    output = enolib.parse(input).section('section').required_string_comment()

    expected = ("comment\n"
                "  comment")
    
    assert output == expected

def test_querying_an_existing_required_string_comment_with_blank_lines_from_a_section_produces_the_expected_result():
    input = (">\n"
             ">     comment\n"
             ">\n"
             ">   comment\n"
             ">\n"
             "> comment\n"
             ">\n"
             "# section")

    output = enolib.parse(input).section('section').required_string_comment()

    expected = ("    comment\n"
                "\n"
                "  comment\n"
                "\n"
                "comment")
    
    assert output == expected

def test_querying_an_optional_existing_string_comment_from_a_section_produces_the_expected_result():
    input = ("> comment\n"
             "# section")

    output = enolib.parse(input).section('section').optional_string_comment()

    expected = ("comment")
    
    assert output == expected

def test_querying_an_optional_missing_string_comment_from_a_section_produces_the_expected_result():
    input = ("# section")

    output = enolib.parse(input).section('section').optional_string_comment()

    assert output == None