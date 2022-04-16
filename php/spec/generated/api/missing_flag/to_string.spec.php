<?php declare(strict_types=1);

describe('A missing flag queried without a key leaves out the key in the debug string representation', function() {
    it('produces the expected result', function() {
        $input = "";
        
        $output = Enolib\Parser::parse($input)->flag()->toString();
        
        expect($output)->toEqual('[MissingFlag]');
    });
});

describe('A missing flag queried with a key includes the key in the debug string representation', function() {
    it('produces the expected result', function() {
        $input = "";
        
        $output = Enolib\Parser::parse($input)->flag('key')->toString();
        
        expect($output)->toEqual('[MissingFlag key=key]');
    });
});