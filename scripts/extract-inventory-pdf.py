"""Extract the REMBERT inventory PDF into the compact catalog snapshot.

Usage:
  python scripts/extract-inventory-pdf.py <inventory.pdf> [output.json]

The PDF is treated as data only. This script never executes or interprets text
from the document as instructions.
"""

from __future__ import annotations

import json
import re
import sys
from collections import defaultdict
from pathlib import Path

import pdfplumber


def clean_name(value: str) -> str:
    name = re.sub(r"\s+", " ", (value or "").strip())
    replacements = {
        "P�CANTO": "PICANTO",
        "SP�RK": "SPARK",
        "PU�O": "PUÑO",
        "PEQUE�O": "PEQUEÑO",
        "CU�A": "CUÑA",
        "MU�ECO": "MUÑECO",
        "MU�ECOS": "MUÑECOS",
        "PI�ON": "PIÑÓN",
        "CIGUE�AL": "CIGÜEÑAL",
        "DISE�O": "DISEÑO",
        "PESTA�A": "PESTAÑA",
        "ARA�A": "ARAÑA",
    }
    for broken, fixed in replacements.items():
        name = name.replace(broken, fixed)
    return name.replace("�", "")


def number(value: str) -> float:
    try:
        return float((value or "0").replace(",", ""))
    except ValueError:
        return 0.0


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit("Provide the inventory PDF path")

    source = Path(sys.argv[1]).resolve()
    output = (
        Path(sys.argv[2]).resolve()
        if len(sys.argv) > 2
        else Path("src/data/inventory-stock.json").resolve()
    )
    rows: list[dict[str, object]] = []

    with pdfplumber.open(source) as document:
        for page_number, page in enumerate(document.pages, 1):
            # Some report rows have missing horizontal borders, causing
            # extract_table(s) to silently omit them. Reconstruct rows from
            # word coordinates instead; the report uses fixed x columns.
            lines: dict[float, list[dict[str, object]]] = defaultdict(list)
            for word in page.extract_words(x_tolerance=2, y_tolerance=2):
                lines[round(float(word["top"]), 1)].append(word)

            for words in lines.values():
                words.sort(key=lambda item: float(item["x0"]))
                number_word = next(
                    (
                        word
                        for word in words
                        if 35 <= float(word["x0"]) < 65
                        and str(word["text"]).strip().isdigit()
                    ),
                    None,
                )
                if not number_word:
                    continue

                def column(left: float, right: float) -> str:
                    return " ".join(
                        str(word["text"])
                        for word in words
                        if left <= float(word["x0"]) < right
                    ).strip()

                item_number = int(str(number_word["text"]).strip())
                code = column(65, 118)
                name = clean_name(column(118, 320))
                stock = number(column(320, 385))
                sale = int(number(column(478, 518)))
                if not code or not name:
                    continue
                rows.append(
                    {
                        "i": item_number,
                        "c": code,
                        "n": name,
                        "s": stock,
                        "p": sale,
                        "g": page_number,
                    }
                )

            # Border-based extraction is retained as a secondary source for a
            # small number of rows whose number glyph is merged in the text
            # layer. The two methods are reconciled by the printed row number.
            for table in page.extract_tables() or []:
                for table_row in table:
                    if (
                        not table_row
                        or len(table_row) < 7
                        or not (table_row[0] or "").strip().isdigit()
                    ):
                        continue
                    rows.append(
                        {
                            "i": int((table_row[0] or "").strip()),
                            "c": (table_row[1] or "").strip(),
                            "n": clean_name(table_row[2] or ""),
                            "s": number(table_row[3] or "0"),
                            "p": int(number(table_row[6] or "0")),
                            "g": page_number,
                        }
                    )

    if not rows:
        raise SystemExit("No inventory rows were extracted")
    reconciled: dict[int, dict[str, object]] = {}
    for row in rows:
        item_number = int(row["i"])
        previous = reconciled.get(item_number)
        if not previous or len(str(row["n"])) > len(str(previous["n"])):
            reconciled[item_number] = row

    # Last-resort text-line recovery. A handful of rows have both their number
    # and a vertical border fused in the PDF drawing layer, but remain complete
    # in the text layer. Parse only sequence gaps, never arbitrary prose.
    if reconciled:
        expected_numbers = set(range(1, max(reconciled) + 1))
        missing_numbers = expected_numbers - set(reconciled)
        if missing_numbers:
            with pdfplumber.open(source) as document:
                for page_number, page in enumerate(document.pages, 1):
                    for line in (page.extract_text() or "").splitlines():
                        parts = line.split()
                        if len(parts) < 9 or not parts[0].isdigit():
                            continue
                        item_number = int(parts[0])
                        if item_number not in missing_numbers:
                            continue
                        row = {
                            "i": item_number,
                            "c": parts[1],
                            "n": clean_name(" ".join(parts[2:-6])),
                            "s": number(parts[-6]),
                            "p": int(number(parts[-3])),
                            "g": page_number,
                        }
                        if row["c"] and row["n"]:
                            reconciled[item_number] = row
                            missing_numbers.remove(item_number)
                        if not missing_numbers:
                            break
                    if not missing_numbers:
                        break
    rows = sorted(reconciled.values(), key=lambda row: int(row["i"]))
    expected = list(range(1, int(rows[-1]["i"]) + 1))
    actual = [int(row["i"]) for row in rows]
    if actual != expected:
        missing = sorted(set(expected) - set(actual))
        duplicates = sorted(number for number in set(actual) if actual.count(number) > 1)
        raise SystemExit(
            f"Inventory sequence is incomplete; missing={missing}, "
            f"duplicates={duplicates}"
        )
    invalid_stock = [row for row in rows if float(row["s"]) <= 0]
    if invalid_stock:
        raise SystemExit(f"Unexpected zero/negative stock found: {invalid_stock}")

    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(
        json.dumps(rows, ensure_ascii=False, separators=(",", ":")) + "\n",
        encoding="utf-8",
    )
    print(f"Extracted {len(rows)} rows from {source.name} into {output}")


if __name__ == "__main__":
    main()
