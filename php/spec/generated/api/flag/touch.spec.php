<?php declare(strict_types=1);

describe('Asserting everything was touched when the only present flag was not touched', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "flag";
        
        try {
            Enolib\Parser::parse($input)->assertAllTouched();
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "This element was not expected, make sure it is at the right place in the document and that its key is not mis-typed.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | flag";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(0);
        expect($error->selection['to']['column'])->toEqual(4);
    });
});

describe('Asserting everything was touched when the only present flag was touched', function() {
    it('produces the expected result', function() {
        $input = "flag";
        
        $document = Enolib\Parser::parse($input);
        
        $document->flag('flag')->touch();
        $document->assertAllTouched();
        
        expect('it passes')->toBeTruthy();
    });
});