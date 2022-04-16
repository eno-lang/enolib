<?php declare(strict_types=1);

describe('Querying a missing field on the document when all elements are required', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "";
        
        try {
            $document = Enolib\Parser::parse($input);
            
            $document->allElementsRequired();
            $document->field('field');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "The field 'field' is missing - in case it has been specified look for typos and also check for correct capitalization.";
        
        expect($error->text)->toEqual($text);
    });
});

describe('Querying a missing section on the document when all elements are required', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "";
        
        try {
            $document = Enolib\Parser::parse($input);
            
            $document->allElementsRequired();
            $document->section('section');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "The section 'section' is missing - in case it has been specified look for typos and also check for correct capitalization.";
        
        expect($error->text)->toEqual($text);
    });
});

describe('Querying a missing field on the document when requiring all elements is explicitly disabled', function() {
    it('produces the expected result', function() {
        $input = "";
        
        $document = Enolib\Parser::parse($input);
        
        $document->allElementsRequired(false);
        $document->field('field');
        
        expect('it passes')->toBeTruthy();
    });
});

describe('Querying a missing field on the document when requiring all elements is enabled and disabled again', function() {
    it('produces the expected result', function() {
        $input = "";
        
        $document = Enolib\Parser::parse($input);
        
        $document->allElementsRequired(true);
        $document->allElementsRequired(false);
        $document->field('field');
        
        expect('it passes')->toBeTruthy();
    });
});

describe('Querying a missing but explicitly optional element on the document when requiring all elements is enabled', function() {
    it('produces the expected result', function() {
        $input = "";
        
        $document = Enolib\Parser::parse($input);
        
        $document->allElementsRequired();
        $document->optionalElement('element');
        
        expect('it passes')->toBeTruthy();
    });
});

describe('Querying a missing but explicitly optional flag on the document when requiring all elements is enabled', function() {
    it('produces the expected result', function() {
        $input = "";
        
        $document = Enolib\Parser::parse($input);
        
        $document->allElementsRequired();
        $document->optionalFlag('flag');
        
        expect('it passes')->toBeTruthy();
    });
});

describe('Querying a missing but explicitly optional field on the document when requiring all elements is enabled', function() {
    it('produces the expected result', function() {
        $input = "";
        
        $document = Enolib\Parser::parse($input);
        
        $document->allElementsRequired();
        $document->optionalField('field');
        
        expect('it passes')->toBeTruthy();
    });
});

describe('Querying a missing but explicitly optional section on the document when requiring all elements is enabled', function() {
    it('produces the expected result', function() {
        $input = "";
        
        $document = Enolib\Parser::parse($input);
        
        $document->allElementsRequired();
        $document->optionalSection('section');
        
        expect('it passes')->toBeTruthy();
    });
});