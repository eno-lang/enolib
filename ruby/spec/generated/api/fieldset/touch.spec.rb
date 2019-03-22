describe 'Asserting everything was touched when the only present fieldset was not touched' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "fieldset:\n" +
            "entry = value"

    begin
      Enolib.parse(input).assert_all_touched
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "This element was not expected, make sure it is at the right place in the document and that its key is not mis-typed."
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | fieldset:\n" +
              " *    2 | entry = value"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,0], [1,13]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Asserting everything was touched when the only present fieldset was touched' do
  it 'produces the expected result' do
    input = "fieldset:\n" +
            "entry = value"

    document = Enolib.parse(input)
    
    document.fieldset('fieldset').touch
    document.assert_all_touched

    expect('it passes').to be_truthy
  end
end