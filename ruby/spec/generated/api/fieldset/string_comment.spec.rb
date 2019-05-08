# frozen_string_literal: true

describe 'Querying an existing, single-line, required string comment from a fieldset' do
  it 'produces the expected result' do
    input = "> comment\n" +
            "fieldset:\n" +
            "entry = value"

    output = Enolib.parse(input).fieldset('fieldset').required_string_comment

    expected = "comment"
    
    expect(output).to eq(expected)
  end
end

describe 'Querying an existing, two-line, required string comment from a fieldset' do
  it 'produces the expected result' do
    input = ">comment\n" +
            ">  comment\n" +
            "fieldset:\n" +
            "entry = value"

    output = Enolib.parse(input).fieldset('fieldset').required_string_comment

    expected = "comment\n" +
               "  comment"
    
    expect(output).to eq(expected)
  end
end

describe 'Querying an existing, required string comment with blank lines from a fieldset' do
  it 'produces the expected result' do
    input = ">\n" +
            ">     comment\n" +
            ">\n" +
            ">   comment\n" +
            ">\n" +
            "> comment\n" +
            ">\n" +
            "fieldset:\n" +
            "entry = value"

    output = Enolib.parse(input).fieldset('fieldset').required_string_comment

    expected = "    comment\n" +
               "\n" +
               "  comment\n" +
               "\n" +
               "comment"
    
    expect(output).to eq(expected)
  end
end

describe 'Querying an optional, existing string comment from a fieldset' do
  it 'produces the expected result' do
    input = "> comment\n" +
            "fieldset:\n" +
            "entry = value"

    output = Enolib.parse(input).fieldset('fieldset').optional_string_comment

    expected = "comment"
    
    expect(output).to eq(expected)
  end
end

describe 'Querying an optional, missing string comment from a fieldset' do
  it 'produces the expected result' do
    input = "fieldset:\n" +
            "entry = value"

    output = Enolib.parse(input).fieldset('fieldset').optional_string_comment

    expect(output).to be_nil
  end
end