# frozen_string_literal: true

describe 'Triggering an error inside a custom loader when querying a required comment on a field' do
  it 'raises the expected ValidationError' do
    input = "> comment\n" \
            'field: value'

    begin
      Enolib.parse(input).field('field').required_comment { raise 'my error' }
    rescue Enolib::ValidationError => error
      expect(error).to be_a(Enolib::ValidationError)
      
      text = 'There is a problem with the comment of this element: my error'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | > comment\n" \
                ' *    2 | field: value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(2)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(9)
    end
  end
end