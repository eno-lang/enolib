# frozen_string_literal: true

describe 'Parsing a list item without any previous element' do
  it 'raises the expected ParseError' do
    input = '- item'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'Line 1 contains a list item without a list being specified before.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                ' >    1 | - item'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(6)
    end
  end
end

describe 'Parsing a list item preceded by a line continuation' do
  it 'raises the expected ParseError' do
    input = "field:\n" \
            "| continuation\n" \
            '- item'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'Line 3 contains a list item without a list being specified before.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                "      1 | field:\n" \
                "      2 | | continuation\n" \
                ' >    3 | - item'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(2)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(2)
      expect(error.selection[:to][:column]).to eq(6)
    end
  end
end

describe 'Parsing a list item preceded by a fieldset entry' do
  it 'raises the expected ParseError' do
    input = "fieldset:\n" \
            "entry = value\n" \
            '- item'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'Line 3 contains a list item without a list being specified before.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                "      1 | fieldset:\n" \
                "      2 | entry = value\n" \
                ' >    3 | - item'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(2)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(2)
      expect(error.selection[:to][:column]).to eq(6)
    end
  end
end