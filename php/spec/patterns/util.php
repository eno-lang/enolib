<?php declare(strict_types=1);

function spacingVariants(array $tokens) : array {
  if(count($tokens) > 1) {
    $results = [];

    foreach(spacingVariants(array_slice($tokens, 1)) as $variant) {
      $results[] = "{$tokens[0]}{$variant}";
      $results[] = "   {$tokens[0]}{$variant}";
    }

    return $results;
  } else {
    return [$tokens[0], "   {$tokens[0]}"];
  }
}

function space(...$tokens) : array {
  $tokens[] = '';
  $variants = spacingVariants($tokens);

  return array_unique($variants);
}
