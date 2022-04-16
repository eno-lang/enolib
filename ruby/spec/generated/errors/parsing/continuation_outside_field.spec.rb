# frozen_string_literal: true

describe 'Parsing a continuation without any prior element' do
  it 'raises the expected ParseError' do
    input = '| continuation'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'The continuation in line 1 is not contained within a field.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                ' >    1 | | continuation'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(14)
    end
  end
end