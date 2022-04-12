<?php declare(strict_types=1);

describe('Querying an existing required string value from an embed', function() {
    it('produces the expected result', function() {
        $input = "-- embed\n" .
                 "value\n" .
                 "-- embed";
        
        $output = Enolib\Parser::parse($input)->embed('embed')->requiredStringValue();
        
        $expected = "value";
        
        expect($output)->toEqual($expected);
    });
});

describe('Querying an existing optional string value from an embed', function() {
    it('produces the expected result', function() {
        $input = "-- embed\n" .
                 "value\n" .
                 "-- embed";
        
        $output = Enolib\Parser::parse($input)->embed('embed')->optionalStringValue();
        
        $expected = "value";
        
        expect($output)->toEqual($expected);
    });
});

describe('Querying a missing optional string value from an embed', function() {
    it('produces the expected result', function() {
        $input = "-- embed\n" .
                 "-- embed";
        
        $output = Enolib\Parser::parse($input)->embed('embed')->optionalStringValue();
        
        expect($output)->toBeNull();
    });
});