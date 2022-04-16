import { parse } from '..';
import { unpack } from './unpack.js';

const input = `
Titel: Tlatelolco: Wohnblocks, Ruinen und Massaker
Untertitel: »Tlatelolco«, ein Film von Lotte Schreiber

Bild:

Autoren:
- Georg Oswald

Datum: 2013-01-01
Sprache: DE

Kategorien:
- Besprechung
- Film

Tags:
- Mexiko
- Tlatelolco
- Olympische Spiele
- Architektur
- Mexico City
- Polizeigewalt

Permalink: tlatelolco-wohnblocks-ruinen-und-massaker

Buchbesprechungen:

Lesbar: Ja

Urbanize:

-- Abstract
-- Abstract

-- Text
Der Stadtteil Tlatelolco ist ein Ort, ...
...Österreich, Mexiko, 75 min
-- Text

-- Literaturverzeichnis
-- Literaturverzeichnis
`.trim();

describe('Tlateloco sample', () => {
    test('parses correctly', () => {
        const document = parse(input);
        
        expect(unpack(document)).toMatchSnapshot();
    });
});
