# frozen_string_literal: true

describe 'Expecting lists but getting a field' do
  it 'raises the expected ValidationError' do
    input = 'field: value'

    begin
      Enolib.parse(input).lists('field')
    rescue Enolib::ValidationError => error
      expect(error).to be_a(Enolib::ValidationError)
      
      text = 'Only lists with the key \'field\' were expected.'
      
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

describe 'Expecting lists but getting a field with continuations' do
  it 'raises the expected ValidationError' do
    input = "field:\n" \
            "| continuation\n" \
            '| continuation'

    begin
      Enolib.parse(input).lists('field')
    rescue Enolib::ValidationError => error
      expect(error).to be_a(Enolib::ValidationError)
      
      text = 'Only lists with the key \'field\' were expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | field:\n" \
                " *    2 | | continuation\n" \
                ' *    3 | | continuation'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(2)
      expect(error.selection[:to][:column]).to eq(14)
    end
  end
end

describe 'Expecting lists but getting a field with continuations separated by idle lines' do
  it 'raises the expected ValidationError' do
    input = "field: value\n" \
            "| continuation\n" \
            "| continuation\n" \
            "\n" \
            "> comment\n" \
            '| continuation'

    begin
      Enolib.parse(input).lists('field')
    rescue Enolib::ValidationError => error
      expect(error).to be_a(Enolib::ValidationError)
      
      text = 'Only lists with the key \'field\' were expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | field: value\n" \
                " *    2 | | continuation\n" \
                " *    3 | | continuation\n" \
                " *    4 | \n" \
                " *    5 | > comment\n" \
                ' *    6 | | continuation'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(5)
      expect(error.selection[:to][:column]).to eq(14)
    end
  end
end