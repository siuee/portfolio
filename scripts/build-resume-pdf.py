#!/usr/bin/env python3
"""
Typeset public/resume.pdf from the source resume (.docx), keeping its text and
hyperlinks verbatim.

    pip install reportlab
    python3 scripts/build-resume-pdf.py [path/to/resume.docx]
"""
from __future__ import annotations

import re
import sys
import zipfile
from html import escape, unescape
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import HRFlowable, ListFlowable, ListItem, Paragraph, SimpleDocTemplate, Spacer, Table

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.home() / "Downloads" / "Koirala_Sudip_resume.docx"
OUT = ROOT / "public" / "resume.pdf"

INK, MUTE = HexColor("#0d0d0d"), HexColor("#55534e")
NS = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"


def paragraphs(path: Path):
    """Yield (text_with_links, is_bullet, tab_parts) for each non-empty paragraph."""
    z = zipfile.ZipFile(path)
    xml = z.read("word/document.xml").decode()
    rels = dict(re.findall(r'Id="(\w+)"[^>]*Target="([^"]+)"', z.read("word/_rels/document.xml.rels").decode()))
    for p in re.findall(r"<w:p[ >].*?</w:p>", xml, re.S):
        parts: list[str] = [""]
        for m in re.finditer(r'<w:hyperlink[^>]*r:id="(\w+)"[^>]*>(.*?)</w:hyperlink>|<w:r[ >].*?</w:r>', p, re.S):
            if m.group(1):
                text = "".join(re.findall(r"<w:t[^>]*>([^<]*)</w:t>", m.group(2)))
                parts[-1] += f'<a href="{rels[m.group(1)]}" color="#0d0d0d"><u>{escape(unescape(text))}</u></a>'
                continue
            run = m.group(0)
            if "<w:tab/>" in run:
                parts.append("")
            parts[-1] += escape(unescape("".join(re.findall(r"<w:t[^>]*>([^<]*)</w:t>", run))))
        if any(x.strip() for x in parts):
            yield parts, "<w:numPr>" in p


def build() -> None:
    def s(**k) -> ParagraphStyle:
        return ParagraphStyle("x", **{"fontName": "Helvetica", "fontSize": 9.6, "leading": 13.2, "textColor": INK, **k})

    name = s(fontName="Helvetica-Bold", fontSize=22, leading=26, alignment=TA_CENTER)
    sub = s(fontSize=9, textColor=MUTE, alignment=TA_CENTER)
    head = s(fontName="Helvetica-Bold", fontSize=10.5, spaceBefore=10)
    bold = s(fontName="Helvetica-Bold")
    body, right = s(), s(alignment=2, textColor=MUTE)

    flow = []
    rows = list(paragraphs(SRC))
    for i, (parts, bullet) in enumerate(rows):
        text = "".join(parts)
        plain = re.sub(r"<[^>]+>", "", text)
        if i == 0:
            flow.append(Paragraph(text, name))
        elif i < 4:
            flow.append(Paragraph(text, sub))
        elif plain.isupper() and len(plain) < 40:
            flow += [Paragraph(text, head), HRFlowable(width="100%", thickness=0.6, color=INK, spaceAfter=4)]
        elif bullet:
            flow.append(ListFlowable([ListItem(Paragraph(text, body), leftIndent=12)], bulletType="bullet",
                                     start="•", leftIndent=12, bulletFontSize=8))
        elif len(parts) > 1 and parts[-1].strip():
            t = Table([[Paragraph("".join(parts[:-1]), bold), Paragraph(parts[-1], right)]],
                      colWidths=[5.4 * inch, 1.8 * inch], style=[("LEFTPADDING", (0, 0), (-1, -1), 0),
                                                                 ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                                                                 ("TOPPADDING", (0, 0), (-1, -1), 4)])
            flow.append(t)
        elif plain.startswith(("Tech:", "GitHub:")):
            flow.append(Paragraph(text, s(textColor=MUTE, fontSize=9)))
        elif len(plain) < 70 and i + 1 < len(rows) and not plain.endswith("."):
            flow.append(Paragraph(text, s(fontName="Helvetica-Bold", spaceBefore=4)))
        else:
            flow.append(Paragraph(text, body))
        flow.append(Spacer(1, 1.5))

    OUT.parent.mkdir(exist_ok=True)
    SimpleDocTemplate(str(OUT), pagesize=LETTER, leftMargin=0.65 * inch, rightMargin=0.65 * inch,
                      topMargin=0.55 * inch, bottomMargin=0.55 * inch, title="Sudip Koirala — Resume",
                      author="Sudip Koirala").build(flow)
    print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size / 1024:.1f} kB)")


if __name__ == "__main__":
    build()
