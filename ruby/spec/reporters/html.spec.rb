# frozen_string_literal: true

input = <<~DOC.strip
> comment
# section

field: value

field_with_items:
- item
- item

> comment
- item

## subsection

field_with_attributes:
attribute = value

> comment
attribute = value
DOC

describe Enolib::HtmlReporter do
  it 'produces html output' do
    document = Enolib.parse(input, reporter: Enolib::HtmlReporter)
    context = document.instance_variable_get(:@context)

    reporter = context.reporter.new(context)
    snippet = reporter.report_element(context.document[:elements].first).snippet()

    expect(snippet).to match_snapshot
  end
end
