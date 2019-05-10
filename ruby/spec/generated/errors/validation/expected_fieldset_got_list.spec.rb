# frozen_string_literal: true

describe 'Expecting a fieldset but getting a list with one item' do
  it 'raises the expected ValidationError' do
    input = "list:\n" \
            '- item'

    begin
      Enolib.parse(input).fieldset('list')
    rescue Enolib::ValidationError => error
      expect(error).to be_a(Enolib::ValidationError)
      
      text = 'A fieldset with the key \'list\' was expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | list:\n" \
                ' *    2 | - item'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(1)
      expect(error.selection[:to][:column]).to eq(6)
    end
  end
end

describe 'Expecting a fieldset but getting a list with empty lines and multiple items' do
  it 'raises the expected ValidationError' do
    input = "list:\n" \
            "\n" \
            "- item\n" \
            "\n" \
            "- item\n" \
            "\n" \
            "- item\n" \
            ''

    begin
      Enolib.parse(input).fieldset('list')
    rescue Enolib::ValidationError => error
      expect(error).to be_a(Enolib::ValidationError)
      
      text = 'A fieldset with the key \'list\' was expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | list:\n" \
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

describe 'Expecting a fieldset but getting a list with two items with comments' do
  it 'raises the expected ValidationError' do
    input = "list:\n" \
            "> comment\n" \
            "- item\n" \
            "\n" \
            "> comment\n" \
            '- item'

    begin
      Enolib.parse(input).fieldset('list')
    rescue Enolib::ValidationError => error
      expect(error).to be_a(Enolib::ValidationError)
      
      text = 'A fieldset with the key \'list\' was expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | list:\n" \
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