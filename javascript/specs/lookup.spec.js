const enolib = require('..');

const sample = `
color: cyan
close:up
# notes
-- long
is
-- long
`.trim();

const scenarios = [
  {
    element: 'color', // '|color'
    position: [0],
    range: 'key'
  },
  {
    element: 'color', // '|color'
    position: [0, 0],
    range: 'key'
  },
  {
    element: 'color', // 'col|or'
    position: [3],
    range: 'key'
  },
  {
    element: 'color', // 'col|or'
    position: [0, 3],
    range: 'key'
  },
  {
    element: 'color', // 'color:|'
    position: [6],
    range: 'elementOperator'
  },
  {
    element: 'color', // 'color:|'
    position: [0, 6],
    range: 'elementOperator'
  },
  {
    element: 'color', // '|close'
    position: [7],
    range: 'value'
  },
  {
    element: 'color', // '|close'
    position: [0, 7],
    range: 'value'
  },
  {
    element: 'close', // '|up'
    position: [18],
    range: 'value'
  },
  {
    element: 'close', // '|up'
    position: [1, 6],
    range: 'value'
  },
  {
    element: 'notes', // '|#'
    position: [21],
    range: 'sectionOperator'
  },
  {
    element: 'notes', // '|#'
    position: [2, 0],
    range: 'sectionOperator'
  },
  {
    element: 'notes', // 'note|s'
    position: [27],
    range: 'key'
  },
  {
    element: 'notes', // 'note|s'
    position: [2, 6],
    range: 'key'
  },
  {
    element: 'long', // '|is'
    position: [37],
    range: 'value'
  },
  {
    element: 'long', // '|is'
    position: [4, 0],
    range: 'value'
  },
  {
    element: 'long', // 'lo|ng'
    position: [45],
    range: 'key'
  },
  {
    element: 'long', // 'lo|ng'
    position: [5, 5],
    range: 'key'
  },
  {
    element: 'long', // 'long|'
    position: [47],
    range: 'key'
  },
  {
    element: 'long', // 'long|'
    position: [5, 7],
    range: 'key'
  }
];

describe('Element/Token lookup', () => {
  for(let scenario of scenarios) {
    describe(`at (${scenario.position.join(', ')})`, () => {

      let lookup;
      if(scenario.position.length === 1) {
        lookup = enolib.lookup({ index: scenario.position[0] }, sample);
      } else {
        lookup = enolib.lookup({ column: scenario.position[1], line: scenario.position[0] }, sample);
      }

      it(`looks up element '${scenario.element}'`, () => {
        expect(lookup.element.stringKey()).toEqual(scenario.element);
      });

      it(`looks up range '${scenario.range}'`, () => {
        expect(lookup.range).toEqual(scenario.range);
      });
    });
  }
});
