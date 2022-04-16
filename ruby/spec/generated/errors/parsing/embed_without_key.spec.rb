# frozen_string_literal: true

describe 'An embed without a key' do
  it 'raises the expected ParseError' do
    input = "--\n" \
            'value'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'The embed in line 1 has no key.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | --\n" \
                '      2 | value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(2)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(2)
    end
  end
end