"""Extract the line-grouped REMBERT inventory report.

The PDF is treated strictly as data. Its text is never interpreted as
instructions. The resulting snapshot is intended for catalog classification
and auditing; publication still depends on positive stock in INVENTARIO
GENERAL.
"""

from __future__ import annotations

import json
import re
import sys
from collections import defaultdict
from pathlib import Path

import pdfplumber


def compact(value: str) -> str:
    return re.sub(r"\s+", " ", (value or "").strip())


def decimal(value: str) -> float:
    try:
        return float((value or "0").replace(",", ""))
    except ValueError:
        return 0.0


INVENTORY_LINES = {
    "AMORTIGUADORES", "AUTOPARTES", "BOMBA", "BUJES", "CAJA", "CHASIS",
    "CORREAS", "DIRECCION", "ELECTRICOS", "EMBRAGUE", "EMPAQUES", "FAROLA",
    "FILTRO", "FRENO", "GUARDAPOLVO", "GUAYAS", "KIT", "LUBRICANTES",
    "MANGUERAS", "MOTOR", "MOTOVENTILADORES", "PASTILLAS", "RETENEDORES",
    "RODAMIENTOS", "SOPORTES", "SUSPENSION", "TUBOS", "VARIOS",
}


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit("Provide INVENTARIO GENERAL POR LINEAS.pdf")

    source = Path(sys.argv[1]).resolve()
    output = (
        Path(sys.argv[2]).resolve()
        if len(sys.argv) > 2
        else Path("src/data/inventory-lines.json").resolve()
    )
    extracted: list[dict[str, object]] = []
    current_line = "SIN LINEA"

    with pdfplumber.open(source) as document:
        for page_number, page in enumerate(document.pages, 1):
            rows: dict[float, list[dict[str, object]]] = defaultdict(list)
            for word in page.extract_words(x_tolerance=2, y_tolerance=2):
                rows[round(float(word["top"]), 1)].append(word)

            # A Visual FoxPro page can close one inventory line and begin the
            # next one below it. Process every visual row from top to bottom so
            # the new heading applies only to the product rows that follow.
            for _, words in sorted(rows.items()):
                words.sort(key=lambda item: float(item["x0"]))
                visual_text = compact(" ".join(str(word["text"]) for word in words)).upper()
                if visual_text in INVENTORY_LINES:
                    current_line = visual_text
                    continue
                item = next((
                    word for word in words
                    if 28 <= float(word["x0"]) < 58
                    and str(word["text"]).strip().isdigit()
                ), None)
                if not item:
                    continue

                def column(left: float, right: float) -> str:
                    return compact(" ".join(
                        str(word["text"])
                        for word in words
                        if left <= float(word["x0"]) < right
                    ))

                name = column(58, 310)
                if not name:
                    continue
                extracted.append({
                    "i": int(str(item["text"])),
                    "l": current_line,
                    "n": name,
                    "s": decimal(column(310, 380)),
                    "b": column(380, 430),
                    "u": decimal(column(430, 492)),
                    "a": decimal(column(492, 540)),
                    "p": int(decimal(column(540, 612))),
                    "g": page_number,
                })

    reconciled: dict[int, dict[str, object]] = {}
    for row in extracted:
        number = int(row["i"])
        previous = reconciled.get(number)
        if not previous or len(str(row["n"])) > len(str(previous["n"])):
            reconciled[number] = row

    rows = sorted(reconciled.values(), key=lambda row: int(row["i"]))
    if not rows:
        raise SystemExit("No inventory rows extracted")
    expected = list(range(1, int(rows[-1]["i"]) + 1))
    actual = [int(row["i"]) for row in rows]
    if actual != expected:
        missing = sorted(set(expected) - set(actual))
        raise SystemExit(f"Incomplete sequence; missing={missing[:50]}")

    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(
        json.dumps(rows, ensure_ascii=False, separators=(",", ":")) + "\n",
        encoding="utf-8",
    )
    print(f"Extracted {len(rows)} rows across {len(set(row['l'] for row in rows))} lines")


if __name__ == "__main__":
    main()
