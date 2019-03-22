describe 'Querying existing required string values from a list' do
  it 'produces the expected result' do
    input = "list:\n" +
            "- item\n" +
            "- item"

    output = Enolib.parse(input).list('list').required_string_values

    expect(output).to eq(['item', 'item'])
  end
end

describe 'Querying existing optional string values from a list' do
  it 'produces the expected result' do
    input = "list:\n" +
            "- item\n" +
            "- item"

    output = Enolib.parse(input).list('list').optional_string_values

    expect(output).to eq(['item', 'item'])
  end
end

describe 'Querying missing optional string values from a list' do
  it 'produces the expected result' do
    input = "list:\n" +
            "-\n" +
            "-"

    output = Enolib.parse(input).list('list').optional_string_values

    expect(output).to eq([nil, nil])
  end
end