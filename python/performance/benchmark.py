import json, time

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

reference = analysis['reference'] if 'reference' in analysis else None
modifications = { '_evaluated': str(datetime.now()) }

for name, content in SAMPLES.items():
    before = time.perf_counter()
    seconds = 0
    iterations = 0

    while seconds < 4:
        for i in range(0, 1000):
            parse(content)

        iterations += 1000
        seconds = time.perf_counter() - before

    ips = int(iterations / seconds)
    delta = ips - reference[name]['ips'] if reference else 0

    if delta == 0:
        change = "~0 ips (same)"
    elif delta > 0:
        factor = round(ips / reference[name]['ips'], 3) if reference else 0
        change = f"+{delta} ips ({factor}× faster)"
    else:
        factor = round(reference[name]['ips'] / ips, 3) if reference else 0
        change = f"{delta} ips ({factor}× slower)"

    modifications[name] = {
        'change': change,
        'ips': ips
    }

    print(f"{change} [{name}]")

analysis['modifications'] = modifications

with open('performance/analysis.json', 'w') as file:
    file.write(json.dumps(analysis, ensure_ascii=False, indent=2, sort_keys=True, separators=(',', ': ')))
