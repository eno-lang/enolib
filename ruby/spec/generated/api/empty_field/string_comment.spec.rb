# frozen_string_literal: true

describe 'Querying an existing, single-line, required string comment from an empty field' do
  it 'produces the expected result' do
    input = "> comment\n" \
            'field:'
    
    output = Enolib.parse(input).element('field').required_string_comment
    
    expected = 'comment'
    
    expect(output).to eq(expected)
  end
end

describe 'Querying an existing, two-line, required string comment from an empty field' do
  it 'produces the expected result' do
    input = ">comment\n" \
            ">  comment\n" \
            'field:'
    
    output = Enolib.parse(input).element('field').required_string_comment
    
    expected = "comment\n" \
               '  comment'
    
    expect(output).to eq(expected)
  end
end

describe 'Querying an existing, required string comment with blank lines from an empty field' do
  it 'produces the expected result' do
    input = ">\n" \
            ">     comment\n" \
            ">\n" \
            ">   comment\n" \
            ">\n" \
            "> comment\n" \
            ">\n" \
            'field:'
    
    output = Enolib.parse(input).element('field').required_string_comment
    
    expected = "    comment\n" \
               "\n" \
               "  comment\n" \
               "\n" \
               'comment'
    
    expect(output).to eq(expected)
  end
end

describe 'Querying an optional, existing string comment from an empty field' do
  it 'produces the expected result' do
    input = "> comment\n" \
            'field:'
    
    output = Enolib.parse(input).element('field').optional_string_comment
    
    expected = 'comment'
    
    expect(output).to eq(expected)
  end
end

describe 'Querying an optional, missing string comment from an empty field' do
  it 'produces the expected result' do
    input = 'field:'
    
    output = Enolib.parse(input).element('field').optional_string_comment
    
    expect(output).to be_nil
  end
end