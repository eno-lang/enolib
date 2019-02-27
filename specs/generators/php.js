const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');

const { interpolatify, escapeSingleQuotes, quotedPhpMultilineString } = require('../../utilities.js');

module.exports = async specs => {
  const specDirectory = path.join(__dirname, '../../php/spec/generated');
  await fsExtra.emptyDir(specDirectory);

  for(const spec of specs) {
    const filepath = path.join(specDirectory, spec.path + '.spec.php');

    const tests = [];
    for(const test of spec.tests) {
      if(test.hasOwnProperty('error')) {
        const { selection, snippet, text, type } = test.error;

        const expectations = [`expect($error)->toBeAnInstanceOf('Eno\\${type}');`];

        if(text) {
          expectations.push(interpolatify`
            $text = ${quotedPhpMultilineString(text)};

            expect($error->text)->toEqual($text);
          `);
        }

        if(snippet) {
          expectations.push(interpolatify`
            $snippet = ${quotedPhpMultilineString(snippet)};

            expect($error->snippet)->toEqual($snippet);
          `);
        }

        if(selection) {
          expectations.push(interpolatify`
            $selection = [[${selection[0][0]},${selection[0][1]}], [${selection[1][0]},${selection[1][1]}]];

            expect($error->selection)->toEqual($selection);
          `);
        }

        tests.push(interpolatify`
          describe('${escapeSingleQuotes(test.description)}', function() {
            it('throws the expected ${type}', function() {
              $error = null;

              $input = ${quotedPhpMultilineString(test.input)};

              try {
                ${type === 'ParseError' ? 'Eno\\Parser::parse($input);' : test.php}
              } catch(Eno\\${type} $_error) {
                $error = $_error;
              }

              ${expectations.join('\n\n')}
            });
          });
        `);
      }

      if(test.hasOwnProperty('result')) {
        let expectation;

        if(test.result.nothing) {
          expectation = 'expect($output)->toBeNull();';
        } else if(test.result.passes) {
          expectation = `expect('it passes')->toBeTruthy();`;
        } else if(test.result.string) {
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

    await fsExtra.ensureDir(path.dirname(filepath));
    await fs.promises.writeFile(filepath, code);
  }
};
