import { parse } from '..';
import { unpack } from './unpack.js';

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
        const document = parse(sample);
        expect(unpack(document)).toMatchSnapshot();
    });
});
