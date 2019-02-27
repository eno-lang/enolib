# enolib

JavaScript library for parsing, loading and inspecting eno documents

## Installation

```
npm install enolib
```

## Getting started

Create an eno document, for instance `intro.eno`:

```eno
Greeting: Hello World!
```

A minimal example to read this file with `enolib`:

```js
const enolib = require('enolib');
const fs = require('fs');

const input = fs.readFileSync('intro.eno', 'utf-8');

const document = eno.parse(input);

console.log( document.field('Greeting').requiredStringValue() );  // prints 'Hello World!'
```

## Complete documentation and API reference

See [eno-lang.org/javascript](https://eno-lang.org/javascript/)
