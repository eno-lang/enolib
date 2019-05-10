# frozen_string_literal: true

describe 'Asserting everything was touched when the only present fieldset was not touched' do
  it 'raises the expected ValidationError' do
    input = "fieldset:\n" \
            'entry = value'

    begin
      Enolib.parse(input).assert_all_touched
    rescue Enolib::ValidationError => error
      expect(error).to be_a(Enolib::ValidationError)
      
      text = 'This element was not expected, make sure it is at the right place in the document and that its key is not mis-typed.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | fieldset:\n" \
                ' *    2 | entry = value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(1)
      expect(error.selection[:to][:column]).to eq(13)
    end
  end
end

describe 'Asserting everything was touched when the only present fieldset was touched' do
  it 'produces the expected result' do
    input = "fieldset:\n" \
            'entry = value'

    document = Enolib.parse(input)
    
    document.fieldset('fieldset').touch
    document.assert_all_touched

    expect('it passes').to be_truthy
  end
end