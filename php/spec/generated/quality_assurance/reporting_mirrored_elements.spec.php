<?php declare(strict_types=1);

describe('Touching elements in a section that were copied from another section does not touch the original elements', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "field: value\n" .
             "\n" .
             "mirrored_field < field\n" .
             "\n" .
             "fieldset:\n" .
             "1 = 1\n" .
             "2 = 2\n" .
             "\n" .
             "mirrored_fieldset < fieldset\n" .
             "\n" .
             "list:\n" .
             "- 1\n" .
             "- 2\n" .
             "\n" .
             "mirrored_list < list\n" .
             "\n" .
             "# section\n" .
             "\n" .
             "# mirrored_section < section";

    try {
      $document = Enolib\Parser::parse($input);
      
      document->requiredField('missing');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "The field 'missing' is missing - in case it has been specified look for typos and also check for correct capitalization.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " ?    1 | field: value\n" .
               " ?    2 | \n" .
               " ?    3 | mirrored_field < field\n" .
               " ?    4 | \n" .
               " ?    5 | fieldset:\n" .
               " ?    6 | 1 = 1\n" .
               " ?    7 | 2 = 2\n" .
               " ?    8 | \n" .
               " ?    9 | mirrored_fieldset < fieldset\n" .
               " ?   10 | \n" .
               " ?   11 | list:\n" .
               " ?   12 | - 1\n" .
               " ?   13 | - 2\n" .
               " ?   14 | \n" .
               " ?   15 | mirrored_list < list\n" .
               " ?   16 | \n" .
               " ?   17 | # section\n" .
               " ?   18 | \n" .
               " ?   19 | # mirrored_section < section";
    
    expect($error->snippet)->toEqual($snippet);
    
    expect($error->selection['from']['line'])->toEqual(0);
    expect($error->selection['from']['column'])->toEqual(0);
    expect($error->selection['to']['line'])->toEqual(0);
    expect($error->selection['to']['column'])->toEqual(0);
  });
});