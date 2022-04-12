<?php declare(strict_types=1);

describe('Querying all attributes from a field', function() {
    it('produces the expected result', function() {
        $input = "field:\n" .
                 "1 = 1\n" .
                 "2 = 2";
        
        $output = array_map(
          function($entry) { return $entry->requiredStringValue(); },
          Enolib\Parser::parse($input)->field('field')->attributes()
        );
        
        expect($output)->toEqual(['1', '2']);
    });
});

describe('Querying attributes from a field by key', function() {
    it('produces the expected result', function() {
        $input = "field:\n" .
                 "entry = value\n" .
                 "other = one\n" .
                 "other = two";
        
        $output = array_map(
          function($entry) { return $entry->requiredStringValue(); },
          Enolib\Parser::parse($input)->field('field')->attributes('other')
        );
        
        expect($output)->toEqual(['one', 'two']);
    });
});