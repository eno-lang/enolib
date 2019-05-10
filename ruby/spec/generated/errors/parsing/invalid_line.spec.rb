# frozen_string_literal: true

describe 'A line without operators' do
  it 'raises the expected ParseError' do
    input = "list:\n" \
            "- item\n" \
            "- item\n" \
            'illegal'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      expect(error).to be_a(Enolib::ParseError)
      
      text = 'Line 4 does not follow any specified pattern.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                "   ...\n" \
                "      2 | - item\n" \
                "      3 | - item\n" \
                ' >    4 | illegal'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(3)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(3)
      expect(error.selection[:to][:column]).to eq(7)
    end
  end
end