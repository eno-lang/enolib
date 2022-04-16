<?php declare(strict_types=1);

describe('Parsing an attribute preceded by a continuation', function() {
    it('throws the expected ParseError', function() {
        $error = null;
        
        $input = "field:\n" .
                 "| continuation\n" .
                 "attribute = value";
        
        try {
            Enolib\Parser::parse($input);
        } catch(Enolib\ParseError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ParseError');
        
        $text = "The field in line 1 must contain either only attributes, only items, or only a value.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " *    1 | field:\n" .
                   " *    2 | | continuation\n" .
                   " >    3 | attribute = value";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(2);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(2);
        expect($error->selection['to']['column'])->toEqual(17);
    });
});

describe('Parsing an attribute preceded by a value', function() {
    it('throws the expected ParseError', function() {
        $error = null;
        
        $input = "field: value\n" .
                 "attribute = value";
        
        try {
            Enolib\Parser::parse($input);
        } catch(Enolib\ParseError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ParseError');
        
        $text = "The field in line 1 must contain either only attributes, only items, or only a value.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " *    1 | field: value\n" .
                   " >    2 | attribute = value";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(1);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(1);
        expect($error->selection['to']['column'])->toEqual(17);
    });
});

describe('Parsing an attribute preceded by a item', function() {
    it('throws the expected ParseError', function() {
        $error = null;
        
        $input = "field:\n" .
                 "- item\n" .
                 "attribute = value";
        
        try {
            Enolib\Parser::parse($input);
        } catch(Enolib\ParseError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ParseError');
        
        $text = "The field in line 1 must contain either only attributes, only items, or only a value.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " *    1 | field:\n" .
                   " *    2 | - item\n" .
                   " >    3 | attribute = value";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(2);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(2);
        expect($error->selection['to']['column'])->toEqual(17);
    });
});

describe('Parsing an item preceded by a continuation', function() {
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
        
        $text = "The field in line 1 must contain either only attributes, only items, or only a value.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " *    1 | field:\n" .
                   " *    2 | | continuation\n" .
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
        
        $text = "The field in line 1 must contain either only attributes, only items, or only a value.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " *    1 | field:\n" .
                   " *    2 | attribute = value\n" .
                   " >    3 | - item";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(2);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(2);
        expect($error->selection['to']['column'])->toEqual(6);
    });
});