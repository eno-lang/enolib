const eno = require('..');

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
    element: 'color', // 'o'
    position: [3],
    range: 'key'
  },
  {
    element: 'color', // 'o'
    position: [0, 3],
    range: 'key'
  },
  {
    element: 'color', // ' '
    position: [6],
    range: 'elementOperator'
  },
  {
    element: 'color', // ' '
    position: [0, 6],
    range: 'elementOperator'
  },
  {
    element: 'color', // 'c'
    position: [7],
    range: 'value'
  },
  {
    element: 'color', // 'c'
    position: [0, 7],
    range: 'value'
  },
  {
    element: 'close', // 'u'
    position: [18],
    range: 'value'
  },
  {
    element: 'close', // 'u'
    position: [1, 6],
    range: 'value'
  },
  {
    element: 'notes', // '#'
    position: [21],
    range: 'sectionOperator'
  },
  {
    element: 'notes', // '#'
    position: [2, 0],
    range: 'sectionOperator'
  },
  {
    element: 'notes', // 's'
    position: [27],
    range: 'key'
  },
  {
    element: 'notes', // 's'
    position: [2, 6],
    range: 'key'
  },
  {
    element: 'long', // 'i'
    position: [37],
    range: 'value'
  },
  {
    element: 'long', // 'i'
    position: [4, 0],
    range: 'value'
  },
  {
    element: 'long', // 'n'
    position: [45],
    range: 'key'
  },
  {
    element: 'long', // 'n'
    position: [5, 5],
    range: 'key'
  }
];

describe('Element/Token lookup', () => {
  for(let scenario of scenarios) {
    describe(`at (${scenario.position.join(', ')})`, () => {

      let lookup;
      if(scenario.position.length === 1) {
        lookup = eno.lookup({ index: scenario.position[0] }, sample);
      } else {
        lookup = eno.lookup({ column: scenario.position[1], line: scenario.position[0] }, sample);
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
