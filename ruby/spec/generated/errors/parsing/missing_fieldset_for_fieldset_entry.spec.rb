# frozen_string_literal: true

describe 'Parsing a fieldset entry without a fieldset' do
  it 'raises the expected ParseError' do
    input = 'entry = value'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'Line 1 contains a fieldset entry without a fieldset being specified before.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                ' >    1 | entry = value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(13)
    end
  end
end

describe 'Parsing a fieldset entry preceded by a line continuation' do
  it 'raises the expected ParseError' do
    input = "field:\n" \
            "| line_continuation\n" \
            'entry = value'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'Line 3 contains a fieldset entry without a fieldset being specified before.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                "      1 | field:\n" \
                "      2 | | line_continuation\n" \
                ' >    3 | entry = value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(2)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(2)
      expect(error.selection[:to][:column]).to eq(13)
    end
  end
end

describe 'Parsing a fieldset entry preceded by a field' do
  it 'raises the expected ParseError' do
    input = "field: value\n" \
            'entry = value'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'Line 2 contains a fieldset entry without a fieldset being specified before.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                "      1 | field: value\n" \
                ' >    2 | entry = value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(1)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(1)
      expect(error.selection[:to][:column]).to eq(13)
    end
  end
end

describe 'Parsing a fieldset entry preceded by a list item' do
  it 'raises the expected ParseError' do
    input = "list:\n" \
            "- item\n" \
            'entry = value'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'Line 3 contains a fieldset entry without a fieldset being specified before.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                "      1 | list:\n" \
                "      2 | - item\n" \
                ' >    3 | entry = value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(2)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(2)
      expect(error.selection[:to][:column]).to eq(13)
    end
  end
end