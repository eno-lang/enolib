# frozen_string_literal: true

describe 'Expecting fieldsets but getting an empty section' do
  it 'raises the expected ValidationError' do
    input = '# section'

    begin
      Enolib.parse(input).fieldsets('section')
    rescue Enolib::ValidationError => error
      text = 'Only fieldsets with the key \'section\' were expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                ' >    1 | # section'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(9)
    end
  end
end

describe 'Expecting fieldsets but getting a section with a field and a list' do
  it 'raises the expected ValidationError' do
    input = "# section\n" \
            "\n" \
            "field: value\n" \
            "\n" \
            "list:\n" \
            "- item\n" \
            '- item'

    begin
      Enolib.parse(input).fieldsets('section')
    rescue Enolib::ValidationError => error
      text = 'Only fieldsets with the key \'section\' were expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | # section\n" \
                " *    2 | \n" \
                " *    3 | field: value\n" \
                " *    4 | \n" \
                " *    5 | list:\n" \
                " *    6 | - item\n" \
                ' *    7 | - item'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(6)
      expect(error.selection[:to][:column]).to eq(6)
    end
  end
end

describe 'Expecting fieldsets but getting a section with subsections' do
  it 'raises the expected ValidationError' do
    input = "# section\n" \
            "\n" \
            "## subsection\n" \
            "\n" \
            "field: value\n" \
            "\n" \
            "## subsection\n" \
            "\n" \
            "list:\n" \
            "- item\n" \
            '- item'

    begin
      Enolib.parse(input).fieldsets('section')
    rescue Enolib::ValidationError => error
      text = 'Only fieldsets with the key \'section\' were expected.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " >    1 | # section\n" \
                " *    2 | \n" \
                " *    3 | ## subsection\n" \
                " *    4 | \n" \
                " *    5 | field: value\n" \
                " *    6 | \n" \
                " *    7 | ## subsection\n" \
                " *    8 | \n" \
                " *    9 | list:\n" \
                " *   10 | - item\n" \
                ' *   11 | - item'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(10)
      expect(error.selection[:to][:column]).to eq(6)
    end
  end
end