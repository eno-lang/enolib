describe 'Querying a value from a field with a loader that always produces an error' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "field: value"

    begin
      Enolib.parse(input).field('field').required_value { | value | raise "my error for '#{value}'" }
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "There is a problem with the value of this element: my error for 'value'"
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | field: value"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,7], [0,12]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Requesting a value error from a field with a static message' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "field: value"

    begin
      raise Enolib.parse(input).field('field').value_error('my static message')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "There is a problem with the value of this element: my static message"
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | field: value"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,7], [0,12]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Requesting a value error from a field with a dynamically generated message' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "field: value"

    begin
      raise Enolib.parse(input).field('field').value_error { |value| "my generated message for '#{value}'" }
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "There is a problem with the value of this element: my generated message for 'value'"
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | field: value"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,7], [0,12]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Requesting a value error from a multiline field with a static message' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "-- multiline_field\n" +
            "value\n" +
            "-- multiline_field"

    begin
      raise Enolib.parse(input).field('multiline_field').value_error('my static message')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "There is a problem with the value of this element: my static message"
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "      1 | -- multiline_field\n" +
              " >    2 | value\n" +
              "      3 | -- multiline_field"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[1,0], [1,5]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Requesting a value error from a multiline field with a dynamically generated message' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "-- multiline_field\n" +
            "value\n" +
            "-- multiline_field"

    begin
      raise Enolib.parse(input).field('multiline_field').value_error { |value| "my generated message for '#{value}'" }
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "There is a problem with the value of this element: my generated message for 'value'"
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              "      1 | -- multiline_field\n" +
              " >    2 | value\n" +
              "      3 | -- multiline_field"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[1,0], [1,5]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Requesting a value error from an empty multiline field with a static message' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "-- multiline_field\n" +
            "-- multiline_field"

    begin
      raise Enolib.parse(input).field('multiline_field').value_error('my static message')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "There is a problem with the value of this element: my static message"
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | -- multiline_field\n" +
              " *    2 | -- multiline_field"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,18], [0,18]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Requesting a value error from an empty multiline field with a dynamically generated message' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "-- multiline_field\n" +
            "-- multiline_field"

    begin
      raise Enolib.parse(input).field('multiline_field').value_error { |value| "my generated message" }
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "There is a problem with the value of this element: my generated message"
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | -- multiline_field\n" +
              " *    2 | -- multiline_field"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,18], [0,18]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Requesting a value error from a field with continuations with a static message' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "field: value\n" +
            "\\ continuation\n" +
            "\\ continuation\n" +
            "|\n" +
            "\n" +
            "|"

    begin
      raise Enolib.parse(input).field('field').value_error('my static message')
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "There is a problem with the value of this element: my static message"
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | field: value\n" +
              " *    2 | \\ continuation\n" +
              " *    3 | \\ continuation\n" +
              " *    4 | |\n" +
              " *    5 | \n" +
              " *    6 | |"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,7], [5,1]]
    
    expect(error.selection).to eq(selection)
  end
end

describe 'Requesting a value error from a field with continuations with a dynamically generated message' do
  it 'raises the expected ValidationError' do
    error = nil

    input = "field: value\n" +
            "\\ continuation\n" +
            "\\ continuation\n" +
            "|\n" +
            "\n" +
            "|"

    begin
      raise Enolib.parse(input).field('field').value_error { |value| "my generated message for '#{value}'" }
    rescue => _error
      if _error.is_a?(Enolib::ValidationError)
        error = _error
      else
        raise _error
      end
    end

    expect(error).to be_a(Enolib::ValidationError)
    
    text = "There is a problem with the value of this element: my generated message for 'value continuation continuation'"
    
    expect(error.text).to eq(text)
    
    snippet = "   Line | Content\n" +
              " >    1 | field: value\n" +
              " *    2 | \\ continuation\n" +
              " *    3 | \\ continuation\n" +
              " *    4 | |\n" +
              " *    5 | \n" +
              " *    6 | |"
    
    expect(error.snippet).to eq(snippet)
    
    selection = [[0,7], [5,1]]
    
    expect(error.selection).to eq(selection)
  end
end