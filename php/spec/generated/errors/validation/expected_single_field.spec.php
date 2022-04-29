<?php declare(strict_types=1);

describe('Expecting a field but getting two fields', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field: value\n" .
                 "field: value";
        
        try {
            Enolib\Parser::parse($input)->field('field');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "Only a single field with the key 'field' was expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | field: value\n" .
                   " >    2 | field: value";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(0);
        expect($error->selection['to']['column'])->toEqual(12);
    });
});

describe('Expecting a field but getting two fields with comments, empty lines and continuations', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "> comment\n" .
                 "field: value\n" .
                 "\\ continuation\n" .
                 "\n" .
                 "\\ continuation\n" .
                 "\n" .
                 "field: value\n" .
                 "> comment\n" .
                 "| continutation";
        
        try {
            Enolib\Parser::parse($input)->field('field');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "Only a single field with the key 'field' was expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   "      1 | > comment\n" .
                   " >    2 | field: value\n" .
                   " *    3 | \\ continuation\n" .
                   " *    4 | \n" .
                   " *    5 | \\ continuation\n" .
                   "      6 | \n" .
                   " >    7 | field: value\n" .
                   " *    8 | > comment\n" .
                   " *    9 | | continutation";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(1);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(4);
        expect($error->selection['to']['column'])->toEqual(14);
    });
});

describe('Expecting a field but getting two fields', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field:\n" .
                 "attribute = value\n" .
                 "field:\n" .
                 "attribute = value";
        
        try {
            Enolib\Parser::parse($input)->field('field');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "Only a single field with the key 'field' was expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | field:\n" .
                   " *    2 | attribute = value\n" .
                   " >    3 | field:\n" .
                   " *    4 | attribute = value";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(1);
        expect($error->selection['to']['column'])->toEqual(17);
    });
});

describe('Expecting a field but getting two fields with attributes, comments, empty lines and continuations', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "> comment\n" .
                 "field:\n" .
                 "attribute = value\n" .
                 "\n" .
                 "attribute = value\n" .
                 "\n" .
                 "field:\n" .
                 "> comment\n" .
                 "attribute = value";
        
        try {
            Enolib\Parser::parse($input)->field('field');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "Only a single field with the key 'field' was expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   "      1 | > comment\n" .
                   " >    2 | field:\n" .
                   " *    3 | attribute = value\n" .
                   " *    4 | \n" .
                   " *    5 | attribute = value\n" .
                   "      6 | \n" .
                   " >    7 | field:\n" .
                   " *    8 | > comment\n" .
                   " *    9 | attribute = value";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(1);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(4);
        expect($error->selection['to']['column'])->toEqual(17);
    });
});

describe('Expecting a field but getting two fields with items', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field:\n" .
                 "- item\n" .
                 "field:\n" .
                 "- item";
        
        try {
            Enolib\Parser::parse($input)->field('field');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "Only a single field with the key 'field' was expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | field:\n" .
                   " *    2 | - item\n" .
                   " >    3 | field:\n" .
                   " *    4 | - item";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(1);
        expect($error->selection['to']['column'])->toEqual(6);
    });
});

describe('Expecting a field but getting two fields with items, comments, empty lines and continuations', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "> comment\n" .
                 "field:\n" .
                 "- item\n" .
                 "\n" .
                 "- item\n" .
                 "\n" .
                 "field:\n" .
                 "> comment\n" .
                 "- item\n" .
                 "\\ continuation";
        
        try {
            Enolib\Parser::parse($input)->field('field');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "Only a single field with the key 'field' was expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   "      1 | > comment\n" .
                   " >    2 | field:\n" .
                   " *    3 | - item\n" .
                   " *    4 | \n" .
                   " *    5 | - item\n" .
                   "      6 | \n" .
                   " >    7 | field:\n" .
                   " *    8 | > comment\n" .
                   " *    9 | - item\n" .
                   " *   10 | \\ continuation";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(1);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(4);
        expect($error->selection['to']['column'])->toEqual(6);
    });
});