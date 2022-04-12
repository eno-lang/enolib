# frozen_string_literal: true

describe 'Querying existing required string values from a field with items' do
  it 'produces the expected result' do
    input = "field:\n" \
            "- item\n" \
            '- item'
    
    output = Enolib.parse(input).field('field').required_string_values
    
    expect(output).to eq(['item', 'item'])
  end
end

describe 'Querying existing optional string values from a field with items' do
  it 'produces the expected result' do
    input = "field:\n" \
            "- item\n" \
            '- item'
    
    output = Enolib.parse(input).field('field').optional_string_values
    
    expect(output).to eq(['item', 'item'])
  end
end

describe 'Querying missing optional string values from a field with items' do
  it 'produces the expected result' do
    input = "field:\n" \
            "-\n" \
            '-'
    
    output = Enolib.parse(input).field('field').optional_string_values
    
    expect(output).to eq([nil, nil])
  end
end