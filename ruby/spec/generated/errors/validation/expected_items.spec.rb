# frozen_string_literal: true

describe 'Expecting a field containing items but getting a field containing a value' do
  it 'raises the expected ValidationError' do
    input = 'field: value'

    begin
      Enolib.parse(input).field('field').items
    rescue Enolib::ValidationError => error
      text = 'This field was expected to contain only items.'
      
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

describe 'Expecting a field containing items but getting a field containing continuations' do
  it 'raises the expected ValidationError' do
    input = "field:\n" \
            "| continuation\n" \
            '| continuation'

    begin
      Enolib.parse(input).field('field').items
    rescue Enolib::ValidationError => error
      text = 'This field was expected to contain only items.'
      
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

describe 'Expecting a field with items but getting a field containing a value and continuations separated by idle lines' do
  it 'raises the expected ValidationError' do
    input = "field: value\n" \
            "| continuation\n" \
            "| continuation\n" \
            "\n" \
            "> comment\n" \
            '| continuation'

    begin
      Enolib.parse(input).field('field').items
    rescue Enolib::ValidationError => error
      text = 'This field was expected to contain only items.'
      
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

describe 'Expecting a field containing items but getting a field with one attribute' do
  it 'raises the expected ValidationError' do
    input = "field:\n" \
            'attribute = value'

    begin
      Enolib.parse(input).field('field').items
    rescue Enolib::ValidationError => error
      text = 'This field was expected to contain only items.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | field:\n" \
                ' *    2 | attribute = value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(1)
      expect(error.selection[:to][:column]).to eq(17)
    end
  end
end

describe 'Expecting a field containing items but getting a field containing empty lines and three attributes' do
  it 'raises the expected ValidationError' do
    input = "field:\n" \
            "\n" \
            "attribute = value\n" \
            "\n" \
            "attribute = value\n" \
            "\n" \
            "attribute = value\n" \
            ''

    begin
      Enolib.parse(input).field('field').items
    rescue Enolib::ValidationError => error
      text = 'This field was expected to contain only items.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | field:\n" \
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

describe 'Expecting a field containing items but getting a field containing two attributes with comments' do
  it 'raises the expected ValidationError' do
    input = "field:\n" \
            "> comment\n" \
            "attribute = value\n" \
            "\n" \
            "> comment\n" \
            'attribute = value'

    begin
      Enolib.parse(input).field('field').items
    rescue Enolib::ValidationError => error
      text = 'This field was expected to contain only items.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | field:\n" \
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