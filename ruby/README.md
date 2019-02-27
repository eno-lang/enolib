# enolib

The cross-language eno standard library

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

Until available please use the javascript or python documentation at [eno-lang.org/enolib](https://eno-lang.org/enolib/) and replace all shown syntax with the ruby equivalent (ie. different case for the most part) - except for language specifics the API is exactly the same for all implementations.

## Beta notice

enolib is currently in beta, if you encounter any issues please report them in the issue tracker - thank you for your help!

## Compatibility notice

enolib supports the not yet completely ratified [final specification](https://github.com/eno-lang/eno/tree/master/rfcs-final-spec) for eno. You are encouraged to use it in your projects already, thereby helping us to gather insights on whether there are any remaining flaws in the proposed final specifications (you're very welcome to report such issues if you encounter them).

From a practical point of view there are not likely any major changes ahead.  Unless you build your application around edge cases of the exotic language features you should be perfectly safe and future-proof.
