# frozen_string_literal: true

describe 'Expecting fields but getting an empty embed' do
  it 'raises the expected ValidationError' do
    input = "-- element\n" \
            '-- element'

    begin
      Enolib.parse(input).fields('element')
    rescue Enolib::ValidationError => error
      text = 'Only fields with the key \'element\' were expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | -- element\n" \
                ' *    2 | -- element'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(1)
      expect(error.selection[:to][:column]).to eq(10)
    end
  end
end

describe 'Expecting fields but getting an embed with a value' do
  it 'raises the expected ValidationError' do
    input = "-- element\n" \
            "value\n" \
            '-- element'

    begin
      Enolib.parse(input).fields('element')
    rescue Enolib::ValidationError => error
      text = 'Only fields with the key \'element\' were expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | -- element\n" \
                " *    2 | value\n" \
                ' *    3 | -- element'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(2)
      expect(error.selection[:to][:column]).to eq(10)
    end
  end
end

describe 'Expecting fields but getting an embed with a comment' do
  it 'raises the expected ValidationError' do
    input = "> comment\n" \
            "-- element\n" \
            "value\n" \
            '-- element'

    begin
      Enolib.parse(input).fields('element')
    rescue Enolib::ValidationError => error
      text = 'Only fields with the key \'element\' were expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                "      1 | > comment\n" \
                " >    2 | -- element\n" \
                " *    3 | value\n" \
                ' *    4 | -- element'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(1)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(3)
      expect(error.selection[:to][:column]).to eq(10)
    end
  end
end

describe 'Expecting fields but getting a flag' do
  it 'raises the expected ValidationError' do
    input = 'element'

    begin
      Enolib.parse(input).fields('element')
    rescue Enolib::ValidationError => error
      text = 'Only fields with the key \'element\' were expected.'
      
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

describe 'Expecting fields but getting an empty section' do
  it 'raises the expected ValidationError' do
    input = '# element'

    begin
      Enolib.parse(input).fields('element')
    rescue Enolib::ValidationError => error
      text = 'Only fields with the key \'element\' were expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                ' >    1 | # element'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(9)
    end
  end
end

describe 'Expecting fields but getting a section with a field with a value and a field with items' do
  it 'raises the expected ValidationError' do
    input = "# element\n" \
            "\n" \
            "field: value\n" \
            "\n" \
            "field:\n" \
            "- item\n" \
            '- item'

    begin
      Enolib.parse(input).fields('element')
    rescue Enolib::ValidationError => error
      text = 'Only fields with the key \'element\' were expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | # element\n" \
                " *    2 | \n" \
                " *    3 | field: value\n" \
                " *    4 | \n" \
                " *    5 | field:\n" \
                " *    6 | - item\n" \
                ' *    7 | - item'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(6)
      expect(error.selection[:to][:column]).to eq(6)
    end
  end
end

describe 'Expecting fields but getting a section with subsections' do
  it 'raises the expected ValidationError' do
    input = "# element\n" \
            "\n" \
            "## section\n" \
            "\n" \
            "field: value\n" \
            "\n" \
            "## section\n" \
            "\n" \
            "field:\n" \
            "- item\n" \
            '- item'

    begin
      Enolib.parse(input).fields('element')
    rescue Enolib::ValidationError => error
      text = 'Only fields with the key \'element\' were expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | # element\n" \
                " *    2 | \n" \
                " *    3 | ## section\n" \
                " *    4 | \n" \
                " *    5 | field: value\n" \
                " *    6 | \n" \
                " *    7 | ## section\n" \
                " *    8 | \n" \
                " *    9 | field:\n" \
                " *   10 | - item\n" \
                ' *   11 | - item'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(10)
      expect(error.selection[:to][:column]).to eq(6)
    end
  end
end