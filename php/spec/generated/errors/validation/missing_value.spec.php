<?php declare(strict_types=1);

describe('Querying a fieldset entry for a required but missing value', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "fieldset:\n" .
                 "entry =";
        
        try {
            Enolib\Parser::parse($input)->fieldset('fieldset')->entry('entry')->requiredStringValue();
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "The fieldset entry 'entry' must contain a value.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   "      1 | fieldset:\n" .
                   " >    2 | entry =";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(1);
        expect($error->selection['from']['column'])->toEqual(7);
        expect($error->selection['to']['line'])->toEqual(1);
        expect($error->selection['to']['column'])->toEqual(7);
    });
});

describe('Querying a field for a required but missing value', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field:";
        
        try {
            Enolib\Parser::parse($input)->field('field')->requiredStringValue();
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "The field 'field' must contain a value.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | field:";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(6);
        expect($error->selection['to']['line'])->toEqual(0);
        expect($error->selection['to']['column'])->toEqual(6);
    });
});

describe('Querying a field with empty line continuations for a required but missing value', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field:\n" .
                 "|\n" .
                 "\n" .
                 "|";
        
        try {
            Enolib\Parser::parse($input)->field('field')->requiredStringValue();
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "The field 'field' must contain a value.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | field:\n" .
                   " *    2 | |\n" .
                   " *    3 | \n" .
                   " *    4 | |";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(6);
        expect($error->selection['to']['line'])->toEqual(3);
        expect($error->selection['to']['column'])->toEqual(1);
    });
});

describe('Querying a list with an empty item for required values', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "list:\n" .
                 "- item\n" .
                 "-";
        
        try {
            Enolib\Parser::parse($input)->list('list')->requiredStringValues();
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "The list 'list' may not contain empty items.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   "      1 | list:\n" .
                   "      2 | - item\n" .
                   " >    3 | -";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(2);
        expect($error->selection['from']['column'])->toEqual(1);
        expect($error->selection['to']['line'])->toEqual(2);
        expect($error->selection['to']['column'])->toEqual(1);
    });
});