const { parse } = require('..');

const sample = `
empty:
leer:

-

-

-

nichts:
nada:

# nothing
## none
void:
emptyness:
-- leere
-- leere

# ningun
absence:
-

-
-


non:
end:
`;

describe('Elements without values', () => {
  it('correctly parses', () => {
    const doc = parse(sample);
    expect(doc.raw()).toMatchSnapshot();
  });
});
