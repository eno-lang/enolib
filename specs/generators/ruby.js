import fs from 'fs';
import fsExtra from 'fs-extra';
import path from 'path';

import { escapeSingleQuotes, interpolatify, quotedRubyMultilineString } from '../../utilities.js';

export function ruby(specs) {
    const specDirectory = path.resolve('ruby/spec/generated');
    fsExtra.emptyDirSync(specDirectory);
    
    for (const spec of specs) {
        const filepath = path.join(specDirectory, spec.path + '.spec.rb');
        
        const tests = [];
        for (const test of spec.tests) {
            if (test.hasOwnProperty('error')) {
                const { cursor, selection, snippet, text, type } = test.error;
                
                const expectations = [];
                
                if (text) {
                    expectations.push(interpolatify`
                        text = ${quotedRubyMultilineString(text)}
                        
                        expect(error.text).to eq(text)
                    `);
                }
                    
                if (snippet) {
                    expectations.push(interpolatify`
                        snippet = ${quotedRubyMultilineString(snippet)}
                        
                        expect(error.snippet).to eq(snippet)
                    `);
                }
                        
                if (selection) {
                    expectations.push(interpolatify`
                        expect(error.selection[:from][:line]).to eq(${selection[0][0]})
                        expect(error.selection[:from][:column]).to eq(${selection[0][1]})
                        expect(error.selection[:to][:line]).to eq(${selection[1][0]})
                        expect(error.selection[:to][:column]).to eq(${selection[1][1]})
                    `);
                }
                            
                // TODO: This doesn't make sure anymore that there is always an error raised?
                tests.push(interpolatify`
                    describe '${escapeSingleQuotes(test.description)}' do
                      it 'raises the expected ${type}' do
                        input = ${quotedRubyMultilineString(test.input)}
                   
                        begin
                          ${type === 'ParseError' ? 'Enolib.parse(input)' : test.ruby}
                        rescue Enolib::${type} => error
                          ${expectations.join('\n\n')}
                        end
                      end
                    end
                `);
            }
                            
            if (test.hasOwnProperty('result')) {
                let expectation;
                
                if (test.result.nothing) {
                    expectation = 'expect(output).to be_nil';
                } else if (test.result.passes) {
                    expectation = `expect('it passes').to be_truthy`;
                } else if (test.result.string) {
                    expectation = interpolatify`
                        expected = ${quotedRubyMultilineString(test.result.string)}
                        
                        expect(output).to eq(expected)
                    `;
                } else {
                    expectation = `expect(output).to eq(${test.result.ruby})`;
                }
                
                tests.push(interpolatify`
                    describe '${escapeSingleQuotes(test.description)}' do
                      it 'produces the expected result' do
                        input = ${quotedRubyMultilineString(test.input)}
                        
                        ${test.ruby}
                        
                        ${expectation}
                      end
                    end
                `);
            }
        }
                            
        const code = interpolatify`
            # frozen_string_literal: true
            
            ${tests.join('\n\n')}
        `;
        
        fsExtra.ensureDirSync(path.dirname(filepath));
        fs.writeFileSync(filepath, code);
    }
};
