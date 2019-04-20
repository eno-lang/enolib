import json


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
