describe 'Asserting everything was touched when the only present section was not touched' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "# section"

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
              " >    1 | # section"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,0], [0,9]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Asserting everything was touched when the only present section was touched' do
  it 'produces the expected result' do
    input = "# section"

    document = Enolib.parse(input)
    
    document.section('section').touch
    document.assert_all_touched

    expect('it passes').to be_truthy
  end
end