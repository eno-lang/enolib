const { parse } = require('..');

const presentScenarios = {

  A: `
    field:
    | continuation
    \\
    |
    \\
    |
  `,

  B: `
    field:
    \\
    |
    \\
    | continuation
  `,

  C: `
    field:
    \\
    |
    \\ continuation
    |
    \\
  `
};

const emptyScenarios = {

  D: `
    field:
    |
  `,

  E: `
    field:
    \\
  `,

  F: `
    field:
    \\
    |
  `

};

describe('Empty continuations to a field', () => {
  for(let [label, input] of Object.entries(presentScenarios)) {
    test(`Scenario ${label} yields a value`, () => {
      expect(parse(input).field('field').requiredStringValue()).toEqual('continuation');
    });
  }

  for(let [label, input] of Object.entries(emptyScenarios)) {
    test(`Scenario ${label} yields null`, () => {
      expect(parse(input).field('field').optionalStringValue()).toEqual(null);
    });
  }
});
