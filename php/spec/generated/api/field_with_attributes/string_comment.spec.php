<?php declare(strict_types=1);

describe('Querying an existing, single-line, required string comment from a field with attributes', function() {
    it('produces the expected result', function() {
        $input = "> comment\n" .
                 "field:\n" .
                 "entry = value";
        
        $output = Enolib\Parser::parse($input)->field('field')->requiredStringComment();
        
        $expected = "comment";
        
        expect($output)->toEqual($expected);
    });
});

describe('Querying an existing, two-line, required string comment from a field with attributes', function() {
    it('produces the expected result', function() {
        $input = ">comment\n" .
                 ">  comment\n" .
                 "field:\n" .
                 "entry = value";
        
        $output = Enolib\Parser::parse($input)->field('field')->requiredStringComment();
        
        $expected = "comment\n" .
                    "  comment";
        
        expect($output)->toEqual($expected);
    });
});

describe('Querying an existing, required string comment with blank lines from a field with attributes', function() {
    it('produces the expected result', function() {
        $input = ">\n" .
                 ">     comment\n" .
                 ">\n" .
                 ">   comment\n" .
                 ">\n" .
                 "> comment\n" .
                 ">\n" .
                 "field:\n" .
                 "entry = value";
        
        $output = Enolib\Parser::parse($input)->field('field')->requiredStringComment();
        
        $expected = "    comment\n" .
                    "\n" .
                    "  comment\n" .
                    "\n" .
                    "comment";
        
        expect($output)->toEqual($expected);
    });
});

describe('Querying an optional, existing string comment from a field with attributes', function() {
    it('produces the expected result', function() {
        $input = "> comment\n" .
                 "field:\n" .
                 "entry = value";
        
        $output = Enolib\Parser::parse($input)->field('field')->optionalStringComment();
        
        $expected = "comment";
        
        expect($output)->toEqual($expected);
    });
});

describe('Querying an optional, missing string comment from a field with attributes', function() {
    it('produces the expected result', function() {
        $input = "field:\n" .
                 "entry = value";
        
        $output = Enolib\Parser::parse($input)->field('field')->optionalStringComment();
        
        expect($output)->toBeNull();
    });
});