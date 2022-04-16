<?php declare(strict_types=1);

describe('Expecting a section but getting a field', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "element: value";
        
        try {
            Enolib\Parser::parse($input)->section('element');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "A section with the key 'element' was expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | element: value";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(0);
        expect($error->selection['to']['column'])->toEqual(14);
    });
});

describe('Expecting a section but getting a field with one attribute', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "element:\n" .
                 "attribute = value";
        
        try {
            Enolib\Parser::parse($input)->section('element');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "A section with the key 'element' was expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | element:\n" .
                   " *    2 | attribute = value";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(1);
        expect($error->selection['to']['column'])->toEqual(17);
    });
});

describe('Expecting a section but getting a field with empty lines and three attributes', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "element:\n" .
                 "\n" .
                 "attribute = value\n" .
                 "\n" .
                 "attribute = value\n" .
                 "\n" .
                 "attribute = value\n" .
                 "";
        
        try {
            Enolib\Parser::parse($input)->section('element');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "A section with the key 'element' was expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | element:\n" .
                   " *    2 | \n" .
                   " *    3 | attribute = value\n" .
                   " *    4 | \n" .
                   " *    5 | attribute = value\n" .
                   " *    6 | \n" .
                   " *    7 | attribute = value\n" .
                   "      8 | ";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(6);
        expect($error->selection['to']['column'])->toEqual(17);
    });
});

describe('Expecting a section but getting a field with two attributes with comments', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "element:\n" .
                 "> comment\n" .
                 "attribute = value\n" .
                 "\n" .
                 "> comment\n" .
                 "attribute = value";
        
        try {
            Enolib\Parser::parse($input)->section('element');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "A section with the key 'element' was expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | element:\n" .
                   " *    2 | > comment\n" .
                   " *    3 | attribute = value\n" .
                   " *    4 | \n" .
                   " *    5 | > comment\n" .
                   " *    6 | attribute = value";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(5);
        expect($error->selection['to']['column'])->toEqual(17);
    });
});

describe('Expecting a section but getting a field with one item', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "element:\n" .
                 "- item";
        
        try {
            Enolib\Parser::parse($input)->section('element');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "A section with the key 'element' was expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | element:\n" .
                   " *    2 | - item";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(1);
        expect($error->selection['to']['column'])->toEqual(6);
    });
});

describe('Expecting a section but getting a field with empty lines and three items', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "element:\n" .
                 "\n" .
                 "- item\n" .
                 "\n" .
                 "- item\n" .
                 "\n" .
                 "- item\n" .
                 "";
        
        try {
            Enolib\Parser::parse($input)->section('element');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "A section with the key 'element' was expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | element:\n" .
                   " *    2 | \n" .
                   " *    3 | - item\n" .
                   " *    4 | \n" .
                   " *    5 | - item\n" .
                   " *    6 | \n" .
                   " *    7 | - item\n" .
                   "      8 | ";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(6);
        expect($error->selection['to']['column'])->toEqual(6);
    });
});

describe('Expecting a section but getting a field with two items with comments', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "element:\n" .
                 "> comment\n" .
                 "- item\n" .
                 "\n" .
                 "> comment\n" .
                 "- item";
        
        try {
            Enolib\Parser::parse($input)->section('element');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "A section with the key 'element' was expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | element:\n" .
                   " *    2 | > comment\n" .
                   " *    3 | - item\n" .
                   " *    4 | \n" .
                   " *    5 | > comment\n" .
                   " *    6 | - item";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(5);
        expect($error->selection['to']['column'])->toEqual(6);
    });
});

describe('Expecting a section but getting a field with continuations', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "element:\n" .
                 "| continuation\n" .
                 "| continuation";
        
        try {
            Enolib\Parser::parse($input)->section('element');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "A section with the key 'element' was expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | element:\n" .
                   " *    2 | | continuation\n" .
                   " *    3 | | continuation";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(2);
        expect($error->selection['to']['column'])->toEqual(14);
    });
});

describe('Expecting a section but getting a field with continuations separated by idle lines', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "element: value\n" .
                 "| continuation\n" .
                 "| continuation\n" .
                 "\n" .
                 "> comment\n" .
                 "| continuation";
        
        try {
            Enolib\Parser::parse($input)->section('element');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "A section with the key 'element' was expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | element: value\n" .
                   " *    2 | | continuation\n" .
                   " *    3 | | continuation\n" .
                   " *    4 | \n" .
                   " *    5 | > comment\n" .
                   " *    6 | | continuation";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(5);
        expect($error->selection['to']['column'])->toEqual(14);
    });
});

describe('Expecting a section but getting a flag', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "element";
        
        try {
            Enolib\Parser::parse($input)->section('element');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "A section with the key 'element' was expected.";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | element";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(0);
        expect($error->selection['to']['column'])->toEqual(7);
    });
});