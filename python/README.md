# enolib

The cross-language eno standard library

## Installation

```
pip install enolib
```

## Getting started

A minimal example to read an eno document directly from a string with `enolib`:

```python
>>> import enolib
>>> document = enolib.parse('Greeting: Hello World!')
>>> document.field('Greeting').required_string_value()
'Hello World!'
```

## Documentation

Available at [eno-lang.org/enolib](https://eno-lang.org/enolib/).

## Beta notice

enolib is currently in beta, if you encounter any issues please report them in the issue tracker - thank you for your help!

## Compatibility notice

enolib supports the not yet completely ratified [final specification](https://github.com/eno-lang/eno/tree/master/rfcs-final-spec) for eno. You are encouraged to use it in your projects already, thereby helping us to gather insights on whether there are any remaining flaws in the proposed final specifications (you're very welcome to report such issues if you encounter them).

From a practical point of view there are not likely any major changes ahead.  Unless you build your application around edge cases of the exotic language features you should be perfectly safe and future-proof.
