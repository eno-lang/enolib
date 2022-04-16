# frozen_string_literal: true

describe 'An embed with an incomplete embed operator in the ending line' do
  it 'raises the expected ParseError' do
    input = "-- embed\n" \
            "value\n" \
            "value\n" \
            "value\n" \
            '- embed'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'The embed \'embed\' starting in line 1 is not terminated until the end of the document.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | -- embed\n" \
                " *    2 | value\n" \
                " *    3 | value\n" \
                " *    4 | value\n" \
                ' *    5 | - embed'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(8)
    end
  end
end

describe 'An embed with an edge case key and missing space in the ending line' do
  it 'raises the expected ParseError' do
    input = "-- -\n" \
            "value\n" \
            "value\n" \
            "value\n" \
            '---'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'The embed \'-\' starting in line 1 is not terminated until the end of the document.'
      
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