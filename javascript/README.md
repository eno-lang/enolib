# enolib

An eno parsing library.

## Installation

```
npm install enolib
```

## Getting started

A minimal example to read an eno document directly from a string with `enolib`:

```js
import { parse } from 'enolib';

const document = parse('Greeting: Hello World');

console.log( document.field('Greeting').requiredStringValue() );  // prints 'Hello World!'
```

## Documentation

Available at [eno-lang.org/javascript](https://eno-lang.org/javascript/).

## Development tools

First run `npm i` to install all development dependencies, then you can:

- Run the testsuite (interactive/watchmode): `npm test`
- Lint the codebase: `npm run lint`
- Generate documentation: `npm run docs`
- Benchmark performance:
  - `npm run benchmark-reset` (before changes)
  - `npm run benchmark-compare` (after changes)
