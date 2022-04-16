# frozen_string_literal: true

describe 'Querying all attributes from a field' do
  it 'produces the expected result' do
    input = "field:\n" \
            "1 = 1\n" \
            '2 = 2'
    
    output = Enolib.parse(input).field('field').attributes.map(&:required_string_value)
    
    expect(output).to eq(['1', '2'])
  end
end

describe 'Querying attributes from a field by key' do
  it 'produces the expected result' do
    input = "field:\n" \
            "attribute = value\n" \
            "other = one\n" \
            'other = two'
    
    output = Enolib.parse(input).field('field').attributes('other').map(&:required_string_value)
    
    expect(output).to eq(['one', 'two'])
  end
end