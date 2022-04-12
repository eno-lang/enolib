<?php declare(strict_types=1);

describe('Expecting fieldsets but getting a field', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field: value";
        
        try {
            Enolib\Parser::parse($input)->fieldsets('field');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "Only fieldsets with the key 'field' were expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | field: value";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(0);
        expect($error->selection['to']['column'])->toEqual(12);
    });
});

describe('Expecting fieldsets but getting a field with continuations', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field:\n" .
                 "| continuation\n" .
                 "| continuation";
        
        try {
            Enolib\Parser::parse($input)->fieldsets('field');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "Only fieldsets with the key 'field' were expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | field:\n" .
                   " *    2 | | continuation\n" .
                   " *    3 | | continuation";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(2);
        expect($error->selection['to']['column'])->toEqual(14);
    });
});

describe('Expecting fieldsets but getting a field with continuations separated by idle lines', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field: value\n" .
                 "| continuation\n" .
                 "| continuation\n" .
                 "\n" .
                 "> comment\n" .
                 "| continuation";
        
        try {
            Enolib\Parser::parse($input)->fieldsets('field');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "Only fieldsets with the key 'field' were expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | field: value\n" .
                   " *    2 | | continuation\n" .
                   " *    3 | | continuation\n" .
                   " *    4 | \n" .
                   " *    5 | > comment\n" .
                   " *    6 | | continuation";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(5);
        expect($error->selection['to']['column'])->toEqual(14);
    });
});