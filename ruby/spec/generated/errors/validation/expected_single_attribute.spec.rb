# frozen_string_literal: true

describe 'Expecting an attribute but getting two attributes' do
  it 'raises the expected ValidationError' do
    input = "field:\n" \
            "attribute = value\n" \
            'attribute = value'

    begin
      Enolib.parse(input).field('field').attribute('attribute')
    rescue Enolib::ValidationError => error
      text = 'This field was expected to contain only a single attribute with the key \'attribute\'.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                "      1 | field:\n" \
                " >    2 | attribute = value\n" \
                ' >    3 | attribute = value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(1)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(1)
      expect(error.selection[:to][:column]).to eq(17)
    end
  end
end

describe 'Expecting an attribute but getting two attributes with comments, empty lines and continuations' do
  it 'raises the expected ValidationError' do
    input = "field:\n" \
            "> comment\n" \
            "attribute = value\n" \
            "\\ continuation\n" \
            "\\ continuation\n" \
            "\n" \
            "> comment\n" \
            "attribute = value\n" \
            '| continuation'

    begin
      Enolib.parse(input).field('field').attribute('attribute')
    rescue Enolib::ValidationError => error
      text = 'This field was expected to contain only a single attribute with the key \'attribute\'.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                "      1 | field:\n" \
                "      2 | > comment\n" \
                " >    3 | attribute = value\n" \
                " *    4 | \\ continuation\n" \
                " *    5 | \\ continuation\n" \
                "      6 | \n" \
                "      7 | > comment\n" \
                " >    8 | attribute = value\n" \
                ' *    9 | | continuation'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(2)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(4)
      expect(error.selection[:to][:column]).to eq(14)
    end
  end
end