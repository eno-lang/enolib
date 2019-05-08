# frozen_string_literal: true

describe 'Querying an existing required string value from a field' do
  it 'produces the expected result' do
    input = "field: value"

    output = Enolib.parse(input).field('field').required_string_value

    expected = "value"
    
    expect(output).to eq(expected)
  end
end

describe 'Querying an existing optional string value from a field' do
  it 'produces the expected result' do
    input = "field: value"

    output = Enolib.parse(input).field('field').optional_string_value

    expected = "value"
    
    expect(output).to eq(expected)
  end
end

describe 'Querying a missing optional string value from a field' do
  it 'produces the expected result' do
    input = "field:"

    output = Enolib.parse(input).field('field').optional_string_value

    expect(output).to be_nil
  end
end