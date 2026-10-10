"""Two-sided check for the `songs` table shape (connection 3).

  python check_songs_shape.py --shape songs.shape.json --publish publish.py   producer side (audio-processing)
  python check_songs_shape.py --shape songs.shape.json --drizzle schema.ts    consumer side (web-app; keeps its own copy of this file and the shape)

Producer side compares the column names in publish.py's INSERT. Consumer side
compares column names, types and not-null in the Drizzle schema. Exit 1 on drift.
Stdlib only, so it runs anywhere.
"""
import argparse
import json
import re
import sys


def shape_columns(path):
    return {c["name"]: c for c in json.load(open(path))["columns"]}


def publish_columns(path):
    m = re.search(r"INSERT INTO songs \(([^)]*)\)", open(path).read())
    if not m:
        raise SystemExit(f"no INSERT INTO songs found in {path}")
    return [c.strip() for c in m.group(1).split(",")]


def drizzle_columns(path):
    """name -> (type, notNull) from lines like  coverArtUrl: text("cover_art_url"),  inside sqliteTable("songs")."""
    src = open(path).read()
    m = re.search(r'sqliteTable\(\s*"songs"\s*,\s*\{(.*?)\n\}\s*\)', src, re.S)
    if not m:
        raise SystemExit(f'no sqliteTable("songs", {{...}}) found in {path}')
    cols = {}
    for km in re.finditer(r'(text|real|integer)\(\s*"(\w+)"[^)]*\)((?:\s*\.\s*[\w$]+(?:<[^>]*>)?\([^)]*\))*)', m.group(1)):
        chain = km.group(3)
        cols[km.group(2)] = (km.group(1).upper(), ".notNull()" in chain or ".primaryKey()" in chain)
    return cols


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--shape", required=True)
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--publish")
    g.add_argument("--drizzle")
    a = ap.parse_args()
    shape = shape_columns(a.shape)
    problems = []
    if a.publish:
        got = publish_columns(a.publish)
        for n in sorted(set(shape) - set(got)):
            problems.append(f"publish.py does not write column '{n}'")
        for n in sorted(set(got) - set(shape)):
            problems.append(f"publish.py writes column '{n}' that is not in the shape")
    else:
        got = drizzle_columns(a.drizzle)
        for n in sorted(set(shape) - set(got)):
            problems.append(f"Drizzle schema lacks column '{n}'")
        for n in sorted(set(got) - set(shape)):
            problems.append(f"Drizzle schema has column '{n}' that is not in the shape")
        for n in sorted(set(shape) & set(got)):
            want = (shape[n]["type"], shape[n]["notNull"])
            if got[n] != want:
                problems.append(f"column '{n}': shape {want}, Drizzle {got[n]}")
    if problems:
        print("songs shape DRIFT:\n  " + "\n  ".join(problems))
        sys.exit(1)
    print(f"songs shape OK ({len(shape)} columns)")


if __name__ == "__main__":
    main()
