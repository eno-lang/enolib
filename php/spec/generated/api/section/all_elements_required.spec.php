<?php declare(strict_types=1);

describe('Querying a missing field on the document when all elements are required', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "";

    try {
      $document = Enolib\Parser::parse($input);
      
      $document->allElementsRequired();
      $document->field('field');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "The field 'field' is missing - in case it has been specified look for typos and also check for correct capitalization.";
    
    expect($error->text)->toEqual($text);
  });
});

describe('Querying a missing fieldset on the document when all elements are required', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "";

    try {
      $document = Enolib\Parser::parse($input);
      
      $document->allElementsRequired();
      $document->fieldset('fieldset');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "The fieldset 'fieldset' is missing - in case it has been specified look for typos and also check for correct capitalization.";
    
    expect($error->text)->toEqual($text);
  });
});

describe('Querying a missing list on the document when all elements are required', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "";

    try {
      $document = Enolib\Parser::parse($input);
      
      $document->allElementsRequired();
      $document->list('list');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "The list 'list' is missing - in case it has been specified look for typos and also check for correct capitalization.";
    
    expect($error->text)->toEqual($text);
  });
});

describe('Querying a missing section on the document when all elements are required', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "";

    try {
      $document = Enolib\Parser::parse($input);
      
      $document->allElementsRequired();
      $document->section('section');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "The section 'section' is missing - in case it has been specified look for typos and also check for correct capitalization.";
    
    expect($error->text)->toEqual($text);
  });
});

describe('Querying a missing field on the document when requiring all elements is explicitly disabled', function() {
  it('produces the expected result', function() {
    $input = "";

    $document = Enolib\Parser::parse($input);
    
    $document->allElementsRequired(false);
    $document->field('field');

    expect('it passes')->toBeTruthy();
  });
});

describe('Querying a missing field on the document when requiring all elements is enabled and disabled again', function() {
  it('produces the expected result', function() {
    $input = "";

    $document = Enolib\Parser::parse($input);
    
    $document->allElementsRequired(true);
    $document->allElementsRequired(false);
    $document->field('field');

    expect('it passes')->toBeTruthy();
  });
});