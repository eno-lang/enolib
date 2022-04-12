<?php declare(strict_types=1);

describe('Querying an existing, single-line, required string comment from a flag', function() {
    it('produces the expected result', function() {
        $input = "> comment\n" .
                 "flag";
        
        $output = Enolib\Parser::parse($input)->flag('flag')->requiredStringComment();
        
        $expected = "comment";
        
        expect($output)->toEqual($expected);
    });
});

describe('Querying an existing, two-line, required string comment from a flag', function() {
    it('produces the expected result', function() {
        $input = ">comment\n" .
                 ">  comment\n" .
                 "flag";
        
        $output = Enolib\Parser::parse($input)->flag('flag')->requiredStringComment();
        
        $expected = "comment\n" .
                    "  comment";
        
        expect($output)->toEqual($expected);
    });
});

describe('Querying an existing, required string comment with blank lines from a flag', function() {
    it('produces the expected result', function() {
        $input = ">\n" .
                 ">     comment\n" .
                 ">\n" .
                 ">   comment\n" .
                 ">\n" .
                 "> comment\n" .
                 ">\n" .
                 "flag";
        
        $output = Enolib\Parser::parse($input)->flag('flag')->requiredStringComment();
        
        $expected = "    comment\n" .
                    "\n" .
                    "  comment\n" .
                    "\n" .
                    "comment";
        
        expect($output)->toEqual($expected);
    });
});

describe('Querying an optional, existing string comment from a flag', function() {
    it('produces the expected result', function() {
        $input = "> comment\n" .
                 "flag";
        
        $output = Enolib\Parser::parse($input)->flag('flag')->optionalStringComment();
        
        $expected = "comment";
        
        expect($output)->toEqual($expected);
    });
});

describe('Querying an optional, missing string comment from a flag', function() {
    it('produces the expected result', function() {
        $input = "flag";
        
        $output = Enolib\Parser::parse($input)->flag('flag')->optionalStringComment();
        
        expect($output)->toBeNull();
    });
});