import json, time
import pytest

from datetime import datetime

import sys, os
sys.path.insert(0, os.getcwd())
from enolib import parse

SAMPLES = {}

for name in ['configuration', 'content', 'hierarchy', 'invoice', 'journey', 'post']:
    with open(f"performance/samples/{name}.eno") as file:
        SAMPLES[name] = file.read()

try:
    with open('performance/analysis.json') as file:
        analysis = json.loads(file.read())
except:
    analysis = {}

if 'reset' in sys.argv or not 'reference' in analysis:
    reference = None
    if 'modifications' in analysis:
        del analysis['modifications']
    analysis['reference'] = { '_evaluated': str(datetime.now()) }
else:
    reference = analysis['reference']
    analysis['modifications'] = { '_evaluated': str(datetime.now()) }

for name, content in SAMPLES.items():
    begin = time.process_time()
    seconds = 0
    iterations = 0

    while seconds < 4:
        for i in range(0, 1000):
            parse(content)

        iterations += 1000
        seconds = time.process_time() - begin

    ips = int(iterations / seconds)
    
    if reference:
        delta = ips - reference[name]['ips'] if reference else 0

        if delta == 0:
            change = "~0 ips (same)"
        elif delta > 0:
            factor = round(ips / reference[name]['ips'], 3) if reference else 0
            change = f"+{delta} ips ({factor}× faster)"
        else:
            factor = round(reference[name]['ips'] / ips, 3) if reference else 0
            change = f"{delta} ips ({factor}× slower)"

        analysis['modifications'][name] = { 'change': change, 'ips': ips }
        print(f"{change} [{name}]")
    else:
        analysis['reference'][name] = { 'ips': ips }
        print(f"{ips} ips [{name}]")

with open('performance/analysis.json', 'w') as file:
    file.write(json.dumps(analysis, ensure_ascii=False, indent=2, sort_keys=True, separators=(',', ': ')))
