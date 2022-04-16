# frozen_string_literal: true

describe 'Expecting a field but getting two fields' do
  it 'raises the expected ValidationError' do
    input = "field: value\n" \
            'field: value'

    begin
      Enolib.parse(input).field('field')
    rescue Enolib::ValidationError => error
      text = 'Only a single field with the key \'field\' was expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | field: value\n" \
                ' >    2 | field: value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(12)
    end
  end
end

describe 'Expecting a field but getting two fields with comments, empty lines and continuations' do
  it 'raises the expected ValidationError' do
    input = "> comment\n" \
            "field: value\n" \
            "\\ continuation\n" \
            "\n" \
            "\\ continuation\n" \
            "\n" \
            "field: value\n" \
            "> comment\n" \
            '| continutation'

    begin
      Enolib.parse(input).field('field')
    rescue Enolib::ValidationError => error
      text = 'Only a single field with the key \'field\' was expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                "      1 | > comment\n" \
                " >    2 | field: value\n" \
                " *    3 | \\ continuation\n" \
                " *    4 | \n" \
                " *    5 | \\ continuation\n" \
                "      6 | \n" \
                " >    7 | field: value\n" \
                " *    8 | > comment\n" \
                ' *    9 | | continutation'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(1)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(4)
      expect(error.selection[:to][:column]).to eq(14)
    end
  end
end

describe 'Expecting a field but getting two fields' do
  it 'raises the expected ValidationError' do
    input = "field:\n" \
            "attribute = value\n" \
            "field:\n" \
            'attribute = value'

    begin
      Enolib.parse(input).field('field')
    rescue Enolib::ValidationError => error
      text = 'Only a single field with the key \'field\' was expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | field:\n" \
                " *    2 | attribute = value\n" \
                " >    3 | field:\n" \
                ' *    4 | attribute = value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(1)
      expect(error.selection[:to][:column]).to eq(17)
    end
  end
end

describe 'Expecting a field but getting two fields with attributes, comments, empty lines and continuations' do
  it 'raises the expected ValidationError' do
    input = "> comment\n" \
            "field:\n" \
            "attribute = value\n" \
            "\n" \
            "attribute = value\n" \
            "\n" \
            "field:\n" \
            "> comment\n" \
            'attribute = value'

    begin
      Enolib.parse(input).field('field')
    rescue Enolib::ValidationError => error
      text = 'Only a single field with the key \'field\' was expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                "      1 | > comment\n" \
                " >    2 | field:\n" \
                " *    3 | attribute = value\n" \
                " *    4 | \n" \
                " *    5 | attribute = value\n" \
                "      6 | \n" \
                " >    7 | field:\n" \
                " *    8 | > comment\n" \
                ' *    9 | attribute = value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(1)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(4)
      expect(error.selection[:to][:column]).to eq(17)
    end
  end
end

describe 'Expecting a field but getting two fields with items' do
  it 'raises the expected ValidationError' do
    input = "field:\n" \
            "- item\n" \
            "field:\n" \
            '- item'

    begin
      Enolib.parse(input).field('field')
    rescue Enolib::ValidationError => error
      text = 'Only a single field with the key \'field\' was expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | field:\n" \
                " *    2 | - item\n" \
                " >    3 | field:\n" \
                ' *    4 | - item'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(1)
      expect(error.selection[:to][:column]).to eq(6)
    end
  end
end

describe 'Expecting a field but getting two fields with items, comments, empty lines and continuations' do
  it 'raises the expected ValidationError' do
    input = "> comment\n" \
            "field:\n" \
            "- item\n" \
            "\n" \
            "- item\n" \
            "\n" \
            "field:\n" \
            "> comment\n" \
            "- item\n" \
            '\ continuation'

    begin
      Enolib.parse(input).field('field')
    rescue Enolib::ValidationError => error
      text = 'Only a single field with the key \'field\' was expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                "      1 | > comment\n" \
                " >    2 | field:\n" \
                " *    3 | - item\n" \
                " *    4 | \n" \
                " *    5 | - item\n" \
                "      6 | \n" \
                " >    7 | field:\n" \
                " *    8 | > comment\n" \
                " *    9 | - item\n" \
                ' *   10 | \ continuation'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(1)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(4)
      expect(error.selection[:to][:column]).to eq(6)
    end
  end
end