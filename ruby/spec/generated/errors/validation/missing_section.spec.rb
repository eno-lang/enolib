# frozen_string_literal: true

describe 'Querying an empty document for a required but missing section' do
  it 'raises the expected ValidationError' do
    input = ''

    begin
      Enolib.parse(input).required_section('section')
    rescue Enolib::ValidationError => error
      text = 'The section \'section\' is missing - in case it has been specified look for typos and also check for correct capitalization.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                ' ?    1 | '
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(0)
    end
  end
end

describe 'Querying a section for a required but missing section' do
  it 'raises the expected ValidationError' do
    input = '# section'

    begin
      Enolib.parse(input).section('section').required_section('section')
    rescue Enolib::ValidationError => error
      text = 'The section \'section\' is missing - in case it has been specified look for typos and also check for correct capitalization.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                ' *    1 | # section'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(9)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(9)
    end
  end
end