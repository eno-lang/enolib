# frozen_string_literal: true

describe 'Querying all entries from a fieldset' do
  it 'produces the expected result' do
    input = "fieldset:\n" +
            "1 = 1\n" +
            "2 = 2"

    output = Enolib.parse(input).fieldset('fieldset').entries.map(&:required_string_value)

    expect(output).to eq(['1', '2'])
  end
end

describe 'Querying entries from a fieldset by key' do
  it 'produces the expected result' do
    input = "fieldset:\n" +
            "entry = value\n" +
            "other = one\n" +
            "other = two"

    output = Enolib.parse(input).fieldset('fieldset').entries('other').map(&:required_string_value)

    expect(output).to eq(['one', 'two'])
  end
end