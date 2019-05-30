# frozen_string_literal: true

describe 'Multiple sections with multiple cyclical copy chains' do
  it 'raises the expected ParseError' do
    input = "# section_1 < section_2\n" \
            "field: value\n" \
            "\n" \
            "## subsection_1 < subsection_2\n" \
            "field: value\n" \
            "\n" \
            "# section_2 < section_1\n" \
            "field: value\n" \
            "\n" \
            "## subsection_2 < section_1\n" \
            'field: value'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'In line 10 \'section_1\' is copied into itself.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " *    1 | # section_1 < section_2\n" \
                "      2 | field: value\n" \
                "      3 | \n" \
                " *    4 | ## subsection_1 < subsection_2\n" \
                "      5 | field: value\n" \
                "      6 | \n" \
                "   ...\n" \
                "      8 | field: value\n" \
                "      9 | \n" \
                " >   10 | ## subsection_2 < section_1\n" \
                '     11 | field: value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(9)
      expect(error.selection[:from][:column]).to eq(18)
      expect(error.selection[:to][:line]).to eq(9)
      expect(error.selection[:to][:column]).to eq(27)
    end
  end
end

describe 'Three empty elements copying each other, two of them cyclically' do
  it 'raises the expected ParseError' do
    input = "copy < empty\n" \
            "empty < cyclic\n" \
            'cyclic < empty'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'In line 3 \'empty\' is copied into itself.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                "      1 | copy < empty\n" \
                " *    2 | empty < cyclic\n" \
                ' >    3 | cyclic < empty'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(2)
      expect(error.selection[:from][:column]).to eq(9)
      expect(error.selection[:to][:line]).to eq(2)
      expect(error.selection[:to][:column]).to eq(14)
    end
  end
end

describe 'Three sections with one being copied into its own subsection' do
  it 'raises the expected ParseError' do
    input = "# section\n" \
            "## copied_subsection < section\n" \
            '# copied_section < section'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'In line 2 \'section\' is copied into itself.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " *    1 | # section\n" \
                " >    2 | ## copied_subsection < section\n" \
                '      3 | # copied_section < section'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(1)
      expect(error.selection[:from][:column]).to eq(23)
      expect(error.selection[:to][:line]).to eq(1)
      expect(error.selection[:to][:column]).to eq(30)
    end
  end
end

describe 'Three sections with one being copied into its own subsubsection' do
  it 'raises the expected ParseError' do
    input = "# section\n" \
            "## subsection\n" \
            '### copied_subsubsection < section'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'In line 3 \'section\' is copied into itself.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " *    1 | # section\n" \
                " *    2 | ## subsection\n" \
                ' >    3 | ### copied_subsubsection < section'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(2)
      expect(error.selection[:from][:column]).to eq(27)
      expect(error.selection[:to][:line]).to eq(2)
      expect(error.selection[:to][:column]).to eq(34)
    end
  end
end

describe 'Two fieldsets mutually copying each other' do
  it 'raises the expected ParseError' do
    input = "copy < fieldset\n" \
            "entry = value\n" \
            "\n" \
            "fieldset < copy\n" \
            'entry = value'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'In line 4 \'copy\' is copied into itself.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " *    1 | copy < fieldset\n" \
                "      2 | entry = value\n" \
                "      3 | \n" \
                " >    4 | fieldset < copy\n" \
                '      5 | entry = value'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(3)
      expect(error.selection[:from][:column]).to eq(11)
      expect(error.selection[:to][:line]).to eq(3)
      expect(error.selection[:to][:column]).to eq(15)
    end
  end
end

describe 'Two lists mutually copying each other' do
  it 'raises the expected ParseError' do
    input = "copy < list\n" \
            "- item\n" \
            "\n" \
            "list < copy\n" \
            '- item'

    begin
      Enolib.parse(input)
    rescue Enolib::ParseError => error
      text = 'In line 4 \'copy\' is copied into itself.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " *    1 | copy < list\n" \
                "      2 | - item\n" \
                "      3 | \n" \
                " >    4 | list < copy\n" \
                '      5 | - item'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(3)
      expect(error.selection[:from][:column]).to eq(7)
      expect(error.selection[:to][:line]).to eq(3)
      expect(error.selection[:to][:column]).to eq(11)
    end
  end
end