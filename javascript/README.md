# enolib

JavaScript library for parsing, loading and inspecting eno documents

## Prerelease notice

enolib supports the not yet ratified [final specification](https://github.com/eno-lang/eno/tree/master/rfcs-final-spec) for eno. You are however much encouraged to use it in your projects already, this helps us all to gather insights on whether there are any remaining flaws in the proposed final specifications (you're very welcome to report such issues if you encounter them).

Also, asides the formal specification perspective and from a practical point of view there are not likely any major changes ahead, so unless you build your application around edge cases of the most exotic features in the language you should be perfectly safe and future-proof as well.

## Beta notice

enolib for javascript was just released, there is only JSDoc based reference documentation which however isn't yet published - expect updates in the coming days. Automated testing coverage is already at around 85% but it's still likely you will run into critical bugs here or there, you're welcome to report them in the issue tracker - thank you for your help.

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

const document = enolib.parse(input);

console.log( document.field('Greeting').requiredStringValue() );  // prints 'Hello World!'
```
