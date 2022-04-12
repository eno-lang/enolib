<?php declare(strict_types=1);

describe('Querying an empty document for a required but missing section', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "";
        
        try {
            Enolib\Parser::parse($input)->requiredSection('section');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "The section 'section' is missing - in case it has been specified look for typos and also check for correct capitalization.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " ?    1 | ";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(0);
        expect($error->selection['to']['column'])->toEqual(0);
    });
});

describe('Querying a section for a required but missing section', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "# section";
        
        try {
            Enolib\Parser::parse($input)->section('section')->requiredSection('section');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "The section 'section' is missing - in case it has been specified look for typos and also check for correct capitalization.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " *    1 | # section";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(9);
        expect($error->selection['to']['line'])->toEqual(0);
        expect($error->selection['to']['column'])->toEqual(9);
    });
});