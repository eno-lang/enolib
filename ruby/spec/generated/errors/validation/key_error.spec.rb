# frozen_string_literal: true

describe 'Triggering an error inside a custom loader when querying the key of a field' do
  it 'raises the expected ValidationError' do
    input = 'field: value'

    begin
      Enolib.parse(input).field('field').key { raise 'my error' }
    rescue Enolib::ValidationError => error
      expect(error).to be_a(Enolib::ValidationError)
      
      text = 'There is a problem with the key of this element: my error'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                ' >    1 | field: value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(5)
    end
  end
end