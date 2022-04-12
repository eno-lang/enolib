import { source } from './source.js';
import { javascript } from './generators/javascript.js';
import { php } from './generators/php.js';
import { python } from './generators/python.js';
import { ruby } from './generators/ruby.js';

function generate() {
    const scenarios = source();
    
    javascript(scenarios);
    php(scenarios);
    python(scenarios);
    ruby(scenarios);
};

generate();
