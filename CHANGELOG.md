# Changelog

This project follows semantic versioning.

All enolib implementations across supported languages share the same version number, consequently not every minor or patch version is released for all languages, but only for those affected by the changes.

## 0.4.2

### Fixes

- Add missing begin/end alias imports in python analyzer `2e5c002`
- Fix swapped copy operator range assignment in python analyzer `2c4cde0`

### Minor optimizations

- Remove redundant input length check in python analyzer `30e07e79`
- Assign conditional unescaped key matches directly to instructions `8119c66`

### Internals

- Use more concrete variable names in resolver code `b5ae240`
- Use begin/end index aliases in python analyzer section depth calculation `b3fc565`

## 0.4.1

### Fixes

- Omit missing keys in debug string representations of missing elements `653c4ea`
- Handle section hierarchy layer skips without a super section `3e277531`

### Python package

- Add libraries topic to python package definition `b55b5ba`
- Add python readme documentation link `4f7f3c5`

## 0.4.0

### Initial release for python

## 0.3.5

### Fixes

- Fix wrongly assigned items computation in context implementation `d54eaef`

### Minor optimizations

- Inline document root section instantiation inside parse entrypoint `abe9eaa`
- Remove superfluous map option for context elements/entries computation `0e52fb9`
- Remove unneeded argument defaults and returns in entries instantiation `a7f44e9`

## 0.3.4

### Fixes

- Add missing type checks in section element yields* determination `3ebd1ff`
- Fix non-reassignable variable in TerminalReporter constructor `7e3b558`
- Fix missing or falsely referenced element modules `1f97c9d`

### Minor optimizations

- Remove unused column context in line-based instruction lookups `42b5d48`
- Only iterate line numbers in reporter snippet processing `364124c`
- Remove unused key iteration in javascript resolver code `5416dfc`
- Miscellaneous minor refactoring inside the javascript implementation `e7ffff7`
- Remove unused requires throughout the javascript implementation `415f1f4`

### Refactoring

- Use more readable flow patterns in the javascript analyzer code `7d0159b`

## 0.3.3

### Fixes

- Fix wrong falsey return type for document key queries `3a6801e`
- Fix invalid element accesses and unused requires in lookup code `ec14255`

### Quality assurance

- Switch to exhaustive lookup testing over the full sample document range `949dd19`

## 0.3.2

### Fixes

- Add missing require for Section instantiation in Empty `b5febb1`
- Add missing empty accessor in MissingSection `80d12e1`
- Remove redundant valueError definition in Field implementation `4f7ad12`

### Internals

- Use early return in context value construction to reduce indentation `5538686`

## 0.3.1

### Fixes

- Fix begin/end index lookup edge cases `95fe0f8`

### Specification compliance

- Remove noop deep-copy operator support for non-section elements `dd3eeaa`

### Internals

-  Simplify element class layout, split element folder layout `23787f1`

### Documentation

- Merge in existing JSDoc documentation `6f594fc`

### Maintenance

- Update jest `98a9bf6`

## 0.3.0

### Features

- Implement unique isolated touch hierarchies `1d5f47e`

### Maintenance

- Update jest `7f78d3a`
- Use enolib global in all specs `590cb71`

## 0.2.0

### Features

- Introduce ambiguous element proxies and low level context abstractions `9df14d4`
- Add key-less typed accessors and new message layout to make it possible `372002b`
- Introduce new terminal report design `5697c35`

### Internals

- Adopt new internal document and empty element constants `2ec16ec`

### Maintenance

- Use enotype from npm, fix legacy sourceLabel option used in generators `db719c2`

## 0.1.1

### Features

- Implement querying heterogeneously-typed section elements by key `7324cce`
- Implement querying multiple fieldset entries by key `ce47c4f`

### Fixes

- Extend token coverage for draft highlighting in terminal reporter `7620109`
- Fix html reporter surplus line breaks, improve separation of concerns `ee2ce6d`

### Documentation

- Correct enolib handle in getting started snippet `fc5541c`
- Disable esdoc syntax tree generation `d3a490c`

## 0.1.0

### Initial release for javascript
