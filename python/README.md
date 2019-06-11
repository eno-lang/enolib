# enolib

The eno standard library.

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
