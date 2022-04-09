const source = require('./source.js');
const javascript = require('./generators/javascript.js');
const php = require('./generators/php.js');
const python = require('./generators/python.js');
const ruby = require('./generators/ruby.js');

const generate = async () => {
    const scenarios = source();
    
    await javascript(scenarios);
    await php(scenarios);
    await python(scenarios);
    await ruby(scenarios);
};

generate();
