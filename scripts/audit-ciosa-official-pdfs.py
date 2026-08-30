import json
import re
import subprocess
from pathlib import Path

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
PDF_DIR = ROOT / "tmp" / "pdfs" / "ciosa-impresos-dynamik"


def published_pending_skus() -> list[str]:
    expression = """
      import { products } from './src/lib/products.js';
      const real = new Set(['exact-real-photo', 'official-catalog-watermarked', 'real-source-photo']);
      console.log(JSON.stringify(products
        .filter((product) => product?.brand?.slug === 'dynamik')
        .filter((product) => !String(product.sku || '').endsWith('-COT'))
        .filter((product) => !real.has(product.imageStatus))
        .map((product) => product.sku)));
    """
    result = subprocess.run(
        ["node", "--input-type=module", "-e", expression],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(result.stdout)


pending = set(published_pending_skus())
reports = []
all_official_npcs = set()

for pdf_path in sorted(PDF_DIR.glob("*.pdf")):
    reader = PdfReader(pdf_path)
    page_texts = []
    for page in reader.pages:
        page_texts.append(page.extract_text() or "")
    text = "\n".join(page_texts).upper()
    normalized = re.sub(r"[^A-Z0-9]", "", text)
    pending_hits = sorted(sku for sku in pending if sku in normalized)
    npc_tokens = sorted(set(re.findall(r"\bDNK[A-Z0-9]{5,20}\b", text)))
    all_official_npcs.update(npc_tokens)
    reports.append(
        {
            "file": pdf_path.name,
            "pages": len(reader.pages),
            "textCharacters": len(text),
            "pendingNpcHits": pending_hits,
            "allNpcTokens": npc_tokens,
        }
    )

print(
    json.dumps(
        {
            "pendingReferenceCount": len(pending),
            "pdfCount": len(reports),
            "pendingReferencesFound": sorted(
                {sku for report in reports for sku in report["pendingNpcHits"]}
            ),
            "officialNpcTokens": sorted(all_official_npcs),
            "reports": reports,
        },
        ensure_ascii=False,
        indent=2,
    )
)

