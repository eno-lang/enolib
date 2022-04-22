import json
import yaml

def cyclic_dict_safe_comparison(a, b):
    def compare(a, b, visited_dicts_a, visited_dicts_b, path):
        if isinstance(a, dict):
            if id(a) in visited_dicts_a:
                return id(b) in visited_dicts_b and visited_dicts_a[id(a)] == visited_dicts_b[id(b)]

            visited_dicts_a[id(a)] = path
            
            if not isinstance(b, dict):
                return False
            
            visited_dicts_b[id(b)] = path

            return (a.keys() == b.keys() and
                all([compare(a[k], b[k], visited_dicts_a, visited_dicts_b, path + [k]) for k in b.keys()]))

        if isinstance(a, list):
            return (isinstance(b, list) and
                len(a) == len(b) and
                all([compare(a[k], b[k], visited_dicts_a, visited_dicts_b, path + [k]) for k in range(len(b))]))

        return a == b

    return compare(a, b, {}, {}, [])

def match_object_snapshot(content, filename):
    try:
        with open(filename, 'r') as file:
            snapshot = yaml.full_load(file.read())

        if cyclic_dict_safe_comparison(content, snapshot):
            return True

        comparison_filename = filename + '.actual'

        with open(comparison_filename, 'w') as file:
            file.write(yaml.dump(content))

        print(f"1 snapshot comparison file written to {comparison_filename}")

        return False
    except FileNotFoundError:
        with open(filename, 'w') as file:
            file.write(yaml.dump(content))

        print(f"1 snapshot written to {filename}")

        return content

def snapshot(content, filename):
    extension = filename.split('.')[-1]
    json_snapshot = extension == 'json'

    try:
        with open(filename, 'r') as file:
            persisted = file.read()

            if json_snapshot:
                return json.loads(persisted)

            return persisted
    except FileNotFoundError:
        with open(filename, 'w') as file:
            if json_snapshot:
                persistable = json.dumps(content, ensure_ascii=False, indent=2, separators=(',', ': '))
            else:
                persistable = content

            file.write(persistable)

        print(f"1 snapshot written to {filename}")

        return content
