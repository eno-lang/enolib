<?php declare(strict_types=1);

namespace Eno;
use \OutOfRangeException;
use Eno\{Analyzer,Messages,Resolver,Section,Tokenizer};
use Eno\Reporters\Reporter;

class Parser {
  public static function parse(string $input, array $options = []) : Section {
    $default_options = [
      'locale' => new Messages\En,
      'reporter' => new Reporters\Text,
      'source_label' => null,
      'zero_indexing' => false
    ];

    $options = array_merge($default_options, $options);


    $context = (object) [
      'locale' => $options['locale'],
      'indexing' => $options['zero_indexing'] ? 0 : 1,
      'input' => $input,
      'messages' => $options['locale'],
      'reporter' => $options['reporter'],
      'source_label' => $options['source_label']
    ];

    (new Tokenizer($context))->tokenize();
    (new Analyzer($context))->analyze();
    (new Resolver($context))->resolve();

    $context->document = new Section($context, $context->document_instruction);

    return $context->document;
  }
}
