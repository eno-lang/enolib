# frozen_string_literal: true

describe 'Expecting a field containing attributes but getting a field containing a value' do
  it 'raises the expected ValidationError' do
    input = 'field: value'

    begin
      Enolib.parse(input).field('field').attributes
    rescue Enolib::ValidationError => error
      text = 'This field was expected to contain only attributes.'
      
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

describe 'Expecting a field containing attributes but getting a field containing continuations' do
  it 'raises the expected ValidationError' do
    input = "field:\n" \
            "| continuation\n" \
            '| continuation'

    begin
      Enolib.parse(input).field('field').attributes
    rescue Enolib::ValidationError => error
      text = 'This field was expected to contain only attributes.'
      
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

describe 'Expecting a field containing attributes but getting a field containing continuations separated by idle lines' do
  it 'raises the expected ValidationError' do
    input = "field: value\n" \
            "| continuation\n" \
            "| continuation\n" \
            "\n" \
            "> comment\n" \
            '| continuation'

    begin
      Enolib.parse(input).field('field').attributes
    rescue Enolib::ValidationError => error
      text = 'This field was expected to contain only attributes.'
      
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

describe 'Expecting a field containing attributes but getting a field containing one item' do
  it 'raises the expected ValidationError' do
    input = "field:\n" \
            '- item'

    begin
      Enolib.parse(input).field('field').attributes
    rescue Enolib::ValidationError => error
      text = 'This field was expected to contain only attributes.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | field:\n" \
                ' *    2 | - item'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(1)
      expect(error.selection[:to][:column]).to eq(6)
    end
  end
end

describe 'Expecting a field containing attributes but getting a field containing empty lines and three items' do
  it 'raises the expected ValidationError' do
    input = "field:\n" \
            "\n" \
            "- item\n" \
            "\n" \
            "- item\n" \
            "\n" \
            "- item\n" \
            ''

    begin
      Enolib.parse(input).field('field').attributes
    rescue Enolib::ValidationError => error
      text = 'This field was expected to contain only attributes.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | field:\n" \
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

describe 'Expecting a field containing attributes but getting a field containing two items with comments' do
  it 'raises the expected ValidationError' do
    input = "field:\n" \
            "> comment\n" \
            "- item\n" \
            "\n" \
            "> comment\n" \
            '- item'

    begin
      Enolib.parse(input).field('field').attributes
    rescue Enolib::ValidationError => error
      text = 'This field was expected to contain only attributes.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | field:\n" \
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