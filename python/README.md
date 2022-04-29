# enolib

An eno parsing library.

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

Available at [eno-lang.org/python](https://eno-lang.org/python/).

## Development tools

First run `pip -r requirements-dev.txt` to install the development dependencies, then you can:

- Run the testsuite: `pytest`
- Lint the codebase: `pylint enolib/`
- Benchmark performance:
  - `python performance/benchmark.py reset` (before changes)
  - `python performance/benchmark.py` (after changes)


