# frozen_string_literal: true

describe 'Querying a section for a required but missing comment' do
  it 'raises the expected ValidationError' do
    input = '# section'

    begin
      Enolib.parse(input).section('section').required_string_comment
    rescue Enolib::ValidationError => error
      text = 'A required comment for this element is missing.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                ' >    1 | # section'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(0)
    end
  end
end

describe 'Querying the document for a required but missing comment' do
  it 'raises the expected ValidationError' do
    input = 'field: value'

    begin
      Enolib.parse(input).required_string_comment
    rescue Enolib::ValidationError => error
      text = 'A required comment for the document is missing.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                ' ?    1 | field: value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(0)
    end
  end
end