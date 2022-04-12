# frozen_string_literal: true

describe 'Asserting everything was touched when the only present, empty field was not touched' do
  it 'raises the expected ValidationError' do
    input = 'field:'

    begin
      Enolib.parse(input).assert_all_touched
    rescue Enolib::ValidationError => error
      text = 'This element was not expected, make sure it is at the right place in the document and that its key is not mis-typed.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                ' >    1 | field:'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(5)
    end
  end
end

describe 'Asserting everything was touched when the only present, empty field was touched (as an element)' do
  it 'produces the expected result' do
    input = 'field:'
    
    document = Enolib.parse(input)
    
    document.element('field').touch
    document.assert_all_touched
    
    expect('it passes').to be_truthy
  end
end

describe 'Asserting everything was touched when the only present, empty field was touched (as a field)' do
  it 'produces the expected result' do
    input = 'field:'
    
    document = Enolib.parse(input)
    
    document.field('field').touch
    document.assert_all_touched
    
    expect('it passes').to be_truthy
  end
end