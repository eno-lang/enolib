<?php declare(strict_types=1);

describe('Expecting a field containing attributes but getting a field containing a value', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field: value";
        
        try {
            Enolib\Parser::parse($input)->field('field')->attributes();
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "This field was expected to contain only attributes.";
        
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

describe('Expecting a field containing attributes but getting a field containing continuations', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field:\n" .
                 "| continuation\n" .
                 "| continuation";
        
        try {
            Enolib\Parser::parse($input)->field('field')->attributes();
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "This field was expected to contain only attributes.";
        
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

describe('Expecting a field containing attributes but getting a field containing continuations separated by idle lines', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field: value\n" .
                 "| continuation\n" .
                 "| continuation\n" .
                 "\n" .
                 "> comment\n" .
                 "| continuation";
        
        try {
            Enolib\Parser::parse($input)->field('field')->attributes();
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "This field was expected to contain only attributes.";
        
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

describe('Expecting a field containing attributes but getting a field containing one item', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field:\n" .
                 "- item";
        
        try {
            Enolib\Parser::parse($input)->field('field')->attributes();
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "This field was expected to contain only attributes.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | field:\n" .
                   " *    2 | - item";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(1);
        expect($error->selection['to']['column'])->toEqual(6);
    });
});

describe('Expecting a field containing attributes but getting a field containing empty lines and three items', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field:\n" .
                 "\n" .
                 "- item\n" .
                 "\n" .
                 "- item\n" .
                 "\n" .
                 "- item\n" .
                 "";
        
        try {
            Enolib\Parser::parse($input)->field('field')->attributes();
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "This field was expected to contain only attributes.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | field:\n" .
                   " *    2 | \n" .
                   " *    3 | - item\n" .
                   " *    4 | \n" .
                   " *    5 | - item\n" .
                   " *    6 | \n" .
                   " *    7 | - item\n" .
                   "      8 | ";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(6);
        expect($error->selection['to']['column'])->toEqual(6);
    });
});

describe('Expecting a field containing attributes but getting a field containing two items with comments', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field:\n" .
                 "> comment\n" .
                 "- item\n" .
                 "\n" .
                 "> comment\n" .
                 "- item";
        
        try {
            Enolib\Parser::parse($input)->field('field')->attributes();
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "This field was expected to contain only attributes.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | field:\n" .
                   " *    2 | > comment\n" .
                   " *    3 | - item\n" .
                   " *    4 | \n" .
                   " *    5 | > comment\n" .
                   " *    6 | - item";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(5);
        expect($error->selection['to']['column'])->toEqual(6);
    });
});