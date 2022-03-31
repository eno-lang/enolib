# locales

This directory maintains the canonical, translated message catalog that is utilized across all enolib implementations across different (programming-)languages. These messages are by about 90% made up of the errors that can occur during tokenization, analysis and validation of an eno document. The remaining 10% are separate strings that name the elements of an eno document as well as miscellaneous labels used by the error reporters.

## Prerequisites for making changes

1. Install node from https://nodejs.org
2. Run `npm install` in the parent directory to install library dependencies

## How to add new locales

1. Add the locale code and name to the list in `specification.eno`
2. Run `npm run locales` in the parent directory (A `.po` file for your locale will be created in the  `/translations/` directory)
3. Translate all messages in your newly created `.po` file
4. Run `npm run locales` in the parent directory again, this adds your translations to the generated message catalogs inside the implementation directories
5. If you missed any translations, the update script will inform you with a warning.

## How to update existing locales

1. Open `[locale-code].po` in the `translations/` directory
2. Make the changes
3. Run `npm run locales` in the parent directory, this adds your changes to the generated catalogs

## How to add a new catalog for a not yet supported programming language

Duplicate one of the generators in `generators/*` and adapt it, also add a call to the new generator at the bottom of `generate.js`. Then run and re-run `npm run locales` and tweak your generator until the result meets your needs. If you don't feel comfortable editing javascript, you can alternatively open an issue and provide a template of what kind of code your eno implementation in language X requires (variable casing, object hierarchy, block/lambda/function syntax required should be made clear), and wait for a kind soul to do the work.

## How to add/update messages, e.g. introducing a new type of error

In coordination with the other implementations: Changing or adding messages means that the various implementations of enolib need to be updated to reflect the new specification, so this is something that will affect everyone, and thus should be discussed.

Starting point: Document and explain your plans, open an issue on github, contact the maintainer(s), basically ... get in touch, and have something to show.

## File overview for this repository

`generators/*.js`

These generator scripts are called by the `generate.js` script to generate the catalog code for all supported programming languages.

`translations/*.po`

Inside the `translations/` directory you can find the actual translations for each locale in [gettext](https://en.wikipedia.org/wiki/Gettext) `.po` format. These files are both automatically generated/updated by the `generate.js` script, as well as manually filled by the translators.

`specification.eno`

On the one hand this contains the list of all locales currently available to enolib implementations. On the other hand and more importantly, this is the central specification of messages for enolib implementations, alongside their english reference translation. This part is (rarely) manually edited to add, update or remove messages, after which the changes to the specification should be subsequentially picked up by the various implementations.

`generate.js`

This script reads all specified locales and messages from `specification.eno`, creates `.po` files for all locales that are not yet present in the `translations/` directory, adds missing `msgstr` and `msgid` entries to already existing `.po` files and removes those translations from `.po` files that are no longer present in the specification. It also generates the final catalog code in the various implementation directories. Execute `node generate.js` inside this or `npm run locales` inside the parent directory to run the script.
