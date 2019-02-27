<?php declare(strict_types=1);

use Eno\{ParseError, ValidationError};

function interceptParseError(callable $callback) : ParseError {
  $error = null;

  try {
    $callback();
  } catch(ParseError $e) {
    $error = $e;
  }

  if($error === null) {
    throw new Exception('No ParseError was thrown, although it should have been!');
  }

  return $error;
}

function interceptValidationError(callable $callback) : ValidationError {
  $error = null;

  try {
    $callback();
  } catch(ValidationError $e) {
    $error = $e;
  }

  if($error === null) {
    throw new Exception('No ValidationError was thrown, although it should have been!');
  }

  return $error;
}
