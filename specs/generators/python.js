const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');

const { filenamify, interpolatify, quotedPythonMultilineString } = require('../../utilities.js');

module.exports = async specs => {
  const specDirectory = path.join(__dirname, '../../python/tests/generated');
  await fsExtra.emptyDir(specDirectory);

  for(const spec of specs) {
    const pathComponents = spec.path.split('/');
    pathComponents[pathComponents.length - 1] = `test_${pathComponents[pathComponents.length - 1]}.py`;

  const filepath = path.join(specDirectory, pathComponents.join('/'));

    const tests = [];
    for(const test of spec.tests) {
      if(test.hasOwnProperty('error')) {
        const { cursor, selection, snippet, text, type } = test.error;

        const expectations = [`assert type(error) is enolib.${type}`];

        if(text) {
          expectations.push(interpolatify`
            text = ${quotedPythonMultilineString(text)}

            assert error.text == text
          `);
        }

        if(snippet) {
          expectations.push(interpolatify`
            snippet   = ${quotedPythonMultilineString(snippet)}

            assert error.snippet == snippet
          `);
        }

        if(selection) {
          expectations.push(interpolatify`
            selection = [[${selection[0][0]},${selection[0][1]}], [${selection[1][0]},${selection[1][1]}]]

            assert error.selection == selection
          `);
        }

        tests.push(interpolatify`
          def test_${filenamify(test.description)}_raises_the_expected_${filenamify(type)}():
            error = None

            input = ${quotedPythonMultilineString(test.input)}

            try:
              ${type === 'ParseError' ? 'enolib.parse(input)' : test.python}
            except enolib.${type} as _error:
              if isinstance(_error, enolib.${type}):
                error = _error
              else:
                raise _error

            ${expectations.join('\n\n')}
        `);
      }

      if(test.hasOwnProperty('result')) {
        let expectation;

        if(test.result.nothing) {
          expectation = 'assert output == None';
        } else if(test.result.passes) {
          expectation = `assert bool('it passes') is True`;
        } else if(test.result.string) {
          expectation = interpolatify`
            expected = ${quotedPythonMultilineString(test.result.string)}

            assert output == expected
          `;
        } else {
          expectation = `assert output == ${test.result.python}`;
        }

        tests.push(interpolatify`
          def test_${filenamify(test.description)}_produces_the_expected_result():
            input = ${quotedPythonMultilineString(test.input)}

            ${test.python}

            ${expectation}
        `);
      }
    }

    const code = interpolatify`
      import enolib

      ${tests.join('\n\n')}
    `;

    const testDirectory = path.dirname(filepath);
    const initFilepath = path.join(testDirectory, '__init__.py');

    await fsExtra.ensureDir(testDirectory);
    await fsExtra.ensureFile(initFilepath);
    await fs.promises.writeFile(filepath, code);
  }
};
