# frozen_string_literal: true

describe 'Querying a comment with complex indentation from a section' do
  it 'produces the expected result' do
    input = "               >\n" +
            "    > indented 0 spaces\n" +
            ">\n" +
            "  >       indented 4 spaces \n" +
            ">       indented 2 spaces\n" +
            "                              > indented 26 spaces\n" +
            "                                 >\n" +
            "# section"

    output = Enolib.parse(input).section('section').required_string_comment

    expected = "indented 0 spaces\n" +
               "\n" +
               "    indented 4 spaces\n" +
               "  indented 2 spaces\n" +
               "                          indented 26 spaces"
    
    expect(output).to eq(expected)
  end
end