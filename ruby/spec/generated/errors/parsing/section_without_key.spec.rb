# frozen_string_literal: true

describe 'A section without a key' do
  it 'raises the expected ParseError' do
    input = '#'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'The section in line 1 has no key.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                ' >    1 | #'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(1)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(1)
    end
  end
end