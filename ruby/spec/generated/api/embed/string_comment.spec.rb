# frozen_string_literal: true

describe 'Querying an existing, single-line, required string comment from an embed' do
  it 'produces the expected result' do
    input = "> comment\n" \
            "-- embed\n" \
            "value\n" \
            '-- embed'
    
    output = Enolib.parse(input).embed('embed').required_string_comment
    
    expected = 'comment'
    
    expect(output).to eq(expected)
  end
end

describe 'Querying an existing, two-line, required string comment from an embed' do
  it 'produces the expected result' do
    input = ">comment\n" \
            ">  comment\n" \
            "-- embed\n" \
            "value\n" \
            '-- embed'
    
    output = Enolib.parse(input).embed('embed').required_string_comment
    
    expected = "comment\n" \
               '  comment'
    
    expect(output).to eq(expected)
  end
end

describe 'Querying an existing, required string comment with blank lines from an embed' do
  it 'produces the expected result' do
    input = ">\n" \
            ">     comment\n" \
            ">\n" \
            ">   comment\n" \
            ">\n" \
            "> comment\n" \
            ">\n" \
            "-- embed\n" \
            "value\n" \
            '-- embed'
    
    output = Enolib.parse(input).embed('embed').required_string_comment
    
    expected = "    comment\n" \
               "\n" \
               "  comment\n" \
               "\n" \
               'comment'
    
    expect(output).to eq(expected)
  end
end

describe 'Querying an optional, existing string comment from an embed' do
  it 'produces the expected result' do
    input = "> comment\n" \
            "-- embed\n" \
            "value\n" \
            '-- embed'
    
    output = Enolib.parse(input).embed('embed').optional_string_comment
    
    expected = 'comment'
    
    expect(output).to eq(expected)
  end
end

describe 'Querying an optional, missing string comment from an embed' do
  it 'produces the expected result' do
    input = "-- embed\n" \
            "value\n" \
            '-- embed'
    
    output = Enolib.parse(input).embed('embed').optional_string_comment
    
    expect(output).to be_nil
  end
end