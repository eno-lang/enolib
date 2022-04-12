import fs from 'fs';
import fsExtra from 'fs-extra';
import path from 'path';

import { escapeSingleQuotes, interpolatify, quotedPhpMultilineString } from '../../utilities.js';

export function php(specs) {
    const specDirectory = path.resolve('php/spec/generated');
    fsExtra.emptyDirSync(specDirectory);
    
    for (const spec of specs) {
        const filepath = path.join(specDirectory, `${spec.path}.spec.php`);
        
        const tests = [];
        for (const test of spec.tests) {
            if (test.hasOwnProperty('error')) {
                const { selection, snippet, text, type } = test.error;
                
                const expectations = [`expect($error)->toBeAnInstanceOf('Enolib\\${type}');`];
                
                if (text) {
                    expectations.push(interpolatify`
                        $text = ${quotedPhpMultilineString(text)};
                        
                        expect($error->text)->toEqual($text);
                    `);
                }
                    
                if (snippet) {
                    expectations.push(interpolatify`
                        $snippet = ${quotedPhpMultilineString(snippet)};
                        
                        expect($error->snippet)->toEqual($snippet);
                    `);
                }
                        
                if (selection) {
                    expectations.push(interpolatify`
                        expect($error->selection['from']['line'])->toEqual(${selection[0][0]});
                        expect($error->selection['from']['column'])->toEqual(${selection[0][1]});
                        expect($error->selection['to']['line'])->toEqual(${selection[1][0]});
                        expect($error->selection['to']['column'])->toEqual(${selection[1][1]});
                    `);
                }
                        
                tests.push(interpolatify`
                    describe('${escapeSingleQuotes(test.description)}', function() {
                        it('throws the expected ${type}', function() {
                            $error = null;
                            
                            $input = ${quotedPhpMultilineString(test.input)};
                            
                            try {
                                ${type === 'ParseError' ? 'Enolib\\Parser::parse($input);' : test.php}
                            } catch(Enolib\\${type} $_error) {
                                $error = $_error;
                            }
                            
                            ${expectations.join('\n\n')}
                        });
                    });
                `);
            }
                            
            if (test.hasOwnProperty('result')) {
                let expectation;
                
                if (test.result.nothing) {
                    expectation = 'expect($output)->toBeNull();';
                } else if (test.result.passes) {
                    expectation = `expect('it passes')->toBeTruthy();`;
                } else if (test.result.string) {
                    expectation = interpolatify`
                        $expected = ${quotedPhpMultilineString(test.result.string)};
                        
                        expect($output)->toEqual($expected);
                    `;
                } else {
                    expectation = `expect($output)->toEqual(${test.result.php});`;
                }
                
                tests.push(interpolatify`
                    describe('${escapeSingleQuotes(test.description)}', function() {
                        it('produces the expected result', function() {
                            $input = ${quotedPhpMultilineString(test.input)};
                            
                            ${test.php}
                            
                            ${expectation}
                        });
                    });
                `);
            }
        }
            
        const code = interpolatify`
            <?php declare(strict_types=1);
            
            ${tests.join('\n\n')}
        `;
        
        fsExtra.ensureDirSync(path.dirname(filepath));
        fs.writeFileSync(filepath, code);
    }
};
