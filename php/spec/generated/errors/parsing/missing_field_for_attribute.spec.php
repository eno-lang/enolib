<?php declare(strict_types=1);

describe('Parsing an attribute without a fieldset', function() {
    it('throws the expected ParseError', function() {
        $error = null;
        
        $input = "attribute = value";
        
        try {
            Enolib\Parser::parse($input);
        } catch(Enolib\ParseError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ParseError');
        
        $text = "Line 1 contains an attribute without a fieldset being specified before.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | attribute = value";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(0);
        expect($error->selection['to']['column'])->toEqual(13);
    });
});

describe('Parsing an attribute preceded by a line continuation', function() {
    it('throws the expected ParseError', function() {
        $error = null;
        
        $input = "field:\n" .
                 "| line_continuation\n" .
                 "attribute = value";
        
        try {
            Enolib\Parser::parse($input);
        } catch(Enolib\ParseError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ParseError');
        
        $text = "Line 3 contains an attribute without a fieldset being specified before.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   "      1 | field:\n" .
                   "      2 | | line_continuation\n" .
                   " >    3 | attribute = value";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(2);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(2);
        expect($error->selection['to']['column'])->toEqual(13);
    });
});

describe('Parsing an attribute preceded by a field', function() {
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
        
        $text = "Line 2 contains an attribute without a fieldset being specified before.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   "      1 | field: value\n" .
                   " >    2 | attribute = value";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(1);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(1);
        expect($error->selection['to']['column'])->toEqual(13);
    });
});

describe('Parsing an attribute preceded by a list item', function() {
    it('throws the expected ParseError', function() {
        $error = null;
        
        $input = "list:\n" .
                 "- item\n" .
                 "attribute = value";
        
        try {
            Enolib\Parser::parse($input);
        } catch(Enolib\ParseError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ParseError');
        
        $text = "Line 3 contains an attribute without a fieldset being specified before.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   "      1 | list:\n" .
                   "      2 | - item\n" .
                   " >    3 | attribute = value";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(2);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(2);
        expect($error->selection['to']['column'])->toEqual(13);
    });
});