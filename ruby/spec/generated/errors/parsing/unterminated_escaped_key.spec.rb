# frozen_string_literal: true

describe 'A single field with an terminated escaped key' do
  it 'raises the expected ParseError' do
    input = '`field: value'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'In line 1 the key of an element is escaped, but the escape sequence is not terminated until the end of the line.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                ' >    1 | `field: value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(1)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(13)
    end
  end
end

describe 'A single section with an unterminated escaped key' do
  it 'raises the expected ParseError' do
    input = '# `field: value'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'In line 1 the key of an element is escaped, but the escape sequence is not terminated until the end of the line.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                ' >    1 | # `field: value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(3)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(15)
    end
  end
end