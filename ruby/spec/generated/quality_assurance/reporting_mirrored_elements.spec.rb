# frozen_string_literal: true

describe 'Touching elements in a section that were copied from another section does not touch the original elements' do
  it 'raises the expected ValidationError' do
    input = "field: value\n" \
            "\n" \
            "mirrored_field < field\n" \
            "\n" \
            "fieldset:\n" \
            "1 = 1\n" \
            "2 = 2\n" \
            "\n" \
            "mirrored_fieldset < fieldset\n" \
            "\n" \
            "list:\n" \
            "- 1\n" \
            "- 2\n" \
            "\n" \
            "mirrored_list < list\n" \
            "\n" \
            "# section\n" \
            "\n" \
            '# mirrored_section < section'

    begin
      document = Enolib.parse(input)
      
      document.required_field('missing')
    rescue Enolib::ValidationError => error
      text = 'The field \'missing\' is missing - in case it has been specified look for typos and also check for correct capitalization.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                " ?    1 | field: value\n" \
                " ?    2 | \n" \
                " ?    3 | mirrored_field < field\n" \
                " ?    4 | \n" \
                " ?    5 | fieldset:\n" \
                " ?    6 | 1 = 1\n" \
                " ?    7 | 2 = 2\n" \
                " ?    8 | \n" \
                " ?    9 | mirrored_fieldset < fieldset\n" \
                " ?   10 | \n" \
                " ?   11 | list:\n" \
                " ?   12 | - 1\n" \
                " ?   13 | - 2\n" \
                " ?   14 | \n" \
                " ?   15 | mirrored_list < list\n" \
                " ?   16 | \n" \
                " ?   17 | # section\n" \
                " ?   18 | \n" \
                ' ?   19 | # mirrored_section < section'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(0)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(0)
      expect(error.selection[:to][:column]).to eq(0)
    end
  end
end