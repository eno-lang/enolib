# frozen_string_literal: true

describe 'Querying an existing required string value from a multline field' do
  it 'produces the expected result' do
    input = "-- multiline_field\n" +
            "value\n" +
            "-- multiline_field"

    output = Enolib.parse(input).field('multiline_field').required_string_value

    expected = "value"
    
    expect(output).to eq(expected)
  end
end

describe 'Querying an existing optional string value from a multline field' do
  it 'produces the expected result' do
    input = "-- multiline_field\n" +
            "value\n" +
            "-- multiline_field"

    output = Enolib.parse(input).field('multiline_field').optional_string_value

    expected = "value"
    
    expect(output).to eq(expected)
  end
end

describe 'Querying a missing optional string value from a multline field' do
  it 'produces the expected result' do
    input = "-- multiline_field\n" +
            "-- multiline_field"

    output = Enolib.parse(input).field('multiline_field').optional_string_value

    expect(output).to be_nil
  end
end