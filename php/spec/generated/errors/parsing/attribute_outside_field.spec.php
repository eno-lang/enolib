<?php declare(strict_types=1);

describe('Parsing an attribute without a field', function() {
    it('throws the expected ParseError', function() {
        $error = null;
        
        $input = "attribute = value";
        
        try {
            Enolib\Parser::parse($input);
        } catch(Enolib\ParseError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ParseError');
        
        $text = "The attribute in line 1 is not contained within a field.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | attribute = value";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(0);
        expect($error->selection['to']['column'])->toEqual(17);
    });
});