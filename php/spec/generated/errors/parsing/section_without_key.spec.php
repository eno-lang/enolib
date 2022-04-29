<?php declare(strict_types=1);

describe('A section without a key', function() {
    it('throws the expected ParseError', function() {
        $error = null;
        
        $input = "#";
        
        try {
            Enolib\Parser::parse($input);
        } catch(Enolib\ParseError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ParseError');
        
        $text = "The section in line 1 has no key.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | #";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(1);
        expect($error->selection['to']['line'])->toEqual(0);
        expect($error->selection['to']['column'])->toEqual(1);
    });
});