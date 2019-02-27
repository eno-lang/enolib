input = <<~DOC.strip
template:
key<template
key<<template
key < template
key << template
key     < template
key     << template
     key      < template
     key      << template
DOC

describe Enolib::Parser do
  describe 'Copy operations' do
    context = Enolib::Context.new(input)

    it 'parses as expected' do
      expect(context.document).to match_snapshot
    end
  end
end
