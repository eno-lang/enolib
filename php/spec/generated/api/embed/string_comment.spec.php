<?php declare(strict_types=1);

describe('Querying an existing, single-line, required string comment from an embed', function() {
    it('produces the expected result', function() {
        $input = "> comment\n" .
                 "-- embed\n" .
                 "value\n" .
                 "-- embed";
        
        $output = Enolib\Parser::parse($input)->embed('embed')->requiredStringComment();
        
        $expected = "comment";
        
        expect($output)->toEqual($expected);
    });
});

describe('Querying an existing, two-line, required string comment from an embed', function() {
    it('produces the expected result', function() {
        $input = ">comment\n" .
                 ">  comment\n" .
                 "-- embed\n" .
                 "value\n" .
                 "-- embed";
        
        $output = Enolib\Parser::parse($input)->embed('embed')->requiredStringComment();
        
        $expected = "comment\n" .
                    "  comment";
        
        expect($output)->toEqual($expected);
    });
});

describe('Querying an existing, required string comment with blank lines from an embed', function() {
    it('produces the expected result', function() {
        $input = ">\n" .
                 ">     comment\n" .
                 ">\n" .
                 ">   comment\n" .
                 ">\n" .
                 "> comment\n" .
                 ">\n" .
                 "-- embed\n" .
                 "value\n" .
                 "-- embed";
        
        $output = Enolib\Parser::parse($input)->embed('embed')->requiredStringComment();
        
        $expected = "    comment\n" .
                    "\n" .
                    "  comment\n" .
                    "\n" .
                    "comment";
        
        expect($output)->toEqual($expected);
    });
});

describe('Querying an optional, existing string comment from an embed', function() {
    it('produces the expected result', function() {
        $input = "> comment\n" .
                 "-- embed\n" .
                 "value\n" .
                 "-- embed";
        
        $output = Enolib\Parser::parse($input)->embed('embed')->optionalStringComment();
        
        $expected = "comment";
        
        expect($output)->toEqual($expected);
    });
});

describe('Querying an optional, missing string comment from an embed', function() {
    it('produces the expected result', function() {
        $input = "-- embed\n" .
                 "value\n" .
                 "-- embed";
        
        $output = Enolib\Parser::parse($input)->embed('embed')->optionalStringComment();
        
        expect($output)->toBeNull();
    });
});