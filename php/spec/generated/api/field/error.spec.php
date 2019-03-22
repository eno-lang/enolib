<?php declare(strict_types=1);

describe('Obtaining and throwing an error with a custom message in the context of a field', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "field: value";

    try {
      throw Enolib\Parser::parse($input)->field('field')->error('my message');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "my message";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | field: value";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[0,0], [0,12]];
    
    expect($error->selection)->toEqual($selection);
  });
});

describe('Obtaining and throwing an error with a custom generated message in the context of a field', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "field: value";

    try {
      throw Enolib\Parser::parse($input)->field('field')->error(function($field) { return "my generated message for field '{$field->stringKey()}'"; });
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "my generated message for field 'field'";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | field: value";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[0,0], [0,12]];
    
    expect($error->selection)->toEqual($selection);
  });
});