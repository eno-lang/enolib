import { parse, TerminalReporter } from '../javascript/lib/esm/main.js';
import glob from 'fast-glob';
import fs from 'fs';
import path from 'path';

const LANGUAGES = ['javascript', 'php', 'python', 'ruby'];
const LOCALES = ['de', 'en', 'es'];

const selection = value => {
    const match = value.match(/\[([0-9]+),([0-9]+)\] => \[([0-9]+),([0-9]+)\]/);
    
    if (!match)
        throw new Error('Illegal selection data - allowed format: [line,column] => [line,column]');
    
    return [[parseInt(match[1]), parseInt(match[2])], [parseInt(match[3]), parseInt(match[4])]];
};

export function source() {
    const specs = [];
    
    const blueprints = glob.sync('**/*.eno', { cwd: path.resolve('specs/blueprints') })
    
    for (const file of blueprints.sort()) {
        const specContent = fs.readFileSync(path.resolve('specs/blueprints', file), 'utf-8');
        const specDocument = parse(specContent, { reporter: TerminalReporter, source: file });
        
        const tests = [];
        
        for (const testSection of specDocument.sections()) {
            const test = {
                description: testSection.stringKey(),
                input: testSection.embed('input').requiredStringValue()
            };
            
            const errorSection = testSection.optionalSection('ParseError') ||
            testSection.optionalSection('ValidationError');
            
            if (errorSection) {
                test.error = {
                    selection: errorSection.field('selection').optionalValue(selection),
                    snippet: errorSection.embed('snippet').optionalStringValue(),
                    text: errorSection.embed('text').optionalStringValue(),
                    type: errorSection.stringKey()
                };
            }
            
            if (!test.error || test.error.type == 'ValidationError') {
                test.javascript = testSection.embed('javascript').requiredStringValue();
                test.php = testSection.embed('php').requiredStringValue();
                test.python = testSection.embed('python').requiredStringValue();
                test.ruby = testSection.embed('ruby').requiredStringValue();
            }
            
            const resultSection = testSection.optionalSection('Result');
            
            if (resultSection) {
                const stringEmbed = resultSection.optionalEmbed('string');
                
                if (stringEmbed) {
                    test.result = {
                        string: stringEmbed.requiredStringValue()
                    };
                } else {
                    test.result = {
                        javascript: resultSection.embed('javascript').requiredStringValue(),
                        php: resultSection.embed('php').requiredStringValue(),
                        python: resultSection.embed('python').requiredStringValue(),
                        ruby: resultSection.embed('ruby').requiredStringValue(),
                    };
                }
            }
            
            const nothingSection = testSection.optionalSection('Nothing');
            
            if (nothingSection) {
                test.result = { nothing: true };
                nothingSection.touch();
            }
            
            const passesSection = testSection.optionalSection('Passes');
            
            if (passesSection) {
                test.result = { passes: true };
                passesSection.touch();
            }
            
            tests.push(test);
        }
        
        specDocument.assertAllTouched();
        
        specs.push({
            path: file.substring(0, file.length - 4),
            tests
        });
    }
    
    return specs;
};
