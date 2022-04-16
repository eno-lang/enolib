# frozen_string_literal: true

describe 'Querying a value from a field with a loader that always produces an error' do
  it 'raises the expected ValidationError' do
    input = 'field: value'

    begin
      Enolib.parse(input).field('field').required_value { |value| raise "my error for '#{value}'" }
    rescue Enolib::ValidationError => error
      text = 'There is a problem with the value of this element: my error for \'value\''
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                ' >    1 | field: value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(7)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(12)
    end
  end
end

describe 'Requesting a value error from a field with a static message' do
  it 'raises the expected ValidationError' do
    input = 'field: value'

    begin
      raise Enolib.parse(input).field('field').value_error('my static message')
    rescue Enolib::ValidationError => error
      text = 'There is a problem with the value of this element: my static message'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                ' >    1 | field: value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(7)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(12)
    end
  end
end

describe 'Requesting a value error from a field with a dynamically generated message' do
  it 'raises the expected ValidationError' do
    input = 'field: value'

    begin
      raise(Enolib.parse(input).field('field').value_error { |value| "my generated message for '#{value}'" })
    rescue Enolib::ValidationError => error
      text = 'There is a problem with the value of this element: my generated message for \'value\''
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                ' >    1 | field: value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(7)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(12)
    end
  end
end

describe 'Requesting a value error from an embed with a static message' do
  it 'raises the expected ValidationError' do
    input = "-- embed\n" \
            "value\n" \
            '-- embed'

    begin
      raise Enolib.parse(input).embed('embed').value_error('my static message')
    rescue Enolib::ValidationError => error
      text = 'There is a problem with the value of this element: my static message'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                "      1 | -- embed\n" \
                " >    2 | value\n" \
                '      3 | -- embed'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(1)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(1)
      expect(error.selection[:to][:column]).to eq(5)
    end
  end
end

describe 'Requesting a value error from an embed with a dynamically generated message' do
  it 'raises the expected ValidationError' do
    input = "-- embed\n" \
            "value\n" \
            '-- embed'

    begin
      raise(Enolib.parse(input).embed('embed').value_error { |value| "my generated message for '#{value}'" })
    rescue Enolib::ValidationError => error
      text = 'There is a problem with the value of this element: my generated message for \'value\''
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                "      1 | -- embed\n" \
                " >    2 | value\n" \
                '      3 | -- embed'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(1)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(1)
      expect(error.selection[:to][:column]).to eq(5)
    end
  end
end

describe 'Requesting a value error from an empty embed with a static message' do
  it 'raises the expected ValidationError' do
    input = "-- embed\n" \
            '-- embed'

    begin
      raise Enolib.parse(input).embed('embed').value_error('my static message')
    rescue Enolib::ValidationError => error
      text = 'There is a problem with the value of this element: my static message'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | -- embed\n" \
                ' *    2 | -- embed'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(8)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(8)
    end
  end
end

describe 'Requesting a value error from an empty embed with a dynamically generated message' do
  it 'raises the expected ValidationError' do
    input = "-- embed\n" \
            '-- embed'

    begin
      raise(Enolib.parse(input).embed('embed').value_error { |_value| 'my generated message' })
    rescue Enolib::ValidationError => error
      text = 'There is a problem with the value of this element: my generated message'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | -- embed\n" \
                ' *    2 | -- embed'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(8)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(8)
    end
  end
end

describe 'Requesting a value error from a field with continuations with a static message' do
  it 'raises the expected ValidationError' do
    input = "field: value\n" \
            "\\ continuation\n" \
            "\\ continuation\n" \
            "|\n" \
            "\n" \
            '|'

    begin
      raise Enolib.parse(input).field('field').value_error('my static message')
    rescue Enolib::ValidationError => error
      text = 'There is a problem with the value of this element: my static message'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | field: value\n" \
                " *    2 | \\ continuation\n" \
                " *    3 | \\ continuation\n" \
                " *    4 | |\n" \
                " *    5 | \n" \
                ' *    6 | |'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(7)
      expect(error.selection[:to][:line]).to eq(5)
      expect(error.selection[:to][:column]).to eq(1)
    end
  end
end

describe 'Requesting a value error from a field with continuations with a dynamically generated message' do
  it 'raises the expected ValidationError' do
    input = "field: value\n" \
            "\\ continuation\n" \
            "\\ continuation\n" \
            "|\n" \
            "\n" \
            '|'

    begin
      raise(Enolib.parse(input).field('field').value_error { |value| "my generated message for '#{value}'" })
    rescue Enolib::ValidationError => error
      text = 'There is a problem with the value of this element: my generated message for \'value continuation continuation\''
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | field: value\n" \
                " *    2 | \\ continuation\n" \
                " *    3 | \\ continuation\n" \
                " *    4 | |\n" \
                " *    5 | \n" \
                ' *    6 | |'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(7)
      expect(error.selection[:to][:line]).to eq(5)
      expect(error.selection[:to][:column]).to eq(1)
    end
  end
end