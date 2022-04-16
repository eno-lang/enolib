<?php declare(strict_types=1);

describe('Expecting a field but getting an empty section', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "# element";
        
        try {
            Enolib\Parser::parse($input)->field('element');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "A field with the key 'element' was expected.";
        
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

describe('Expecting a field but getting a section with a field with a value and a field with two items', function() {
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
            Enolib\Parser::parse($input)->field('element');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "A field with the key 'element' was expected.";
        
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

describe('Expecting a field but getting a section with subsections', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "# section\n" .
                 "\n" .
                 "## subsection\n" .
                 "\n" .
                 "field: value\n" .
                 "\n" .
                 "## subsection\n" .
                 "\n" .
                 "field:\n" .
                 "- item\n" .
                 "- item";
        
        try {
            Enolib\Parser::parse($input)->field('section');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "A field with the key 'section' was expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | # section\n" .
                   " *    2 | \n" .
                   " *    3 | ## subsection\n" .
                   " *    4 | \n" .
                   " *    5 | field: value\n" .
                   " *    6 | \n" .
                   " *    7 | ## subsection\n" .
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