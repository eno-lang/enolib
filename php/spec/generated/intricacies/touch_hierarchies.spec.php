<?php declare(strict_types=1);

describe('Touching elements in a section that were copied from another section does not touch the original elements', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "# section\n" .
             "field: value\n" .
             "\n" .
             "# copy < section";

    try {
      $document = Enolib\Parser::parse($input);
      
      document->section('section')->stringKey();
      document->section('copy')->field('field')->stringKey();
      
      document->assertAllTouched();
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "This element was not expected, make sure it is at the right place in the document and that its key is not mis-typed.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               "      1 | # section\n" .
               " >    2 | field: value\n" .
               "      3 | \n" .
               "      4 | # copy < section";
    
    expect($error->snippet)->toEqual($snippet);
    
    expect($error->selection['from']['line'])->toEqual(1);
    expect($error->selection['from']['column'])->toEqual(0);
    expect($error->selection['to']['line'])->toEqual(1);
    expect($error->selection['to']['column'])->toEqual(12);
  });
});