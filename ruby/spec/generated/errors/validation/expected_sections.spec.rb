# frozen_string_literal: true

describe 'Expecting sections but getting a field' do
  it 'raises the expected ValidationError' do
    input = 'field: value'

    begin
      Enolib.parse(input).sections('field')
    rescue Enolib::ValidationError => error
      text = 'Only sections with the key \'field\' were expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                ' >    1 | field: value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(12)
    end
  end
end

describe 'Expecting sections but getting a field with continuations' do
  it 'raises the expected ValidationError' do
    input = "field:\n" \
            "| continuation\n" \
            '| continuation'

    begin
      Enolib.parse(input).sections('field')
    rescue Enolib::ValidationError => error
      text = 'Only sections with the key \'field\' were expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | field:\n" \
                " *    2 | | continuation\n" \
                ' *    3 | | continuation'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(2)
      expect(error.selection[:to][:column]).to eq(14)
    end
  end
end

describe 'Expecting sections but getting a field with continuations separated by idle lines' do
  it 'raises the expected ValidationError' do
    input = "field: value\n" \
            "| continuation\n" \
            "| continuation\n" \
            "\n" \
            "> comment\n" \
            '| continuation'

    begin
      Enolib.parse(input).sections('field')
    rescue Enolib::ValidationError => error
      text = 'Only sections with the key \'field\' were expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | field: value\n" \
                " *    2 | | continuation\n" \
                " *    3 | | continuation\n" \
                " *    4 | \n" \
                " *    5 | > comment\n" \
                ' *    6 | | continuation'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(5)
      expect(error.selection[:to][:column]).to eq(14)
    end
  end
end

describe 'Expecting sections but getting a field with one attribute' do
  it 'raises the expected ValidationError' do
    input = "element:\n" \
            'attribute = value'

    begin
      Enolib.parse(input).sections('element')
    rescue Enolib::ValidationError => error
      text = 'Only sections with the key \'element\' were expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | element:\n" \
                ' *    2 | attribute = value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(1)
      expect(error.selection[:to][:column]).to eq(17)
    end
  end
end

describe 'Expecting sections but getting a field with empty lines and three attributes' do
  it 'raises the expected ValidationError' do
    input = "element:\n" \
            "\n" \
            "attribute = value\n" \
            "\n" \
            "attribute = value\n" \
            "\n" \
            "attribute = value\n" \
            ''

    begin
      Enolib.parse(input).sections('element')
    rescue Enolib::ValidationError => error
      text = 'Only sections with the key \'element\' were expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | element:\n" \
                " *    2 | \n" \
                " *    3 | attribute = value\n" \
                " *    4 | \n" \
                " *    5 | attribute = value\n" \
                " *    6 | \n" \
                " *    7 | attribute = value\n" \
                '      8 | '
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(6)
      expect(error.selection[:to][:column]).to eq(17)
    end
  end
end

describe 'Expecting sections but getting a field with two attribute with comments' do
  it 'raises the expected ValidationError' do
    input = "element:\n" \
            "> comment\n" \
            "attribute = value\n" \
            "\n" \
            "> comment\n" \
            'attribute = value'

    begin
      Enolib.parse(input).sections('element')
    rescue Enolib::ValidationError => error
      text = 'Only sections with the key \'element\' were expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | element:\n" \
                " *    2 | > comment\n" \
                " *    3 | attribute = value\n" \
                " *    4 | \n" \
                " *    5 | > comment\n" \
                ' *    6 | attribute = value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(5)
      expect(error.selection[:to][:column]).to eq(17)
    end
  end
end

describe 'Expecting sections but getting a field with one item' do
  it 'raises the expected ValidationError' do
    input = "element:\n" \
            '- item'

    begin
      Enolib.parse(input).sections('element')
    rescue Enolib::ValidationError => error
      text = 'Only sections with the key \'element\' were expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | element:\n" \
                ' *    2 | - item'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(1)
      expect(error.selection[:to][:column]).to eq(6)
    end
  end
end

describe 'Expecting sections but getting a field with empty lines and three items' do
  it 'raises the expected ValidationError' do
    input = "element:\n" \
            "\n" \
            "- item\n" \
            "\n" \
            "- item\n" \
            "\n" \
            "- item\n" \
            ''

    begin
      Enolib.parse(input).sections('element')
    rescue Enolib::ValidationError => error
      text = 'Only sections with the key \'element\' were expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | element:\n" \
                " *    2 | \n" \
                " *    3 | - item\n" \
                " *    4 | \n" \
                " *    5 | - item\n" \
                " *    6 | \n" \
                " *    7 | - item\n" \
                '      8 | '
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(6)
      expect(error.selection[:to][:column]).to eq(6)
    end
  end
end

describe 'Expecting sections but getting a field with two items with comments' do
  it 'raises the expected ValidationError' do
    input = "element:\n" \
            "> comment\n" \
            "- item\n" \
            "\n" \
            "> comment\n" \
            '- item'

    begin
      Enolib.parse(input).sections('element')
    rescue Enolib::ValidationError => error
      text = 'Only sections with the key \'element\' were expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | element:\n" \
                " *    2 | > comment\n" \
                " *    3 | - item\n" \
                " *    4 | \n" \
                " *    5 | > comment\n" \
                ' *    6 | - item'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(5)
      expect(error.selection[:to][:column]).to eq(6)
    end
  end
end

describe 'Expecting sections but getting a flag' do
  it 'raises the expected ValidationError' do
    input = 'element'

    begin
      Enolib.parse(input).sections('element')
    rescue Enolib::ValidationError => error
      text = 'Only sections with the key \'element\' were expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                ' >    1 | element'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(7)
    end
  end
end