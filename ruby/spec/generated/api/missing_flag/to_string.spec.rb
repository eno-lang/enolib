# frozen_string_literal: true

describe 'A missing flag queried without a key leaves out the key in the debug string representation' do
  it 'produces the expected result' do
    input = ''
    
    output = Enolib.parse(input).flag.to_s
    
    expect(output).to eq('#<Enolib::MissingFlag>')
  end
end

describe 'A missing flag queried with a key includes the key in the debug string representation' do
  it 'produces the expected result' do
    input = ''
    
    output = Enolib.parse(input).flag('key').to_s
    
    expect(output).to eq('#<Enolib::MissingFlag key=key>')
  end
end