# frozen_string_literal: true

describe 'A missing empty queried without a key leaves out the key in the debug string representation' do
  it 'produces the expected result' do
    input = ''

    output = Enolib.parse(input).empty.to_s

    expect(output).to eq('#<Enolib::MissingEmpty>')
  end
end

describe 'A missing empty queried with a key includes the key in the debug string representation' do
  it 'produces the expected result' do
    input = ''

    output = Enolib.parse(input).empty('key').to_s

    expect(output).to eq('#<Enolib::MissingEmpty key=key>')
  end
end