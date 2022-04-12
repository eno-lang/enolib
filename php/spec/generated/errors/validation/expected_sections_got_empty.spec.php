<?php declare(strict_types=1);

describe('Expecting sections but getting an ambiguous element', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "element:";
        
        try {
            Enolib\Parser::parse($input)->sections('element');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "Only sections with the key 'element' were expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | element:";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(0);
        expect($error->selection['to']['column'])->toEqual(8);
    });
});