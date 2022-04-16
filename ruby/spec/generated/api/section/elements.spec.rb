# frozen_string_literal: true

describe 'Querying all elements from a section' do
  it 'produces the expected result' do
    input = "# section\n" \
            "one: value\n" \
            'two: value'
    
    output = Enolib.parse(input).section('section').elements.map(&:string_key)
    
    expect(output).to eq(['one', 'two'])
  end
end

describe 'Querying elements from a section by key' do
  it 'produces the expected result' do
    input = "# section\n" \
            "field: value\n" \
            "other: one\n" \
            'other: two'
    
    output = Enolib.parse(input).section('section').elements('other').map { |element| element.required_string_value }
    
    expect(output).to eq(['one', 'two'])
  end
end