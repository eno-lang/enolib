# frozen_string_literal: true

describe 'Parsing a line continuation without any prior element' do
  it 'raises the expected ParseError' do
    input = '| continuation'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'Line 1 contains a line continuation without a continuable element being specified before.'
      
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

describe 'Parsing a line continuation preceded by a copied field' do
  it 'raises the expected ParseError' do
    input = "field: value\n" \
            "\n" \
            "copy < field\n" \
            '| illegal_continuation'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'Line 4 contains a line continuation without a continuable element being specified before.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                "   ...\n" \
                "      2 | \n" \
                "      3 | copy < field\n" \
                ' >    4 | | illegal_continuation'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(3)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(3)
      expect(error.selection[:to][:column]).to eq(22)
    end
  end
end