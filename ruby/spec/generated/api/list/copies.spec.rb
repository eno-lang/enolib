# frozen_string_literal: true

describe 'Querying four items from a list, all of them copied from another list' do
  it 'produces the expected result' do
    input = "list:\n" +
            "- 1\n" +
            "- 2\n" +
            "- 3\n" +
            "- 4\n" +
            "\n" +
            "copy < list"

    output = Enolib.parse(input).list('copy').required_string_values

    expect(output).to eq(['1', '2', '3', '4'])
  end
end

describe 'Querying four items from a list, two of them copied from another list' do
  it 'produces the expected result' do
    input = "list:\n" +
            "- 1\n" +
            "- 2\n" +
            "\n" +
            "copy < list\n" +
            "- 3\n" +
            "- 4"

    output = Enolib.parse(input).list('copy').required_string_values

    expect(output).to eq(['1', '2', '3', '4'])
  end
end