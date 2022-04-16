<?php declare(strict_types=1);

describe('Querying an attribute for a required but missing value', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field:\n" .
                 "attribute =";
        
        try {
            Enolib\Parser::parse($input)->field('field')->attribute('attribute')->requiredStringValue();
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "The attribute 'attribute' must contain a value.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   "      1 | field:\n" .
                   " >    2 | attribute =";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(1);
        expect($error->selection['from']['column'])->toEqual(11);
        expect($error->selection['to']['line'])->toEqual(1);
        expect($error->selection['to']['column'])->toEqual(11);
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

describe('Querying a field with an empty item for required values', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field:\n" .
                 "- item\n" .
                 "-";
        
        try {
            Enolib\Parser::parse($input)->field('field')->requiredStringValues();
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "The field 'field' may not contain empty items.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   "      1 | field:\n" .
                   "      2 | - item\n" .
                   " >    3 | -";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(2);
        expect($error->selection['from']['column'])->toEqual(1);
        expect($error->selection['to']['line'])->toEqual(2);
        expect($error->selection['to']['column'])->toEqual(1);
    });
});