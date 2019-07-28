# frozen_string_literal: true

describe 'Querying an existing, single-line, required string comment from an empty' do
  it 'produces the expected result' do
    input = "> comment\n" \
            'empty'

    output = Enolib.parse(input).empty('empty').required_string_comment

    expected = 'comment'
    
    expect(output).to eq(expected)
  end
end

describe 'Querying an existing, two-line, required string comment from an empty' do
  it 'produces the expected result' do
    input = ">comment\n" \
            ">  comment\n" \
            'empty'

    output = Enolib.parse(input).empty('empty').required_string_comment

    expected = "comment\n" \
               '  comment'
    
    expect(output).to eq(expected)
  end
end

describe 'Querying an existing, required string comment with blank lines from an empty' do
  it 'produces the expected result' do
    input = ">\n" \
            ">     comment\n" \
            ">\n" \
            ">   comment\n" \
            ">\n" \
            "> comment\n" \
            ">\n" \
            'empty'

    output = Enolib.parse(input).empty('empty').required_string_comment

    expected = "    comment\n" \
               "\n" \
               "  comment\n" \
               "\n" \
               'comment'
    
    expect(output).to eq(expected)
  end
end

describe 'Querying an optional, existing string comment from an empty' do
  it 'produces the expected result' do
    input = "> comment\n" \
            'empty'

    output = Enolib.parse(input).empty('empty').optional_string_comment

    expected = 'comment'
    
    expect(output).to eq(expected)
  end
end

describe 'Querying an optional, missing string comment from an empty' do
  it 'produces the expected result' do
    input = 'empty'

    output = Enolib.parse(input).empty('empty').optional_string_comment

    expect(output).to be_nil
  end
end