<?php declare(strict_types=1);

describe('Querying an empty fieldset for a required but missing entry', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "fieldset:";
        
        try {
            Enolib\Parser::parse($input)->fieldset('fieldset')->requiredEntry('entry');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "The fieldset entry 'entry' is missing - in case it has been specified look for typos and also check for correct capitalization.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " *    1 | fieldset:";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(9);
        expect($error->selection['to']['line'])->toEqual(0);
        expect($error->selection['to']['column'])->toEqual(9);
    });
});

describe('Querying a fieldset with two entries for a required but missing entry', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "fieldset:\n" .
                 "entry = value\n" .
                 "entry = value";
        
        try {
            Enolib\Parser::parse($input)->fieldset('fieldset')->requiredEntry('missing');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "The fieldset entry 'missing' is missing - in case it has been specified look for typos and also check for correct capitalization.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " *    1 | fieldset:\n" .
                   " ?    2 | entry = value\n" .
                   " ?    3 | entry = value";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(9);
        expect($error->selection['to']['line'])->toEqual(0);
        expect($error->selection['to']['column'])->toEqual(9);
    });
});

describe('Querying a fieldset with entries, empty lines and comments for a required but missing entry', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "fieldset:\n" .
                 "\n" .
                 "> comment\n" .
                 "entry = value\n" .
                 "\n" .
                 "> comment\n" .
                 "entry = value";
        
        try {
            Enolib\Parser::parse($input)->fieldset('fieldset')->requiredEntry('missing');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "The fieldset entry 'missing' is missing - in case it has been specified look for typos and also check for correct capitalization.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " *    1 | fieldset:\n" .
                   " ?    2 | \n" .
                   " ?    3 | > comment\n" .
                   " ?    4 | entry = value\n" .
                   " ?    5 | \n" .
                   " ?    6 | > comment\n" .
                   " ?    7 | entry = value";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(9);
        expect($error->selection['to']['line'])->toEqual(0);
        expect($error->selection['to']['column'])->toEqual(9);
    });
});