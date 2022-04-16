# frozen_string_literal: true

describe 'An attribute without a key' do
  it 'raises the expected ParseError' do
    input = "field:\n" \
            '= value'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'The attribute in line 2 has no key.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                "      1 | field:\n" \
                ' >    2 | = value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(1)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(1)
      expect(error.selection[:to][:column]).to eq(0)
    end
  end
end