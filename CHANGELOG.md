# Changelog

This project follows semantic versioning.

All enolib implementations across supported languages share the same version number, consequently not every minor or patch version is released for all languages, but only for those affected by the changes.

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
