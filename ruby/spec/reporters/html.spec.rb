# frozen_string_literal: true

input = <<~DOC.strip
> comment
# section

field: value

list:
- item
- item

> comment
- item

## subsection

fieldset:
entry = value

> comment
entry = value
DOC

describe Enolib::HtmlReporter do
  it 'produces html output' do
    document = Enolib.parse(input, reporter: Enolib::HtmlReporter)
    context = document.instance_variable_get(:@context)

    snippet = context.reporter.new(context)
                              .report_element(context.document[:elements].first)
                              .snippet()

    expect(snippet).to match_snapshot
  end
end
