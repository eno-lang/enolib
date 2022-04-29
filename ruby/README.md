# enolib

An eno parsing library.

## Installation

Add enolib to your `Gemfile`:

```ruby
gem 'enolib'
```
Then let bundler install it for you:

```
bundle
```

Alternatively you can also install it manually:

```
gem install enolib
```

## Getting started

A minimal example to read an eno document directly from a string with `enolib`:

```ruby
require 'enolib'

document = Enolib.parse('Greeting: Hello World!')

puts document.field('Greeting').required_string_value  #=> 'Hello World!'
```

## Documentation

Available at [eno-lang.org/ruby](https://eno-lang.org/ruby/).

## Development tools

First run `bundle install` to install all development dependencies, then you can:

- Execute the testsuite: `rspec`
- Lint the codebase: `rubocop`
- Obtain performance metrics before/after changes: `ruby performance/benchmark.rb`
