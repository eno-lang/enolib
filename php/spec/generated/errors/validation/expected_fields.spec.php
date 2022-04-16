<?php declare(strict_types=1);

describe('Expecting fields but getting an empty embed', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "-- element\n" .
                 "-- element";
        
        try {
            Enolib\Parser::parse($input)->fields('element');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "Only fields with the key 'element' were expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | -- element\n" .
                   " *    2 | -- element";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(1);
        expect($error->selection['to']['column'])->toEqual(10);
    });
});

describe('Expecting fields but getting an embed with a value', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "-- element\n" .
                 "value\n" .
                 "-- element";
        
        try {
            Enolib\Parser::parse($input)->fields('element');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "Only fields with the key 'element' were expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | -- element\n" .
                   " *    2 | value\n" .
                   " *    3 | -- element";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(2);
        expect($error->selection['to']['column'])->toEqual(10);
    });
});

describe('Expecting fields but getting an embed with a comment', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "> comment\n" .
                 "-- element\n" .
                 "value\n" .
                 "-- element";
        
        try {
            Enolib\Parser::parse($input)->fields('element');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "Only fields with the key 'element' were expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   "      1 | > comment\n" .
                   " >    2 | -- element\n" .
                   " *    3 | value\n" .
                   " *    4 | -- element";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(1);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(3);
        expect($error->selection['to']['column'])->toEqual(10);
    });
});

describe('Expecting fields but getting a flag', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "element";
        
        try {
            Enolib\Parser::parse($input)->fields('element');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "Only fields with the key 'element' were expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | element";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(0);
        expect($error->selection['to']['column'])->toEqual(7);
    });
});

describe('Expecting fields but getting an empty section', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "# element";
        
        try {
            Enolib\Parser::parse($input)->fields('element');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "Only fields with the key 'element' were expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | # element";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(0);
        expect($error->selection['to']['column'])->toEqual(9);
    });
});

describe('Expecting fields but getting a section with a field with a value and a field with items', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "# element\n" .
                 "\n" .
                 "field: value\n" .
                 "\n" .
                 "field:\n" .
                 "- item\n" .
                 "- item";
        
        try {
            Enolib\Parser::parse($input)->fields('element');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "Only fields with the key 'element' were expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | # element\n" .
                   " *    2 | \n" .
                   " *    3 | field: value\n" .
                   " *    4 | \n" .
                   " *    5 | field:\n" .
                   " *    6 | - item\n" .
                   " *    7 | - item";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(6);
        expect($error->selection['to']['column'])->toEqual(6);
    });
});

describe('Expecting fields but getting a section with subsections', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "# element\n" .
                 "\n" .
                 "## section\n" .
                 "\n" .
                 "field: value\n" .
                 "\n" .
                 "## section\n" .
                 "\n" .
                 "field:\n" .
                 "- item\n" .
                 "- item";
        
        try {
            Enolib\Parser::parse($input)->fields('element');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "Only fields with the key 'element' were expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | # element\n" .
                   " *    2 | \n" .
                   " *    3 | ## section\n" .
                   " *    4 | \n" .
                   " *    5 | field: value\n" .
                   " *    6 | \n" .
                   " *    7 | ## section\n" .
                   " *    8 | \n" .
                   " *    9 | field:\n" .
                   " *   10 | - item\n" .
                   " *   11 | - item";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(10);
        expect($error->selection['to']['column'])->toEqual(6);
    });
});