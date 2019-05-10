# frozen_string_literal: true

describe 'A multiline field with an incomplete multiline field operator in the ending line' do
  it 'raises the expected ParseError' do
    input = "-- multiline_field\n" \
            "value\n" \
            "value\n" \
            "value\n" \
            '- multiline_field'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      expect(error).to be_a(Enolib::ParseError)
      
      text = 'The multiline field \'multiline_field\' starting in line 1 is not terminated until the end of the document.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | -- multiline_field\n" \
                " *    2 | value\n" \
                " *    3 | value\n" \
                " *    4 | value\n" \
                ' *    5 | - multiline_field'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(18)
    end
  end
end

describe 'A multiline field with an edge case key and missing space in the ending line' do
  it 'raises the expected ParseError' do
    input = "-- -\n" \
            "value\n" \
            "value\n" \
            "value\n" \
            '---'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      expect(error).to be_a(Enolib::ParseError)
      
      text = 'The multiline field \'-\' starting in line 1 is not terminated until the end of the document.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | -- -\n" \
                " *    2 | value\n" \
                " *    3 | value\n" \
                " *    4 | value\n" \
                ' *    5 | ---'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(4)
    end
  end
end