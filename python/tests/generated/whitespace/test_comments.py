import enolib

def test_querying_a_comment_with_complex_indentation_from_a_section_produces_the_expected_result():
    input = ("               >\n"
             "    > indented 0 spaces\n"
             ">\n"
             "  >       indented 4 spaces \n"
             ">       indented 2 spaces\n"
             "                              > indented 26 spaces\n"
             "                                 >\n"
             "# section")

    output = enolib.parse(input).section('section').required_string_comment()

    expected = ("indented 0 spaces\n"
                "\n"
                "    indented 4 spaces\n"
                "  indented 2 spaces\n"
                "                          indented 26 spaces")
    
    assert output == expected