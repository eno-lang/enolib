<?php declare(strict_types=1);

describe('Expecting an attribute but getting two attributes', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field:\n" .
                 "attribute = value\n" .
                 "attribute = value";
        
        try {
            Enolib\Parser::parse($input)->field('field')->attribute('attribute');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "This field was expected to contain only a single attribute with the key 'attribute'.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   "      1 | field:\n" .
                   " >    2 | attribute = value\n" .
                   " >    3 | attribute = value";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(1);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(1);
        expect($error->selection['to']['column'])->toEqual(17);
    });
});

describe('Expecting an attribute but getting two attributes with comments, empty lines and continuations', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field:\n" .
                 "> comment\n" .
                 "attribute = value\n" .
                 "\\ continuation\n" .
                 "\\ continuation\n" .
                 "\n" .
                 "> comment\n" .
                 "attribute = value\n" .
                 "| continuation";
        
        try {
            Enolib\Parser::parse($input)->field('field')->attribute('attribute');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "This field was expected to contain only a single attribute with the key 'attribute'.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   "      1 | field:\n" .
                   "      2 | > comment\n" .
                   " >    3 | attribute = value\n" .
                   " *    4 | \\ continuation\n" .
                   " *    5 | \\ continuation\n" .
                   "      6 | \n" .
                   "      7 | > comment\n" .
                   " >    8 | attribute = value\n" .
                   " *    9 | | continuation";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(2);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(4);
        expect($error->selection['to']['column'])->toEqual(14);
    });
});