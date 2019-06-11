# enolib

The eno standard library.

## Installation

### Bundler

Add `enolib` to your `Gemfile`:

```ruby
gem 'enolib'
```
Then let bundler install it for you:

```
bundle
```

### Manually

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

Available at [eno-lang.org/enolib](https://eno-lang.org/enolib/).
