<?php declare(strict_types=1);

describe('Expecting a field with a value but getting a field with an attribute', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field:\n" .
                 "attribute = value";
        
        try {
            Enolib\Parser::parse($input)->field('field');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "A field containing a value was expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | field:\n" .
                   " *    2 | attribute = value";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(1);
        expect($error->selection['to']['column'])->toEqual(13);
    });
});

describe('Expecting a field containing a value but getting a field containing multiple attributes with empty lines', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field:\n" .
                 "\n" .
                 "attribute = value\n" .
                 "\n" .
                 "attribute = value\n" .
                 "\n" .
                 "attribute = value\n" .
                 "";
        
        try {
            Enolib\Parser::parse($input)->field('field');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "A field containing a value was expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | fieldset:\n" .
                   " *    2 | \n" .
                   " *    3 | attribute = value\n" .
                   " *    4 | \n" .
                   " *    5 | attribute = value\n" .
                   " *    6 | \n" .
                   " *    7 | attribute = value\n" .
                   "      8 | ";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(6);
        expect($error->selection['to']['column'])->toEqual(13);
    });
});

describe('Expecting a field containing a value but getting a field containing two attributes with comments', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field:\n" .
                 "> comment\n" .
                 "attribute = value\n" .
                 "\n" .
                 "> comment\n" .
                 "attribute = value";
        
        try {
            Enolib\Parser::parse($input)->field('field');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "A field containing a value was expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | field:\n" .
                   " *    2 | > comment\n" .
                   " *    3 | attribute = value\n" .
                   " *    4 | \n" .
                   " *    5 | > comment\n" .
                   " *    6 | attribute = value";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(5);
        expect($error->selection['to']['column'])->toEqual(13);
    });
});