<?php declare(strict_types=1);

describe('Querying existing required string values from a field with items', function() {
    it('produces the expected result', function() {
        $input = "field:\n" .
                 "- item\n" .
                 "- item";
        
        $output = Enolib\Parser::parse($input)->field('field')->requiredStringValues();
        
        expect($output)->toEqual(['item', 'item']);
    });
});

describe('Querying existing optional string values from a field with items', function() {
    it('produces the expected result', function() {
        $input = "field:\n" .
                 "- item\n" .
                 "- item";
        
        $output = Enolib\Parser::parse($input)->field('field')->optionalStringValues();
        
        expect($output)->toEqual(['item', 'item']);
    });
});

describe('Querying missing optional string values from a field with items', function() {
    it('produces the expected result', function() {
        $input = "field:\n" .
                 "-\n" .
                 "-";
        
        $output = Enolib\Parser::parse($input)->field('field')->optionalStringValues();
        
        expect($output)->toEqual([null, null]);
    });
});