# frozen_string_literal: true

describe 'A field without a key' do
  it 'raises the expected ParseError' do
    input = "field:\n" \
            "- item\n" \
            "- item\n" \
            ': value'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'The field in line 4 has no key.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                "   ...\n" \
                "      2 | - item\n" \
                "      3 | - item\n" \
                ' >    4 | : value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(3)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(3)
      expect(error.selection[:to][:column]).to eq(0)
    end
  end
end