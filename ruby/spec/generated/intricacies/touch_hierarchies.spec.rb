# frozen_string_literal: true

describe 'Touching elements in a section that were copied from another section does not touch the original elements' do
  it 'raises the expected ValidationError' do
    input = "# section\n" \
            "field: value\n" \
            "\n" \
            '# copy < section'

    begin
      document = Enolib.parse(input)
      
      document.section('section').string_key
      document.section('copy').field('field').string_key
      
      document.assert_all_touched
    rescue Enolib::ValidationError => error
      text = 'This element was not expected, make sure it is at the right place in the document and that its key is not mis-typed.'
      
      expect(error.text).to eq(text)
      
      snippet = "   Line | Content\n" \
                "      1 | # section\n" \
                " >    2 | field: value\n" \
                "      3 | \n" \
                '      4 | # copy < section'
      
      expect(error.snippet).to eq(snippet)
      
      expect(error.selection[:from][:line]).to eq(1)
      expect(error.selection[:from][:column]).to eq(0)
      expect(error.selection[:to][:line]).to eq(1)
      expect(error.selection[:to][:column]).to eq(12)
    end
  end
end