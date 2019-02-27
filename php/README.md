# enophp

PHP library for parsing, loading and inspecting eno documents

## Installation

    composer require eno-lang/enophp

## Getting started

Create an eno document, for instance `intro.eno`:

```eno
Greeting: Hello World!
```

A minimal example to read this file with `enophp`:

```php
use Eno\Parser;

$input = file_get_contents('intro.eno');

$document = Parser::parse($input);

echo( $document->field('Greeting') );  // prints 'Hello World!'
```

## Complete documentation and API reference

See [eno-lang.org/php](https://eno-lang.org/php/)
