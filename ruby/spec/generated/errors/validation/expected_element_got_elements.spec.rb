# frozen_string_literal: true

describe 'Expecting an element but getting two elements' do
  it 'raises the expected ValidationError' do
    input = "element:\n" \
            'element:'

    begin
      Enolib.parse(input).element('element')
    rescue Enolib::ValidationError => error
      text = 'Only a single element with the key \'element\' was expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | element:\n" \
                ' >    2 | element:'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(8)
    end
  end
end

describe 'Expecting an element but getting two elements with comments and empty lines' do
  it 'raises the expected ValidationError' do
    input = "> comment\n" \
            "element:\n" \
            "\n" \
            "> comment\n" \
            'element:'

    begin
      Enolib.parse(input).element('element')
    rescue Enolib::ValidationError => error
      text = 'Only a single element with the key \'element\' was expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                "      1 | > comment\n" \
                " >    2 | element:\n" \
                "      3 | \n" \
                "      4 | > comment\n" \
                ' >    5 | element:'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(1)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(1)
      expect(error.selection[:to][:column]).to eq(8)
    end
  end
end