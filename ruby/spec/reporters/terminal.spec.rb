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

describe Enolib::TerminalReporter do
  it 'produces colored terminal output' do
    document = Enolib.parse(input, reporter: Enolib::TerminalReporter)
    context = document.instance_variable_get(:@context)

    reporter = context.reporter.new(context)
    snippet = reporter.report_element(context.document[:elements].first).snippet()

    # Uncomment to inspect
    # puts snippet

    expect(snippet).to match_snapshot
  end
end
