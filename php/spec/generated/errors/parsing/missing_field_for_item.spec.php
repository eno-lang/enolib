<?php declare(strict_types=1);

describe('Parsing an item without any previous element', function() {
    it('throws the expected ParseError', function() {
        $error = null;
        
        $input = "- item";
        
        try {
            Enolib\Parser::parse($input);
        } catch(Enolib\ParseError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ParseError');
        
        $text = "Line 1 contains an item without a field being specified before.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | - item";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(0);
        expect($error->selection['to']['column'])->toEqual(6);
    });
});

describe('Parsing an item preceded by a line continuation', function() {
    it('throws the expected ParseError', function() {
        $error = null;
        
        $input = "field:\n" .
                 "| continuation\n" .
                 "- item";
        
        try {
            Enolib\Parser::parse($input);
        } catch(Enolib\ParseError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ParseError');
        
        $text = "Line 3 contains an item without a field being specified before.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   "      1 | field:\n" .
                   "      2 | | continuation\n" .
                   " >    3 | - item";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(2);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(2);
        expect($error->selection['to']['column'])->toEqual(6);
    });
});

describe('Parsing an item preceded by an attribute', function() {
    it('throws the expected ParseError', function() {
        $error = null;
        
        $input = "field:\n" .
                 "attribute = value\n" .
                 "- item";
        
        try {
            Enolib\Parser::parse($input);
        } catch(Enolib\ParseError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ParseError');
        
        $text = "Line 3 contains an item without a field being specified before.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   "      1 | field:\n" .
                   "      2 | attribute = value\n" .
                   " >    3 | - item";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(2);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(2);
        expect($error->selection['to']['column'])->toEqual(6);
    });
});