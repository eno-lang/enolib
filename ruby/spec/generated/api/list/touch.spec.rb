describe 'Asserting everything was touched when the only present list was not touched' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "list:\n" +
            "- item"

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
              " >    1 | list:\n" +
              " *    2 | - item"
    
    expect(error.snippet).to eq(snippet)
    
    expect(error.selection[:from][:line]).to eq(0)
    expect(error.selection[:from][:column]).to eq(0)
    expect(error.selection[:to][:line]).to eq(1)
    expect(error.selection[:to][:column]).to eq(6)
  end
end

describe 'Asserting everything was touched when the only present list was touched' do
  it 'produces the expected result' do
    input = "list:\n" +
            "- item"

    document = Enolib.parse(input)
    
    document.list('list').touch
    document.assert_all_touched

    expect('it passes').to be_truthy
  end
end