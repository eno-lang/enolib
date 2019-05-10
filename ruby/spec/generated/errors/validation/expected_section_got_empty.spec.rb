# frozen_string_literal: true

describe 'Expecting a section but getting an empty element' do
  it 'raises the expected ValidationError' do
    input = 'element:'

    begin
      Enolib.parse(input).section('element')
    rescue Enolib::ValidationError => error
      expect(error).to be_a(Enolib::ValidationError)
      
      text = 'A section with the key \'element\' was expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                ' >    1 | element:'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(8)
    end
  end
end