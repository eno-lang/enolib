<?php declare(strict_types=1);

use Eno\{Analyzer,Tokenizer};

function inspectAnalysis($input) {
  $context = (object) [ 'input' => $input ];

  (new Tokenizer($context))->tokenize();
  (new Analyzer($context))->analyze();

  return $context->instructions;
};
