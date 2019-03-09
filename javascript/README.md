# enolib

JavaScript library for parsing, loading and inspecting eno documents

## Prerelease notice

enolib supports the not yet ratified [final specification](https://github.com/eno-lang/eno/tree/master/rfcs-final-spec) for eno. You are however much encouraged to use it in your projects already, this helps us all to gather insights on whether there are any remaining flaws in the proposed final specifications (you're very welcome to report such issues if you encounter them).

Also, asides the formal specification perspective and from a practical point of view there are not likely any major changes ahead, so unless you build your application around edge cases of the most exotic features in the language you should be perfectly safe and future-proof as well.

## Beta notice

enolib for javascript is currently in beta. Automated testing coverage is already at around 85% but it's still likely you will run into critical bugs here or there, you're welcome to report them in the issue tracker - thank you for your help.

Early work in progress documentation is now available at https://eno-lang.org/enolib/.

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
