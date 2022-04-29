<?php declare(strict_types=1);

describe('Querying an empty field for a required but missing attribute', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field:";
        
        try {
            Enolib\Parser::parse($input)->field('field')->requiredAttribute('attribute');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "The attribute 'attribute' is missing - in case it has been specified look for typos and also check for correct capitalization.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " *    1 | field:";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(6);
        expect($error->selection['to']['line'])->toEqual(0);
        expect($error->selection['to']['column'])->toEqual(6);
    });
});

describe('Querying a field with two attributes for a required but missing attribute', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field:\n" .
                 "attribute = value\n" .
                 "attribute = value";
        
        try {
            Enolib\Parser::parse($input)->field('field')->requiredAttribute('missing');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "The attribute 'missing' is missing - in case it has been specified look for typos and also check for correct capitalization.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " *    1 | field:\n" .
                   " ?    2 | attribute = value\n" .
                   " ?    3 | attribute = value";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(6);
        expect($error->selection['to']['line'])->toEqual(0);
        expect($error->selection['to']['column'])->toEqual(6);
    });
});

describe('Querying a field with attributes, empty lines and comments for a required but missing attribute', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field:\n" .
                 "\n" .
                 "> comment\n" .
                 "attribute = value\n" .
                 "\n" .
                 "> comment\n" .
                 "attribute = value";
        
        try {
            Enolib\Parser::parse($input)->field('field')->requiredAttribute('missing');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "The attribute 'missing' is missing - in case it has been specified look for typos and also check for correct capitalization.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " *    1 | field:\n" .
                   " ?    2 | \n" .
                   " ?    3 | > comment\n" .
                   " ?    4 | attribute = value\n" .
                   " ?    5 | \n" .
                   " ?    6 | > comment\n" .
                   " ?    7 | attribute = value";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(6);
        expect($error->selection['to']['line'])->toEqual(0);
        expect($error->selection['to']['column'])->toEqual(6);
    });
});