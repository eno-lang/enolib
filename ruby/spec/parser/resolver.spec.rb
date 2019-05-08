# frozen_string_literal: true

input = <<~DOC.strip
language field: eno notation language

language < language field

-- language block
eno notation language
-- language block

language < language block

language list:
- eno
- json
- yaml

languages < language list

languages fieldset:
eno = error notation
json = javascript object notation

languages fieldset corrected < languages fieldset
eno = eno notation

# languages section

eno: error notation
json: javascript object notation

# languages section corrected < languages section

eno: eno notation

# languages deep section

## eno

name:
short = err
long = error notation

## json

name:
short = json
long = javascript object notation

# languages deep section corrected and extended << languages deep section

## eno

name:
short = eno
long = eno notation

## yaml

name:
short = yaml
long = yaml ain't markup language
DOC

describe Enolib::Parser do
  it 'resolves dependencies without error' do
    expect(Enolib.parse(input).raw).to match_snapshot
  end
end
