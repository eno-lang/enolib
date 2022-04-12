<?php declare(strict_types=1);

describe('Querying a comment with complex indentation from a section', function() {
    it('produces the expected result', function() {
        $input = "               >\n" .
                 "    > indented 0 spaces\n" .
                 ">\n" .
                 "  >       indented 4 spaces \n" .
                 ">       indented 2 spaces\n" .
                 "                              > indented 26 spaces\n" .
                 "                                 >\n" .
                 "# section";
        
        $output = Enolib\Parser::parse($input)->section('section')->requiredStringComment();
        
        $expected = "indented 0 spaces\n" .
                    "\n" .
                    "    indented 4 spaces\n" .
                    "  indented 2 spaces\n" .
                    "                          indented 26 spaces";
        
        expect($output)->toEqual($expected);
    });
});