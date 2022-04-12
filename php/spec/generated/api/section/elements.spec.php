<?php declare(strict_types=1);

describe('Querying all elements from a section', function() {
    it('produces the expected result', function() {
        $input = "# section\n" .
                 "one: value\n" .
                 "two: value";
        
        $output = array_map(function($element) { return $element->stringKey(); } , Enolib\Parser::parse($input)->section('section')->elements());
        
        expect($output)->toEqual(['one', 'two']);
    });
});

describe('Querying elements from a section by key', function() {
    it('produces the expected result', function() {
        $input = "# section\n" .
                 "field: value\n" .
                 "other: one\n" .
                 "other: two";
        
        $output = array_map(function($element) { return $element->requiredStringValue(); } , Enolib\Parser::parse($input)->section('section')->elements('other'));
        
        expect($output)->toEqual(['one', 'two']);
    });
});