# enolib

The cross-language eno standard library

## Installation

```
npm install enolib
```

## Getting started

A minimal example to read an eno document directly from a string with `enolib`:

```js
const enolib = require('enolib');

const document = enolib.parse('Greeting: Hello World');

console.log( document.field('Greeting').requiredStringValue() );  // prints 'Hello World!'
```

## Documentation

Available at [eno-lang.org/enolib](https://eno-lang.org/enolib/).
