# frozen_string_literal: true

describe 'Starting a section two levels deeper than the current one' do
  it 'raises the expected ParseError' do
    input = "# section\n" \
            '### subsubsection'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'Line 2 starts a section that is more than one level deeper than the current one.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " *    1 | # section\n" \
                ' >    2 | ### subsubsection'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(1)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(1)
      expect(error.selection[:to][:column]).to eq(17)
    end
  end
end

describe 'Starting the first section in the document at a deep level' do
  it 'raises the expected ParseError' do
    input = '### section'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'Line 1 starts a section that is more than one level deeper than the current one.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                ' >    1 | ### section'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(11)
    end
  end
end