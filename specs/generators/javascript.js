const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');

const { interpolatify, escapeSingleQuotes, quotedJavaScriptMultilineString } = require('../../utilities.js');

module.exports = async specs => {
  const specDirectory = path.join(__dirname, '../../javascript/specs/generated');
  await fsExtra.emptyDir(specDirectory);

  for(const spec of specs) {
    const filepath = path.join(specDirectory, spec.path + '.spec.js');

    const tests = [];
    for(const test of spec.tests) {
      if(test.hasOwnProperty('error')) {
        const { selection, snippet, text, type } = test.error;

        const expectations = [`expect(error).toBeInstanceOf(eno.${type});`];

        if(text) {
          expectations.push(interpolatify`
            const text = ${quotedJavaScriptMultilineString(text)};

            expect(error.text).toEqual(text);
          `);
        }

        if(snippet) {
          expectations.push(interpolatify`
            const snippet = ${quotedJavaScriptMultilineString(snippet)};

            expect(error.snippet).toEqual(snippet);
          `);
        }

        if(selection) {
          expectations.push(interpolatify`
            expect(error.selection.from.line).toEqual(${selection[0][0]});
            expect(error.selection.from.column).toEqual(${selection[0][1]});
            expect(error.selection.to.line).toEqual(${selection[1][0]});
            expect(error.selection.to.column).toEqual(${selection[1][1]});
          `);
        }

        tests.push(interpolatify`
          describe('${escapeSingleQuotes(test.description)}', () => {
            it('throws the expected ${type}', () => {
              let error = null;

              const input = ${quotedJavaScriptMultilineString(test.input)};

              try {
                ${type === 'ParseError' ? 'eno.parse(input);' : test.javascript}
              } catch(_error) {
                if(_error instanceof eno.${type}) {
                  error = _error;
                } else {
                  throw _error;
                }
              };

              ${expectations.join('\n\n')}
            });
          });
        `);
      }

      if(test.hasOwnProperty('result')) {
        let expectation;

        if(test.result.nothing) {
          expectation = 'expect(output).toBeNull();';
        } else if(test.result.passes) {
          expectation = `expect('it passes').toBeTruthy();`;
        } else if(test.result.string) {
          expectation = interpolatify`
            const expected = ${quotedJavaScriptMultilineString(test.result.string)};

            expect(output).toEqual(expected);
          `;
        } else {
          expectation = `expect(output).toEqual(${test.result.javascript});`;
        }

        tests.push(interpolatify`
          describe('${escapeSingleQuotes(test.description)}', () => {
            it('produces the expected result', () => {
              const input = ${quotedJavaScriptMultilineString(test.input)};

              ${test.javascript}

              ${expectation}
            });
          });
        `);
      }
    }

    const code = interpolatify`
      const eno = require('../..${'/..'.repeat((spec.path.match(/\//g) || []).length)}');

      ${tests.join('\n\n')}
    `;

    await fsExtra.ensureDir(path.dirname(filepath));
    await fs.promises.writeFile(filepath, code);
  }
};
