<?php declare(strict_types=1);

use Eno\Tokenizer;

function inspectTokenization($input) {
  $context = (object) [ 'input' => $input ];

  (new Tokenizer($context))->tokenize();

  return $context->instructions;
};
