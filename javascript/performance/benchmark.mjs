import { parse } from '../lib/esm/main.js';
import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';

const SAMPLES = {
    configuration: fs.readFileSync(path.resolve('performance/samples/configuration.eno'), 'utf-8'),
    content: fs.readFileSync(path.resolve('performance/samples/content.eno'), 'utf-8'),
    hierarchy: fs.readFileSync(path.resolve('performance/samples/hierarchy.eno'), 'utf-8'),
    invoice: fs.readFileSync(path.resolve('performance/samples/invoice.eno'), 'utf-8'),
    journey: fs.readFileSync(path.resolve('performance/samples/journey.eno'), 'utf-8'),
    post: fs.readFileSync(path.resolve('performance/samples/post.eno'), 'utf-8')
};

let analysis, reference;

const analysisFile = path.resolve('performance/analysis.json');

if (fs.existsSync(analysisFile)) {
    analysis = JSON.parse(fs.readFileSync(analysisFile, 'utf-8'));
} else {
    analysis = {};
}

reference = analysis.hasOwnProperty('reference') ? analysis.reference : null;
analysis.modifications = { _evaluated: new Date() };

for (let [name, content] of Object.entries(SAMPLES)) {
    const before = performance.now();
    let milliseconds = 0;
    let iterations = 0;
    
    while (milliseconds < 4000) {
        for (let i = 0; i < 1000; i++) {
            parse(content);
        }
        
        iterations += 1000;
        milliseconds = performance.now() - before;
    }
    
    const ips = parseInt(iterations / (milliseconds / 1000.0));
    const delta = reference ? ips - reference[name]['ips'] : 0;
    
    let change, factor;
    if (delta === 0) {
        change = "~0 ips (same)";
    } else if (delta >= 0) {
        factor = reference ? (ips / reference[name]['ips']).toPrecision(3) : 0;
        change = `+${delta} ips (${factor}× faster)`;
    } else {
        factor = reference ? (reference[name]['ips'] / ips).toPrecision(3) : 0;
        change = `${delta} ips (${factor}× slower)`;
    }
    
    analysis.modifications[name] = {
        change: change,
        ips: ips
    };
    
    console.log(`${change} [${name}]`);
}

fs.writeFileSync(path.resolve('performance/analysis.json'), JSON.stringify(analysis, null, 2));
