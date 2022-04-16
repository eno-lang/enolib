# frozen_string_literal: true

describe 'Parsing an attribute preceded by a continuation' do
  it 'raises the expected ParseError' do
    input = "field:\n" \
            "| continuation\n" \
            'attribute = value'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'The field in line 1 must contain either only attributes, only items, or only a value.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " *    1 | field:\n" \
                " *    2 | | continuation\n" \
                ' >    3 | attribute = value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(2)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(2)
      expect(error.selection[:to][:column]).to eq(17)
    end
  end
end

describe 'Parsing an attribute preceded by a value' do
  it 'raises the expected ParseError' do
    input = "field: value\n" \
            'attribute = value'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'The field in line 1 must contain either only attributes, only items, or only a value.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " *    1 | field: value\n" \
                ' >    2 | attribute = value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(1)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(1)
      expect(error.selection[:to][:column]).to eq(17)
    end
  end
end

describe 'Parsing an attribute preceded by a item' do
  it 'raises the expected ParseError' do
    input = "field:\n" \
            "- item\n" \
            'attribute = value'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'The field in line 1 must contain either only attributes, only items, or only a value.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " *    1 | field:\n" \
                " *    2 | - item\n" \
                ' >    3 | attribute = value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(2)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(2)
      expect(error.selection[:to][:column]).to eq(17)
    end
  end
end

describe 'Parsing an item preceded by a continuation' do
  it 'raises the expected ParseError' do
    input = "field:\n" \
            "| continuation\n" \
            '- item'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'The field in line 1 must contain either only attributes, only items, or only a value.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " *    1 | field:\n" \
                " *    2 | | continuation\n" \
                ' >    3 | - item'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(2)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(2)
      expect(error.selection[:to][:column]).to eq(6)
    end
  end
end

describe 'Parsing an item preceded by an attribute' do
  it 'raises the expected ParseError' do
    input = "field:\n" \
            "attribute = value\n" \
            '- item'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'The field in line 1 must contain either only attributes, only items, or only a value.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " *    1 | field:\n" \
                " *    2 | attribute = value\n" \
                ' >    3 | - item'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(2)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(2)
      expect(error.selection[:to][:column]).to eq(6)
    end
  end
end