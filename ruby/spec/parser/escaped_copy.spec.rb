input = <<~DOC.strip
template:
`key`<template
``k`ey`` < template
```ke``y```     < template
    `` `key` ``     < template
DOC

describe Enolib::Parser do
  describe 'Escaped copies' do
    context = Enolib::Context.new(input)

    it 'parses as expected' do
      expect(context.document).to match_snapshot
    end
  end
end
