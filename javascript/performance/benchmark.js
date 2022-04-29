import { parse } from '../lib/main.js';
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

const analysisFile = path.resolve('performance/analysis.json');

let analysis;
if (fs.existsSync(analysisFile)) {
    analysis = JSON.parse(fs.readFileSync(analysisFile, 'utf-8'));
} else {
    analysis = {};
}

let reference;
if (process.argv.includes('reset') || !analysis.hasOwnProperty('reference')) {
    reference = null;
    delete analysis.modifications;
    analysis.reference = { _evaluated: new Date() };
} else {
    reference = analysis.reference;
    analysis.modifications = { _evaluated: new Date() };
}

for (const [name, content] of Object.entries(SAMPLES)) {
    const begin = performance.now();
    let milliseconds = 0;
    let iterations = 0;
    
    while (milliseconds < 4000) {
        for (let i = 0; i < 1000; i++) {
            parse(content);
        }
        
        iterations += 1000;
        milliseconds = performance.now() - begin;
    }
    
    const ips = parseInt(iterations / (milliseconds / 1000.0));
    
    if (reference) {
        const delta = ips - reference[name]['ips'];
        
        let change;
        if (delta === 0) {
            change = "~0 ips (same)";
        } else if (delta >= 0) {
            const factor = reference ? (ips / reference[name]['ips']).toPrecision(3) : 0;
            change = `+${delta} ips (${factor}× faster)`;
        } else {
            const factor = reference ? (reference[name]['ips'] / ips).toPrecision(3) : 0;
            change = `${delta} ips (${factor}× slower)`;
        }
        
        analysis.modifications[name] = { change, ips };    
        console.log(`${change} [${name}]`);
    } else {
        analysis.reference[name] = { ips };
        console.log(`${ips} ips [${name}]`);
    }
}

fs.writeFileSync(path.resolve('performance/analysis.json'), JSON.stringify(analysis, null, 2));
