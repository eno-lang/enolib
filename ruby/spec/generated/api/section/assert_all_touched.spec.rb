# frozen_string_literal: true

describe 'Asserting everything was touched on an empty document' do
  it 'produces the expected result' do
    input = ''
    
    Enolib.parse(input).assert_all_touched
    
    expect('it passes').to be_truthy
  end
end

describe 'Asserting everything was touched on an untouched document containing a single field' do
  it 'raises the expected ValidationError' do
    input = 'field: value'

    begin
      Enolib.parse(input).assert_all_touched
    rescue Enolib::ValidationError => error
      text = 'This element was not expected, make sure it is at the right place in the document and that its key is not mis-typed.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                ' >    1 | field: value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(12)
    end
  end
end

describe 'Asserting everything was touched on an untouched document containing a single field, with a custom message' do
  it 'raises the expected ValidationError' do
    input = 'field: value'

    begin
      Enolib.parse(input).assert_all_touched('my message')
    rescue Enolib::ValidationError => error
      text = 'my message'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                ' >    1 | field: value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(12)
    end
  end
end

describe 'Asserting everything was touched on an untouched document containing a single field, with a custom message function' do
  it 'raises the expected ValidationError' do
    input = 'field: value'

    begin
      Enolib.parse(input).assert_all_touched { |element| "my generated message for unexpected element '#{element.string_key}'" }
    rescue Enolib::ValidationError => error
      text = 'my generated message for unexpected element \'field\''
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                ' >    1 | field: value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(12)
    end
  end
end