<?php declare(strict_types=1);

describe('Querying a value from a field with a loader that always produces an error', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field: value";
        
        try {
            $loader = function($value) {
              throw new Exception("my error for '{$value}'");
            }
            
            Enolib\Parser::parse($input)->field('field')->requiredValue($loader);
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "There is a problem with the value of this element: my error for 'value'";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | field: value";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(7);
        expect($error->selection['to']['line'])->toEqual(0);
        expect($error->selection['to']['column'])->toEqual(12);
    });
});

describe('Requesting a value error from a field with a static message', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field: value";
        
        try {
            throw Enolib\Parser::parse($input)->field('field')->valueError('my static message');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "There is a problem with the value of this element: my static message";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | field: value";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(7);
        expect($error->selection['to']['line'])->toEqual(0);
        expect($error->selection['to']['column'])->toEqual(12);
    });
});

describe('Requesting a value error from a field with a dynamically generated message', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field: value";
        
        try {
            throw Enolib\Parser::parse($input)->field('field')->valueError(function($value) { return "my generated message for '{$value}'"; });
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "There is a problem with the value of this element: my generated message for 'value'";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | field: value";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(7);
        expect($error->selection['to']['line'])->toEqual(0);
        expect($error->selection['to']['column'])->toEqual(12);
    });
});

describe('Requesting a value error from an embed with a static message', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "-- embed\n" .
                 "value\n" .
                 "-- embed";
        
        try {
            throw Enolib\Parser::parse($input)->embed('embed')->valueError('my static message');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "There is a problem with the value of this element: my static message";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   "      1 | -- embed\n" .
                   " >    2 | value\n" .
                   "      3 | -- embed";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(1);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(1);
        expect($error->selection['to']['column'])->toEqual(5);
    });
});

describe('Requesting a value error from an embed with a dynamically generated message', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "-- embed\n" .
                 "value\n" .
                 "-- embed";
        
        try {
            throw Enolib\Parser::parse($input)->embed('embed')->valueError(function($value) { return "my generated message for '{$value}'"; });
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "There is a problem with the value of this element: my generated message for 'value'";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   "      1 | -- embed\n" .
                   " >    2 | value\n" .
                   "      3 | -- embed";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(1);
        expect($error->selection['from']['column'])->toEqual(0);
        expect($error->selection['to']['line'])->toEqual(1);
        expect($error->selection['to']['column'])->toEqual(5);
    });
});

describe('Requesting a value error from an empty embed with a static message', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "-- embed\n" .
                 "-- embed";
        
        try {
            throw Enolib\Parser::parse($input)->embed('embed')->valueError('my static message');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "There is a problem with the value of this element: my static message";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | -- embed\n" .
                   " *    2 | -- embed";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(8);
        expect($error->selection['to']['line'])->toEqual(0);
        expect($error->selection['to']['column'])->toEqual(8);
    });
});

describe('Requesting a value error from an empty embed with a dynamically generated message', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "-- embed\n" .
                 "-- embed";
        
        try {
            throw Enolib\Parser::parse($input)->embed('embed')->valueError(function($_value) { return "my generated message"; });
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "There is a problem with the value of this element: my generated message";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | -- embed\n" .
                   " *    2 | -- embed";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(8);
        expect($error->selection['to']['line'])->toEqual(0);
        expect($error->selection['to']['column'])->toEqual(8);
    });
});

describe('Requesting a value error from a field with continuations with a static message', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field: value\n" .
                 "\\ continuation\n" .
                 "\\ continuation\n" .
                 "|\n" .
                 "\n" .
                 "|";
        
        try {
            throw Enolib\Parser::parse($input)->field('field')->valueError('my static message');
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "There is a problem with the value of this element: my static message";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | field: value\n" .
                   " *    2 | \\ continuation\n" .
                   " *    3 | \\ continuation\n" .
                   " *    4 | |\n" .
                   " *    5 | \n" .
                   " *    6 | |";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(7);
        expect($error->selection['to']['line'])->toEqual(5);
        expect($error->selection['to']['column'])->toEqual(1);
    });
});

describe('Requesting a value error from a field with continuations with a dynamically generated message', function() {
    it('throws the expected ValidationError', function() {
        $error = null;
        
        $input = "field: value\n" .
                 "\\ continuation\n" .
                 "\\ continuation\n" .
                 "|\n" .
                 "\n" .
                 "|";
        
        try {
            throw Enolib\Parser::parse($input)->field('field')->valueError(function($value) { return "my generated message for '{$value}'"; });
        } catch(Enolib\ValidationError $_error) {
            $error = $_error;
        }
        
        expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
        
        $text = "There is a problem with the value of this element: my generated message for 'value continuation continuation'";
        
        expect($error->text)->toEqual($text);
        
        $snippet = "   Line | Content\n" .
                   " >    1 | field: value\n" .
                   " *    2 | \\ continuation\n" .
                   " *    3 | \\ continuation\n" .
                   " *    4 | |\n" .
                   " *    5 | \n" .
                   " *    6 | |";
        
        expect($error->snippet)->toEqual($snippet);
        
        expect($error->selection['from']['line'])->toEqual(0);
        expect($error->selection['from']['column'])->toEqual(7);
        expect($error->selection['to']['line'])->toEqual(5);
        expect($error->selection['to']['column'])->toEqual(1);
    });
});