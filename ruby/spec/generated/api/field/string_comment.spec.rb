describe 'Querying an existing, single-line, required string comment from a field' do
  it 'produces the expected result' do
    input = "> comment\n" +
            "field: value"

    output = Enolib.parse(input).field('field').required_string_comment

    expected = "comment"
    
    expect(output).to eq(expected)
  end
end

describe 'Querying an existing, two-line, required string comment from a field' do
  it 'produces the expected result' do
    input = ">comment\n" +
            ">  comment\n" +
            "field: value"

    output = Enolib.parse(input).field('field').required_string_comment

    expected = "comment\n" +
               "  comment"
    
    expect(output).to eq(expected)
  end
end

describe 'Querying an existing, required string comment with blank lines from a field' do
  it 'produces the expected result' do
    input = ">\n" +
            ">      comment\n" +
            ">\n" +
            ">    comment\n" +
            ">\n" +
            ">  comment\n" +
            ">\n" +
            "field: value"

    output = Enolib.parse(input).field('field').required_string_comment

    expected = "    comment\n" +
               "\n" +
               "  comment\n" +
               "\n" +
               "comment"
    
    expect(output).to eq(expected)
  end
end

describe 'Querying an optional, existing string comment from a field' do
  it 'produces the expected result' do
    input = "> comment\n" +
            "field: value"

    output = Enolib.parse(input).field('field').optional_string_comment

    expected = "comment"
    
    expect(output).to eq(expected)
  end
end

describe 'Querying an optional, missing string comment from a field' do
  it 'produces the expected result' do
    input = "field: value"

    output = Enolib.parse(input).field('field').optional_string_comment

    expect(output).to be_nil
  end
end