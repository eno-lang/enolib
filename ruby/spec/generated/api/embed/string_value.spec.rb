# frozen_string_literal: true

describe 'Querying an existing required string value from an embed' do
  it 'produces the expected result' do
    input = "-- embed\n" \
            "value\n" \
            '-- embed'
    
    output = Enolib.parse(input).embed('embed').required_string_value
    
    expected = 'value'
    
    expect(output).to eq(expected)
  end
end

describe 'Querying an existing optional string value from an embed' do
  it 'produces the expected result' do
    input = "-- embed\n" \
            "value\n" \
            '-- embed'
    
    output = Enolib.parse(input).embed('embed').optional_string_value
    
    expected = 'value'
    
    expect(output).to eq(expected)
  end
end

describe 'Querying a missing optional string value from an embed' do
  it 'produces the expected result' do
    input = "-- embed\n" \
            '-- embed'
    
    output = Enolib.parse(input).embed('embed').optional_string_value
    
    expect(output).to be_nil
  end
end