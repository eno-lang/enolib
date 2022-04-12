<?php declare(strict_types=1);

describe('Querying a missing attribute on a field with attributes when all attributes are required', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field:";
        
        try {
            $field = Enolib\Parser::parse($input)->field('field');
            
            $field->allAttributesRequired();
            $field->attribute('attribute');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "The attribute 'attribute' is missing - in case it has been specified look for typos and also check for correct capitalization.";
        
        expect($error->text)->toEqual($text);
    });
});

describe('Querying a missing attribute on a field with attributes when all requiring all attributes is explicitly enabled', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field:";
        
        try {
            $field = Enolib\Parser::parse($input)->field('field');
            
            $field->allAttributesRequired(true);
            $field->attribute('attribute');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "The attribute 'attribute' is missing - in case it has been specified look for typos and also check for correct capitalization.";
        
        expect($error->text)->toEqual($text);
    });
});

describe('Querying a missing attribute on a field with attributes when requiring all attributes is explicitly disabled', function() {
    it('produces the expected result', function() {
        $input = "field:";
        
        $field = Enolib\Parser::parse($input)->field('field');
        
        $field->allAttributesRequired(false);
        $field->attribute('attribute');
        
        expect('it passes')->toBeTruthy();
    });
});

describe('Querying a missing attribute on a field with attributes when requiring all attributes is enabled and disabled again', function() {
    it('produces the expected result', function() {
        $input = "field:";
        
        $field = Enolib\Parser::parse($input)->field('field');
        
        $field->allAttributesRequired(true);
        $field->allAttributesRequired(false);
        $field->attribute('attribute');
        
        expect('it passes')->toBeTruthy();
    });
});

describe('Querying a missing but explicitly optional attribute on a field with attributes when requiring all attributes is enabled', function() {
    it('produces the expected result', function() {
        $input = "field:";
        
        $field = Enolib\Parser::parse($input)->field('field');
        
        $field->allAttributesRequired();
        $field->optionalEntry('attribute');
        
        expect('it passes')->toBeTruthy();
    });
});