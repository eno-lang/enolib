# frozen_string_literal: true

describe 'Expecting a fieldset but getting two fieldsets' do
  it 'raises the expected ValidationError' do
    input = "fieldset:\n" \
            "entry = value\n" \
            "fieldset:\n" \
            'entry = value'

    begin
      Enolib.parse(input).fieldset('fieldset')
    rescue Enolib::ValidationError => error
      text = 'Only a single fieldset with the key \'fieldset\' was expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | fieldset:\n" \
                " *    2 | entry = value\n" \
                " >    3 | fieldset:\n" \
                ' *    4 | entry = value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(1)
      expect(error.selection[:to][:column]).to eq(13)
    end
  end
end

describe 'Expecting a fieldset but getting two fieldsets with comments, empty lines and continuations' do
  it 'raises the expected ValidationError' do
    input = "> comment\n" \
            "fieldset:\n" \
            "entry = value\n" \
            "\n" \
            "entry = value\n" \
            "\n" \
            "fieldset:\n" \
            "> comment\n" \
            'entry = value'

    begin
      Enolib.parse(input).fieldset('fieldset')
    rescue Enolib::ValidationError => error
      text = 'Only a single fieldset with the key \'fieldset\' was expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                "      1 | > comment\n" \
                " >    2 | fieldset:\n" \
                " *    3 | entry = value\n" \
                " *    4 | \n" \
                " *    5 | entry = value\n" \
                "      6 | \n" \
                " >    7 | fieldset:\n" \
                " *    8 | > comment\n" \
                ' *    9 | entry = value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(1)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(4)
      expect(error.selection[:to][:column]).to eq(13)
    end
  end
end