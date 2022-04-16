# frozen_string_literal: true

describe 'A valid escape sequence, continued invalidly' do
  it 'raises the expected ParseError' do
    input = '`key` value'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'The escape sequence in line 1 can only be followed by an attribute or field operator.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                ' >    1 | `key` value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(6)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(11)
    end
  end
end