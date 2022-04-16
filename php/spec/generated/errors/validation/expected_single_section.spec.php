<?php declare(strict_types=1);

describe('Expecting a section but getting two sections', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "# section\n" .
                 "\n" .
                 "# section\n" .
                 "";
        
        try {
            Enolib\Parser::parse($input)->section('section');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "Only a single section with the key 'section' was expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | # section\n" .
                   "      2 | \n" .
                   " >    3 | # section\n" .
                   "      4 | ";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(0);
        expect($error->selection['to']['column'])->toEqual(9);
    });
});

describe('Expecting a section but getting two sections with elements, empty lines and continuations', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "> comment\n" .
                 "# section\n" .
                 "\n" .
                 "field: value\n" .
                 "\n" .
                 "# section\n" .
                 "\n" .
                 "field:\n" .
                 "- item\n" .
                 "\\ continuation\n" .
                 "\n" .
                 "- item";
        
        try {
            Enolib\Parser::parse($input)->section('section');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "Only a single section with the key 'section' was expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   "      1 | > comment\n" .
                   " >    2 | # section\n" .
                   " *    3 | \n" .
                   " *    4 | field: value\n" .
                   "      5 | \n" .
                   " >    6 | # section\n" .
                   " *    7 | \n" .
                   " *    8 | field:\n" .
                   " *    9 | - item\n" .
                   " *   10 | \\ continuation\n" .
                   " *   11 | \n" .
                   " *   12 | - item";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(1);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(3);
        expect($error->selection['to']['column'])->toEqual(12);
    });
});