"""Attach the report's official line to each in-stock catalog reference.

The line report omits product codes, so reconciliation uses the independently
extracted name, stock and sale price. Exact matches are preferred; remaining
PDF text truncations are paired one-to-one using conservative name similarity.
"""

from __future__ import annotations

import json
import re
import sys
import unicodedata
from collections import defaultdict
from difflib import SequenceMatcher
from pathlib import Path


def normalize(value: str) -> str:
    ascii_value = unicodedata.normalize("NFKD", value or "").encode(
        "ascii", "ignore"
    ).decode("ascii")
    return re.sub(r"[^A-Z0-9]", "", ascii_value.upper())


def main() -> None:
    if len(sys.argv) != 4:
        raise SystemExit(
            "Usage: enrich-inventory-lines.py inventory-stock.json "
            "inventory-lines.json output.json"
        )
    stock_path, lines_path, output_path = map(lambda arg: Path(arg).resolve(), sys.argv[1:])
    stock = json.loads(stock_path.read_text(encoding="utf-8"))
    lines = [
        row for row in json.loads(lines_path.read_text(encoding="utf-8"))
        if float(row["s"]) > 0
    ]
    if len(stock) != len(lines):
        raise SystemExit(f"Positive-stock count mismatch: {len(stock)} != {len(lines)}")

    by_triple: dict[tuple[str, float, int], list[int]] = defaultdict(list)
    for index, row in enumerate(lines):
        by_triple[(normalize(row["n"]), float(row["s"]), int(row["p"]))].append(index)

    assigned: dict[int, int] = {}
    used: set[int] = set()
    for index, row in enumerate(stock):
        candidates = by_triple[(normalize(row["n"]), float(row["s"]), int(row["p"]))]
        match = next((candidate for candidate in candidates if candidate not in used), None)
        if match is not None:
            assigned[index] = match
            used.add(match)

    pending = [index for index in range(len(stock)) if index not in assigned]
    while pending:
        proposals: list[tuple[float, int, int]] = []
        unused = [index for index in range(len(lines)) if index not in used]
        for stock_index in pending:
            row = stock[stock_index]
            same_values = [
                line_index for line_index in unused
                if float(lines[line_index]["s"]) == float(row["s"])
                and int(lines[line_index]["p"]) == int(row["p"])
            ]
            candidates = same_values or [
                line_index for line_index in unused
                if int(lines[line_index]["p"]) == int(row["p"])
            ] or unused
            best = max(
                candidates,
                key=lambda candidate: SequenceMatcher(
                    None, normalize(row["n"]), normalize(lines[candidate]["n"])
                ).ratio(),
            )
            score = SequenceMatcher(
                None, normalize(row["n"]), normalize(lines[best]["n"])
            ).ratio()
            proposals.append((score, stock_index, best))

        score, stock_index, line_index = max(proposals)
        if score < 0.58:
            raise SystemExit(
                f"Unsafe PDF reconciliation ({score:.3f}): "
                f"{stock[stock_index]['n']} <> {lines[line_index]['n']}"
            )
        assigned[stock_index] = line_index
        used.add(line_index)
        pending.remove(stock_index)

    output = []
    scores = []
    for index, row in enumerate(stock):
        matched = lines[assigned[index]]
        score = SequenceMatcher(
            None, normalize(row["n"]), normalize(matched["n"])
        ).ratio()
        scores.append(score)
        output.append({**row, "l": matched["l"], "h": matched["g"]})

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        json.dumps(output, ensure_ascii=False, separators=(",", ":")) + "\n",
        encoding="utf-8",
    )
    print(
        f"Enriched {len(output)} references; "
        f"minimum reconciliation score={min(scores):.3f}"
    )


if __name__ == "__main__":
    main()
