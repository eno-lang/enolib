# Changelog

This project follows semantic versioning.

All enolib implementations across supported languages share the same version number, consequently not every minor or patch version is released for all languages, but only for those affected by the changes.

## 0.5.2

## All implementations

- Replace misleading tag_element method naming with tag_children `14e3d59`
- Replace wrong static tag assignment with passed parameter in tag_section `ca7d081`

### Ruby

- Early return, if assignment and misc refactoring in ruby implementation `aa32c16`
- Prefer single to double quotes, line continuation to append in ruby code `1dc2b5f`
- Correct stray ported python or in ruby code `743b5ff`
- Prefer unless over if not in ruby parser code `48182bf`
- Correct various ruby indentation issues `3c223e4`
- Correct missing and surplus spaces in ruby code `9d70b03`
- Use shorthand block method invocation in ruby section implementation `a976078`
- Omit redundant void parentheses on ruby method calls and definitions `3de71cc`
- Omit redundant return in obvious return scenarios `9cae9e1`
- Avoid lazy implementation/checks for unresolved elements in ruby parser `e62c0ce`
- Prefer send operator over scope operator in ruby errors generators `21230fc`
- Fix wrong missing proxy target class instantiation in section accessor `618ecc7`
- Remove redundant value accessor base implementation in field `d169550`
- Freeze all constant arrays, hashes and regexes in ruby implementation `958f650`
- Add frozen_string_literal magic string throughout all ruby files `6a8d44e`

## 0.5.1 (python only)

### Fixes

- Fix faulty checks for lazily defined members in element implementation `b07c035ec`
- Fix mutable default value anti-pattern in python resolver code `844a74c`
- Fix accidental assignment of constant key instead of constant value `541403d`

### Maintenance

- In tests, compare deserialized structure instead of serialized yaml (Massimo Redaelli) `77116b7`
- Remove unused closure in register implementation `ae74ad0`
- Avoid shadowing selection helper in missing value error builder `5e53064`
- Avoid overriding range built-in/clarify arguments in selection helper `ba5462b`
- Simplify simple if/else scenarios with early returns `8a64f31`
- Avoid globally overriding list built-in with module imports `d0e34f5`
- Avoid overriding map built-in in entries/elements access/initialisation `3c9e608d`
- Define obligatory context members at initialization time `35a1b06`
- Remove unneeded python module imports `e882dff`
- Define reusable make target for noise-reduced python linting `7d50200`

## 0.5.0

### Initial release for ruby

### Fixes

- Add missing optional/required empty accessors to missing section proxy `ab43915`

### Python refactoring

- Switch python code to 4 space indentation `31de01a`
- Omit some simple redundant else branches in python implementation `630b7e1`

## 0.4.3

### Fixes

- Fix an UnboundLocalError in python/text_reporter (Clément Pit-Claudel) `c8cfe1e`
- Truncate before substituting newlines when debug printing values `f6a3918`

### Minor optimizations

- Remove redundant member passing when instantiating fieldsets/sections `02a361e`
- Flatten conditional flow in lazy list construction `3988de9`
- Remove superfluous forward declaration in python text reporter `1504d55`

### Maintenance

- Replace soft-deprecated substr uses with core javascript substring calls `ec6485a`

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
