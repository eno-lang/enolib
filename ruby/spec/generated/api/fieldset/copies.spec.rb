# frozen_string_literal: true

describe 'Querying four entries from a fieldset, all of them copied from another fieldset' do
  it 'produces the expected result' do
    input = "fieldset:\n" \
            "1 = 1\n" \
            "2 = 2\n" \
            "3 = 3\n" \
            "4 = 4\n" \
            "\n" \
            'copy < fieldset'

    output = Enolib.parse(input).fieldset('copy').entries.map(&:required_string_value)

    expect(output).to eq(['1', '2', '3', '4'])
  end
end

describe 'Querying four entries from a fieldset, two of them copied from another fieldset' do
  it 'produces the expected result' do
    input = "fieldset:\n" \
            "1 = 1\n" \
            "2 = 2\n" \
            "\n" \
            "copy < fieldset\n" \
            "3 = 3\n" \
            '4 = 4'

    output = Enolib.parse(input).fieldset('copy').entries.map(&:required_string_value)

    expect(output).to eq(['1', '2', '3', '4'])
  end
end

describe 'Querying three entries from a fieldset, one owned, one replaced, one copied' do
  it 'produces the expected result' do
    input = "fieldset:\n" \
            "1 = 1\n" \
            "2 = 0\n" \
            "\n" \
            "copy < fieldset\n" \
            "2 = 2\n" \
            '3 = 3'

    output = Enolib.parse(input).fieldset('copy').entries.map(&:required_string_value)

    expect(output).to eq(['1', '2', '3'])
  end
end