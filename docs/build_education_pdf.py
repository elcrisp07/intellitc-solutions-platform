#!/usr/bin/env python3
"""
IntelliTC Solutions — Hardening the Education-Integrated Moat
Strategic Enhancements to Make IntelliTC's Educational Model Uncopyable
"""

import os
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch, mm
from reportlab.lib.colors import HexColor, white, black, Color
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    Image, KeepTogether, HRFlowable, ListFlowable, ListItem,
    NextPageTemplate, PageTemplate, Frame, BaseDocTemplate
)
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.lib.colors import toColor

# ─── Register Fonts ───────────────────────────────────────────────────────
pdfmetrics.registerFont(TTFont("DMSans", "/home/user/workspace/fonts/DMSans-Regular.ttf"))
pdfmetrics.registerFont(TTFont("DMSans-Medium", "/home/user/workspace/fonts/DMSans-Medium.ttf"))
pdfmetrics.registerFont(TTFont("DMSans-Bold", "/home/user/workspace/fonts/DMSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("JetBrainsMono", "/tmp/JetBrainsMono-Regular.ttf"))

# ─── Brand Colors ─────────────────────────────────────────────────────────
TEAL = HexColor("#01696f")
TEAL_LIGHT = HexColor("#e8f4f5")
TEAL_DARK = HexColor("#004d52")
BEIGE = HexColor("#f7f6f2")
GOLD = HexColor("#D19900")
GOLD_LIGHT = HexColor("#fdf6e3")
TEXT_PRIMARY = HexColor("#28251D")
TEXT_MUTED = HexColor("#5a5856")
BORDER_LIGHT = HexColor("#D4D1CA")
WHITE = HexColor("#FFFFFF")
DARK_BG = HexColor("#1a1a1a")
RED_ALERT = HexColor("#c0392b")
ORANGE_MED = HexColor("#e67e22")
SURFACE = HexColor("#f9f8f5")

W, H = letter  # 612 x 792

OUTPUT = "/home/user/workspace/intellitc-education-enhancement-v10.pdf"
LOGO = "/home/user/workspace/intellitc-solutions-platform/assets/logo.jpg"

# ─── Styles ───────────────────────────────────────────────────────────────
styles = getSampleStyleSheet()

# Base body
body_style = ParagraphStyle(
    "Body", parent=styles["Normal"],
    fontName="DMSans", fontSize=10, leading=14.5,
    textColor=TEXT_PRIMARY, spaceAfter=6,
    alignment=TA_JUSTIFY,
)

body_bold = ParagraphStyle(
    "BodyBold", parent=body_style,
    fontName="DMSans-Bold",
)

# Heading styles
h1_style = ParagraphStyle(
    "H1", parent=styles["Heading1"],
    fontName="DMSans-Bold", fontSize=20, leading=26,
    textColor=TEAL, spaceAfter=10, spaceBefore=20,
    borderWidth=0,
)

h2_style = ParagraphStyle(
    "H2", parent=styles["Heading2"],
    fontName="DMSans-Bold", fontSize=15, leading=20,
    textColor=TEAL_DARK, spaceAfter=8, spaceBefore=14,
)

h3_style = ParagraphStyle(
    "H3", parent=styles["Heading3"],
    fontName="DMSans-Medium", fontSize=12, leading=16,
    textColor=TEXT_PRIMARY, spaceAfter=6, spaceBefore=10,
)

h4_style = ParagraphStyle(
    "H4", parent=styles["Heading4"],
    fontName="DMSans-Medium", fontSize=10.5, leading=14,
    textColor=TEAL, spaceAfter=4, spaceBefore=8,
)

# Bullet style
bullet_style = ParagraphStyle(
    "Bullet", parent=body_style,
    bulletFontName="DMSans", bulletFontSize=10,
    leftIndent=18, bulletIndent=6,
    spaceAfter=3,
)

sub_bullet_style = ParagraphStyle(
    "SubBullet", parent=bullet_style,
    leftIndent=36, bulletIndent=24,
    fontSize=9.5, leading=13,
)

# Caption / small
caption_style = ParagraphStyle(
    "Caption", parent=body_style,
    fontSize=8.5, leading=11,
    textColor=TEXT_MUTED, spaceAfter=3,
)

# Footnote
footnote_style = ParagraphStyle(
    "Footnote", parent=body_style,
    fontSize=7.5, leading=10,
    textColor=TEXT_MUTED, spaceAfter=2,
)

# TOC styles
toc_h1_style = ParagraphStyle(
    "TOCH1", parent=body_style,
    fontName="DMSans-Bold", fontSize=11, leading=18,
    leftIndent=0, textColor=TEAL_DARK,
)
toc_h2_style = ParagraphStyle(
    "TOCH2", parent=body_style,
    fontName="DMSans-Medium", fontSize=10, leading=16,
    leftIndent=18, textColor=TEXT_PRIMARY,
)
toc_h3_style = ParagraphStyle(
    "TOCH3", parent=body_style,
    fontName="DMSans", fontSize=9, leading=14,
    leftIndent=36, textColor=TEXT_MUTED,
)

# Code style
code_style = ParagraphStyle(
    "Code", parent=body_style,
    fontName="JetBrainsMono", fontSize=8.5, leading=12,
    textColor=TEXT_PRIMARY, backColor=BEIGE,
    leftIndent=8, rightIndent=8,
    spaceBefore=4, spaceAfter=4,
)

# Callout box style
callout_style = ParagraphStyle(
    "Callout", parent=body_style,
    fontName="DMSans-Medium", fontSize=10, leading=14,
    textColor=TEAL_DARK, backColor=TEAL_LIGHT,
    borderPadding=(8, 8, 8, 8),
    spaceBefore=6, spaceAfter=8,
)

# Gold callout
gold_callout_style = ParagraphStyle(
    "GoldCallout", parent=body_style,
    fontName="DMSans-Medium", fontSize=10, leading=14,
    textColor=HexColor("#6e5200"),
    borderPadding=(8, 8, 8, 8),
    spaceBefore=6, spaceAfter=8,
)

# Table header style
th_style = ParagraphStyle(
    "TH", parent=body_style,
    fontName="DMSans-Bold", fontSize=9, leading=12,
    textColor=WHITE, alignment=TA_LEFT,
)

# Table cell style
td_style = ParagraphStyle(
    "TD", parent=body_style,
    fontName="DMSans", fontSize=9, leading=12,
    textColor=TEXT_PRIMARY, spaceAfter=0,
)

td_bold_style = ParagraphStyle(
    "TDBold", parent=td_style,
    fontName="DMSans-Bold",
)

# Classification style
class_style = ParagraphStyle(
    "Classification", parent=body_style,
    fontName="DMSans-Bold", fontSize=10,
    textColor=RED_ALERT, alignment=TA_CENTER,
)

# Cover styles
cover_title_style = ParagraphStyle(
    "CoverTitle", parent=body_style,
    fontName="DMSans-Bold", fontSize=28, leading=34,
    textColor=WHITE, alignment=TA_LEFT,
)

cover_subtitle_style = ParagraphStyle(
    "CoverSubtitle", parent=body_style,
    fontName="DMSans-Medium", fontSize=14, leading=20,
    textColor=HexColor("#b8e0e3"), alignment=TA_LEFT,
)

cover_meta_style = ParagraphStyle(
    "CoverMeta", parent=body_style,
    fontName="DMSans", fontSize=10, leading=14,
    textColor=HexColor("#90c5c9"), alignment=TA_LEFT,
)


# ─── Helper Functions ─────────────────────────────────────────────────────

def make_bullet(text, style=bullet_style):
    return Paragraph("&#8226; " + text, style)

def make_sub_bullet(text):
    return Paragraph("&#8226; " + text, sub_bullet_style)

def make_table(headers, rows, col_widths=None, highlight_col=None):
    """Create a styled table."""
    header_cells = [Paragraph(h, th_style) for h in headers]
    data = [header_cells]
    for row in rows:
        cells = []
        for i, cell in enumerate(row):
            if i == 0:
                cells.append(Paragraph(str(cell), td_bold_style))
            else:
                cells.append(Paragraph(str(cell), td_style))
        data.append(cells)

    if col_widths is None:
        col_widths = [W * 0.85 / len(headers)] * len(headers)

    t = Table(data, colWidths=col_widths, repeatRows=1)
    style_cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), TEAL),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("FONTNAME", (0, 0), (-1, 0), "DMSans-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("GRID", (0, 0), (-1, -1), 0.5, BORDER_LIGHT),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, BEIGE]),
    ]

    if highlight_col is not None:
        for row_idx in range(1, len(data)):
            style_cmds.append(("BACKGROUND", (highlight_col, row_idx), (highlight_col, row_idx), GOLD_LIGHT))

    t.setStyle(TableStyle(style_cmds))
    return t

def make_kpi_row(kpis, col_widths=None):
    """Create a KPI card row. kpis = [(label, value, color), ...]"""
    n = len(kpis)
    if col_widths is None:
        cw = [(W - 2*72) / n] * n

    cells = []
    for label, value, color in kpis:
        cell_content = Paragraph(
            f'<font name="DMSans-Bold" size="18" color="{color}">{value}</font><br/>'
            f'<font name="DMSans" size="8" color="#7a7974">{label}</font>',
            ParagraphStyle("KPI", parent=body_style, alignment=TA_CENTER, spaceAfter=0)
        )
        cells.append(cell_content)

    t = Table([cells], colWidths=cw if col_widths else [(W - 2*72) / n] * n)
    t.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 12),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
        ("BACKGROUND", (0, 0), (-1, -1), BEIGE),
        ("BOX", (0, 0), (-1, -1), 0.5, BORDER_LIGHT),
        ("LINEBEFORE", (1, 0), (-1, -1), 0.5, BORDER_LIGHT),
    ]))
    return t

def divider():
    return HRFlowable(width="100%", thickness=0.5, color=BORDER_LIGHT, spaceBefore=8, spaceAfter=8)

def teal_divider():
    return HRFlowable(width="100%", thickness=1.5, color=TEAL, spaceBefore=6, spaceAfter=6)

def gold_divider():
    return HRFlowable(width="30%", thickness=2, color=GOLD, spaceBefore=4, spaceAfter=8)


# ─── Page Templates ───────────────────────────────────────────────────────

class DocTemplate(BaseDocTemplate):
    def __init__(self, filename, **kwargs):
        super().__init__(filename, **kwargs)
        self.page_count = 0

        # Main frame
        main_frame = Frame(
            72, 60, W - 144, H - 140,
            id="main", leftPadding=0, rightPadding=0,
            topPadding=0, bottomPadding=0,
        )

        # Cover frame (full page)
        cover_frame = Frame(
            0, 0, W, H,
            id="cover", leftPadding=0, rightPadding=0,
            topPadding=0, bottomPadding=0,
        )

        self.addPageTemplates([
            PageTemplate(id="cover", frames=[cover_frame], onPage=self._cover_page),
            PageTemplate(id="content", frames=[main_frame], onPage=self._content_page),
        ])

    def _cover_page(self, canvas, doc):
        pass  # Cover drawn via flowables

    def _content_page(self, canvas, doc):
        canvas.saveState()
        page_num = doc.page

        # Header line
        canvas.setStrokeColor(TEAL)
        canvas.setLineWidth(0.5)
        canvas.line(72, H - 50, W - 72, H - 50)

        # Header text
        canvas.setFont("DMSans-Medium", 7.5)
        canvas.setFillColor(TEXT_MUTED)
        canvas.drawString(72, H - 44, "IntelliTC Solutions")

        canvas.setFont("DMSans", 7.5)
        canvas.drawRightString(W - 72, H - 44, "CONFIDENTIAL")

        # Footer
        canvas.setStrokeColor(BORDER_LIGHT)
        canvas.setLineWidth(0.5)
        canvas.line(72, 48, W - 72, 48)

        canvas.setFont("DMSans", 7.5)
        canvas.setFillColor(TEXT_MUTED)
        canvas.drawString(72, 36, "Hardening the Education-Integrated Moat")
        canvas.drawRightString(W - 72, 36, f"Page {page_num}")

        # Classification
        canvas.setFont("DMSans-Bold", 7)
        canvas.setFillColor(RED_ALERT)
        canvas.drawCentredString(W / 2, 24, "CONFIDENTIAL - INTERNAL USE ONLY")

        canvas.restoreState()

    def afterFlowable(self, flowable):
        """Register TOC entries."""
        if isinstance(flowable, Paragraph):
            style = flowable.style.name
            text = flowable.getPlainText()
            if style == "H1":
                self.notify('TOCEntry', (0, text, self.page))
            elif style == "H2":
                self.notify('TOCEntry', (1, text, self.page))


# ─── Build Document ───────────────────────────────────────────────────────

doc = DocTemplate(
    OUTPUT,
    pagesize=letter,
    title="IntelliTC Solutions - Hardening the Education-Integrated Moat",
    author="Perplexity Computer",
)

story = []

# ═══════════════════════════════════════════════════════════════════════════
# COVER PAGE
# ═══════════════════════════════════════════════════════════════════════════

class CoverFlowable(object):
    """Custom cover page drawn directly on canvas."""
    pass

from reportlab.platypus import Flowable

class CoverPage(Flowable):
    def __init__(self, width, height):
        Flowable.__init__(self)
        self.width = width
        self.height = height

    def draw(self):
        c = self.canv
        w, h = self.width, self.height

        # Dark teal background
        c.setFillColor(TEAL_DARK)
        c.rect(0, 0, w, h, fill=1, stroke=0)

        # Decorative geometric elements
        c.setFillColor(HexColor("#005a5f"))
        c.rect(0, h * 0.55, w * 0.4, h * 0.45, fill=1, stroke=0)

        c.setFillColor(HexColor("#006b70"))
        c.rect(w * 0.7, 0, w * 0.3, h * 0.35, fill=1, stroke=0)

        # Gold accent bar
        c.setFillColor(GOLD)
        c.rect(60, h * 0.62, 80, 4, fill=1, stroke=0)

        # CONFIDENTIAL badge
        c.setFillColor(RED_ALERT)
        c.roundRect(60, h - 75, 130, 24, 4, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont("DMSans-Bold", 9)
        c.drawString(74, h - 68, "CONFIDENTIAL")

        # Logo
        try:
            c.drawImage(LOGO, 60, h - 130, width=50, height=50, preserveAspectRatio=True, mask='auto')
        except:
            pass

        # Company name
        c.setFillColor(WHITE)
        c.setFont("DMSans-Bold", 14)
        c.drawString(120, h - 115, "IntelliTC Solutions")

        # Main title
        c.setFont("DMSans-Bold", 26)
        y_title = h * 0.52
        c.drawString(60, y_title, "Hardening the")
        c.drawString(60, y_title - 34, "Education-Integrated Moat")

        # Subtitle
        c.setFont("DMSans-Medium", 13)
        c.setFillColor(HexColor("#b8e0e3"))
        c.drawString(60, y_title - 72, "Strategic Enhancements to Make IntelliTC's")
        c.drawString(60, y_title - 90, "Educational Model Uncopyable")

        # Gold divider
        c.setFillColor(GOLD)
        c.rect(60, y_title - 110, 60, 3, fill=1, stroke=0)

        # Meta info
        c.setFont("DMSans", 10)
        c.setFillColor(HexColor("#90c5c9"))
        c.drawString(60, y_title - 135, "Strategic Briefing  |  April 2026")
        c.drawString(60, y_title - 152, "IntelliTC Solutions  |  intellitcsolutions.com")
        c.drawString(60, y_title - 169, "Version 10.0  |  All Education Phases Live")

        # Bottom metrics strip
        strip_y = 60
        c.setFillColor(HexColor("#003d40"))
        c.rect(0, strip_y - 10, w, 55, fill=1, stroke=0)

        metrics = [
            ("5", "Education Phases"),
            ("1,549", "Mind Map Definitions"),
            ("23", "Benchmark Calculators"),
            ("12", "Scenario Exercises"),
            ("11", "PDF Guides"),
            ("3", "Certification Tiers"),
        ]
        x_start = 40
        spacing = (w - 80) / len(metrics)
        for i, (val, label) in enumerate(metrics):
            x = x_start + i * spacing
            c.setFont("DMSans-Bold", 15)
            c.setFillColor(GOLD)
            c.drawString(x, strip_y + 20, val)
            c.setFont("DMSans", 7)
            c.setFillColor(HexColor("#90c5c9"))
            c.drawString(x, strip_y + 5, label)

story.append(CoverPage(W, H))
story.append(NextPageTemplate("content"))
story.append(PageBreak())


# ═══════════════════════════════════════════════════════════════════════════
# TABLE OF CONTENTS
# ═══════════════════════════════════════════════════════════════════════════

story.append(Paragraph("Table of Contents", h1_style))
story.append(gold_divider())

toc = TableOfContents()
toc.levelStyles = [toc_h1_style, toc_h2_style, toc_h3_style]
story.append(toc)
story.append(PageBreak())


# ═══════════════════════════════════════════════════════════════════════════
# SECTION 1: STRATEGIC CONTEXT
# ═══════════════════════════════════════════════════════════════════════════

story.append(Paragraph("Strategic Context", h1_style))
story.append(gold_divider())

story.append(Paragraph(
    "Real estate investment calculators are, at their core, commodity tools. Any competent developer can replicate "
    "the mathematical formulas behind cap rate, cash-on-cash return, or BRRRR analysis within weeks. The calculators "
    "themselves are not the moat -- the <b>education layer wrapped around them</b> is what transforms IntelliTC from "
    "a utility into an indispensable learning platform.",
    body_style
))

story.append(Spacer(1, 6))

story.append(Paragraph(
    "IntelliTC Solutions has built a comprehensive education pipeline that converts raw computational tools into a "
    "structured learning environment. This pipeline -- spanning five fully deployed phases with <b>1,549 interactive "
    "mind map definitions</b> embedded across all 58 tools -- creates compounding switching costs that no competitor "
    "currently matches. Users do not merely calculate; they <b>learn, practice, certify, and grow</b> within the "
    "platform ecosystem.",
    body_style
))

story.append(Spacer(1, 8))

# KPI row
story.append(make_kpi_row([
    ("Education Phases Deployed", "5/5", "#01696f"),
    ("Mind Map Definitions", "1,549", "#D19900"),
    ("Certification Question Pool", "146", "#01696f"),
    ("Calculators w/ Learn Mode", "23+", "#01696f"),
]))

story.append(Spacer(1, 8))

story.append(Paragraph(
    "This document details every component of IntelliTC's education-integrated moat -- from the 5-phase pipeline and "
    "1,549 hover-to-learn mind map definitions to certification and beyond -- and presents strategic enhancements to "
    "make this model structurally uncopyable. The goal: ensure that even if a competitor replicates our calculators, "
    "they cannot replicate the <b>learning journey</b> that keeps users engaged, advancing, and loyal.",
    body_style
))

story.append(Spacer(1, 4))

# Sources footnote
story.append(Paragraph(
    '<font name="DMSans" size="7.5" color="#7a7974">Sources: IntelliTC Solutions platform data (April 2026); '
    'Market analysis by Precedence Research, Grand View Research, IMARC Group.</font>',
    footnote_style
))

story.append(PageBreak())


# ═══════════════════════════════════════════════════════════════════════════
# SECTION 2: THE THREAT LANDSCAPE
# ═══════════════════════════════════════════════════════════════════════════

story.append(Paragraph("The Threat Landscape", h1_style))
story.append(gold_divider())

story.append(Paragraph(
    "Understanding who competes -- and where they fall short -- is essential to defending the moat. The table below "
    "maps the primary competitive threats against IntelliTC's education-integrated approach.",
    body_style
))

story.append(Spacer(1, 8))

threat_headers = ["Competitor", "Threat Level", "Calculator Depth", "Education Layer", "Key Vulnerability"]
threat_rows = [
    ["RentalRealEstate.com", "HIGH", "Moderate -- basic rental analysis", "None -- pure computation, no mind maps",
     "No learning journey; users outgrow quickly"],
    ["BiggerPockets", "MEDIUM", "Limited -- 5 free, paywall for more",
     "Forum-based (unstructured), no mind maps", "Community knowledge is fragmented, not guided"],
    ["DealCheck", "MEDIUM", "Strong -- templates + offer calc",
     "Minimal -- no mind maps or structured learning", "Tool-focused; no progression or certification"],
    ["Future AI Entrants", "CRITICAL", "Potentially unlimited via AI",
     "Could auto-generate tutorials but not 1,549 curated definitions", "Speed of AI replication threatens pure-calculator plays"],
]

story.append(make_table(threat_headers, threat_rows,
    col_widths=[85, 65, 100, 100, 118]))

story.append(Spacer(1, 10))

story.append(Paragraph("Threat Assessment Summary", h2_style))

story.append(Paragraph(
    "The critical insight from this competitive analysis is that <b>no current competitor combines calculators with "
    "structured education or interactive mind maps</b>. BiggerPockets has community content but no guided learning paths "
    "or concept visualizations. DealCheck has strong tools but zero educational scaffolding. RentalRealEstate offers "
    "computation without context. None offer hover-to-learn definitions on any calculator.",
    body_style
))

story.append(Spacer(1, 6))

story.append(Paragraph(
    "The most dangerous threat comes from <b>future AI-powered entrants</b> that could rapidly generate both "
    "calculators and educational content. This makes it imperative that IntelliTC deepens its education moat "
    "now -- building certification authority, community trust, and content depth that cannot be replicated by "
    "AI generation alone.",
    body_style
))

story.append(PageBreak())


# ═══════════════════════════════════════════════════════════════════════════
# SECTION 3: THE STRATEGIC IMPERATIVE
# ═══════════════════════════════════════════════════════════════════════════

story.append(Paragraph("The Strategic Imperative", h1_style))
story.append(gold_divider())

story.append(Paragraph(
    "Education is not a feature -- it is the <b>entire strategic differentiator</b>. The distinction between "
    "a calculator platform and an education platform determines whether IntelliTC commands premium positioning "
    "or competes on price in a commoditized market.",
    body_style
))

story.append(Spacer(1, 6))

story.append(Paragraph("Why Education Wins", h2_style))

# Two-column comparison table
comp_headers = ["Dimension", "Calculator-Only Platform", "Education-Integrated Platform"]
comp_rows = [
    ["User Retention", "Single-session utility", "Multi-session learning journey"],
    ["Switching Cost", "Zero -- any calculator works", "High -- progress, certs, learning history"],
    ["Revenue Model", "Ads or subscription for features", "Certification, courses, premium content"],
    ["Competitive Moat", "None -- easily replicated", "Deep -- curriculum + community + credentials"],
    ["User Lifetime Value", "Low -- one-and-done", "High -- years of engagement and advancement"],
    ["AI Disruption Risk", "Critical -- AI replicates math instantly", "Low -- AI cannot replicate trust or credentials"],
]

story.append(make_table(comp_headers, comp_rows,
    col_widths=[95, 140, 165]))

story.append(Spacer(1, 10))

story.append(Paragraph("The Compounding Effect", h2_style))

story.append(Paragraph(
    "Each education layer reinforces the others. A user who completes Phase 0 (Zero Experience) naturally "
    "progresses to Phase 1 (Learn Mode), then Phase 2 (Mind Map Tooltips + Learning Paths), then Phase 3 "
    "(Scenario Labs), and finally Phase 4 (ICREA Certification). At each stage, the cost of switching increases "
    "because the user has invested time, built skills, absorbed 1,549 concept definitions, and earned credentials "
    "that exist only within the IntelliTC ecosystem.",
    body_style
))

story.append(Spacer(1, 6))
story.append(Paragraph(
    "This is the <b>education flywheel</b>: more content attracts more users, more users generate more data "
    "on learning patterns, better data enables better personalization, and better personalization drives deeper "
    "engagement. Competitors would need to replicate not just the content but the entire flywheel -- a multi-year "
    "effort even with unlimited resources.",
    body_style
))

story.append(PageBreak())


# ═══════════════════════════════════════════════════════════════════════════
# SECTION 4: THE MARKET OPPORTUNITY
# ═══════════════════════════════════════════════════════════════════════════

story.append(Paragraph("The Market Opportunity", h1_style))
story.append(gold_divider())

story.append(Paragraph(
    "IntelliTC's education-integrated model positions it at the intersection of two rapidly growing markets: "
    "real estate technology and AI-powered education. The convergence of these sectors represents a massive "
    "addressable market.",
    body_style
))

story.append(Spacer(1, 8))

# Market data KPIs
story.append(make_kpi_row([
    ("AI Education Market (2025)", "$7.57B", "#01696f"),
    ("AI Education Market (2034)", "$112.3B", "#D19900"),
    ("CAGR (2025-2034)", "~35%", "#01696f"),
    ("North America Share", "38%", "#01696f"),
]))

story.append(Spacer(1, 10))

story.append(Paragraph("AI in Education Market Projections", h2_style))

mkt_headers = ["Source", "2025 Value", "Forecast", "CAGR", "Key Insight"]
mkt_rows = [
    ["World Economic Forum / LinkedIn", "$7.57B (2025)", "$112.3B (2034)", "~35%",
     "Broad AI education market"],
    ["Precedence Research", "$7.05B (2025)", "$136.79B (2035)", "34.52%",
     "North America leads with 38% share"],
    ["Grand View Research", "$8.30B (2025)", "$32.27B (2030)", "31.2%",
     "Personalized learning is primary driver"],
    ["IMARC Group", "$6.4B (2025)", "$79.6B (2034)", "31.35%",
     "Services segment growing fastest"],
    ["Momen / Market.us", "$5.3B (2025)", "$98.1B (2034)", "38.3%",
     "Generative AI acceleration"],
]

story.append(make_table(mkt_headers, mkt_rows,
    col_widths=[95, 72, 80, 52, 120]))

story.append(Spacer(1, 8))

story.append(Paragraph(
    "Across all major research firms, the consensus is clear: AI-powered education is growing at 30-38% CAGR "
    "with market values projected to exceed $100 billion by the mid-2030s. IntelliTC's education-integrated "
    "model -- which combines AI-ready calculator tools with structured learning, scenario practice, and "
    "certification -- is positioned to capture a growing share of this market as it expands into real estate "
    "education specifically.<super>1</super>",
    body_style
))

story.append(Spacer(1, 4))
story.append(Paragraph(
    "The U.S. market alone is projected at $2.01 billion in 2025, growing to $39.83 billion by 2035 "
    "(34.80% CAGR), confirming that IntelliTC's North America-focused strategy aligns with the highest-value "
    "geography.<super>2</super>",
    body_style
))

story.append(Spacer(1, 8))

# Source footnotes
story.append(Paragraph(
    '1. World Economic Forum data via <a href="https://www.linkedin.com/posts/vridhi-tuli-8061b6264_77-ai-in-education-statistics-2026-global-activity-7417199054553628672-fqbo" color="#01696f">LinkedIn</a>; '
    'Momen market analysis via <a href="https://momen.app/blogs/ai-ed-tech-market-forecast-growth-opportunities-2025-2034/" color="#01696f">momen.app</a>',
    footnote_style
))
story.append(Paragraph(
    '2. Precedence Research, <a href="https://www.precedenceresearch.com/ai-in-education-market" color="#01696f">'
    'https://www.precedenceresearch.com/ai-in-education-market</a>',
    footnote_style
))

story.append(PageBreak())


# ═══════════════════════════════════════════════════════════════════════════
# SECTION 5: THE COMPLETE 5-PHASE EDUCATION PIPELINE
# ═══════════════════════════════════════════════════════════════════════════

story.append(Paragraph("The Complete 5-Phase Education Pipeline", h1_style))
story.append(gold_divider())

story.append(Paragraph(
    "IntelliTC's education pipeline is now <b>fully deployed across all five phases</b>. Each phase targets "
    "a specific stage of the learner's journey, from complete beginner to certified professional. Together, "
    "they form a cohesive system that no competitor has attempted to replicate.",
    body_style
))

story.append(Spacer(1, 8))

# Pipeline overview table
pipeline_headers = ["Phase", "Name", "Status", "Target User", "Key Deliverable"]
pipeline_rows = [
    ["Phase 0", "Zero Experience (\"Start Here\")", "LIVE (March 25, 2026)",
     "Complete beginners", "Life-situation cards + glossary"],
    ["Phase 1", "Learn Mode Toggle", "LIVE (All Calculators)",
     "First-time calculator users", "Field-level tooltips + examples"],
    ["Phase 2", "Learn Mode + Mind Map Tooltips", "LIVE",
     "Contextual learners", "1,549 hover-to-learn definitions + 8 learning paths"],
    ["Phase 3", "12 Scenario Lab Exercises", "LIVE",
     "Practice-oriented users", "Real-world guided scenarios"],
    ["Phase 4", "ICREA Certification", "LIVE",
     "Career-focused professionals", "3-tier professional credential"],
]

story.append(make_table(pipeline_headers, pipeline_rows,
    col_widths=[50, 120, 85, 90, 118]))

story.append(Spacer(1, 6))

# ─── Phase 0 ──────────────────────────────────────────────────────────────
story.append(PageBreak())
story.append(Paragraph("Phase 0: Zero Experience (\"Start Here\")", h1_style))
story.append(teal_divider())

story.append(Paragraph(
    '<font color="#7a7974">Deployed: March 25, 2026  |  URL: /zero-experience/</font>',
    caption_style
))

story.append(Spacer(1, 6))

story.append(Paragraph(
    "Phase 0 is the critical entry point for users with <b>absolutely no real estate investment experience</b>. "
    "Rather than overwhelming beginners with financial jargon and complex inputs, this page meets users where they "
    "are -- with plain-language explanations anchored to real-life situations.",
    body_style
))

story.append(Spacer(1, 6))

story.append(Paragraph("4 Life-Situation Entry Cards", h2_style))

story.append(Paragraph(
    "Users self-select from four real-life scenarios, each designed to answer the question \"I want to...\" "
    "rather than \"I need to calculate...\" This reframes the entire platform experience from tool-first to "
    "goal-first.",
    body_style
))

story.append(make_bullet("\"I Want to Buy My First Home\" -- Guides to affordability and mortgage calculators"))
story.append(make_bullet("\"I Want to Invest in Rental Property\" -- Routes to cash flow and cap rate tools"))
story.append(make_bullet("\"I Want to Flip a Property\" -- Directs to fix-and-flip and BRRRR calculators"))
story.append(make_bullet("\"I Want to Build Wealth Long-Term\" -- Points to portfolio and 1031 exchange tools"))

story.append(Spacer(1, 6))

story.append(Paragraph("Plain-Language Education with Real-Dollar Examples", h2_style))

story.append(Paragraph(
    "Every concept on the Zero Experience page is explained in everyday language with concrete dollar amounts. "
    "Instead of defining \"Cap Rate\" abstractly, the page shows: \"If a property earns $12,000/year in rent and "
    "costs $150,000, the cap rate is 8% -- meaning you earn 8 cents for every dollar invested.\"",
    body_style
))

story.append(Spacer(1, 6))

story.append(Paragraph("\"Try It Yourself\" Calculator Links", h2_style))

story.append(Paragraph(
    "Each educational section links directly to the relevant calculator with a prominent call-to-action. "
    "This creates an immediate bridge between learning a concept and applying it -- reinforcing retention "
    "through hands-on practice.",
    body_style
))

story.append(Spacer(1, 6))

story.append(Paragraph("20-Term Interactive Glossary Accordion", h2_style))

story.append(Paragraph(
    "An expandable glossary covers the 20 most essential real estate investment terms, each with a plain-language "
    "definition and a practical example:",
    body_style
))

# Glossary terms in a compact table
glossary_terms = [
    "Equity", "Mortgage", "Down Payment", "Closing Costs", "DTI",
    "Cap Rate", "Cash Flow", "Cash-on-Cash Return", "NOI", "Appreciation",
    "PMI", "BRRRR", "House Hacking", "1031 Exchange", "ARV",
    "LTV", "Subject-To", "Seller Financing", "DSCR", "Sensitivity Analysis",
]

# Display as 4-column table
glossary_data = []
row = []
for i, term in enumerate(glossary_terms):
    row.append(Paragraph(f'&#8226; {term}', ParagraphStyle("GT", parent=td_style, fontSize=8.5, leading=11)))
    if (i + 1) % 4 == 0:
        glossary_data.append(row)
        row = []
if row:
    while len(row) < 4:
        row.append(Paragraph("", td_style))
    glossary_data.append(row)

gt = Table(glossary_data, colWidths=[(W - 144) / 4] * 4)
gt.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), TEAL_LIGHT),
    ("TOPPADDING", (0, 0), (-1, -1), 4),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ("LEFTPADDING", (0, 0), (-1, -1), 6),
    ("BOX", (0, 0), (-1, -1), 0.5, TEAL),
    ("GRID", (0, 0), (-1, -1), 0.25, BORDER_LIGHT),
]))
story.append(gt)

story.append(Spacer(1, 6))

story.append(Paragraph("\"Where to Go Next\" Pathway Cards", h2_style))
story.append(Paragraph(
    "After exploring the Zero Experience page, users see curated pathway cards that guide them to their "
    "logical next step -- whether that is a specific calculator, a learning path, or the Scenario Lab. "
    "This ensures no user hits a dead end.",
    body_style
))

story.append(Spacer(1, 4))

story.append(Paragraph("Accessibility and Inclusion Design", h2_style))
story.append(Paragraph(
    "Phase 0 is designed with WCAG AA compliance, large touch targets, high-contrast text, and screen-reader-friendly "
    "markup. The language avoids jargon, uses short sentences, and assumes zero prior knowledge -- making real estate "
    "education accessible to all demographic groups.",
    body_style
))

# ─── Phase 1 ──────────────────────────────────────────────────────────────
story.append(PageBreak())
story.append(Paragraph("Phase 1: Learn Mode Toggle", h1_style))
story.append(teal_divider())

story.append(Paragraph(
    '<font color="#7a7974">Status: LIVE on all calculators  |  Module: shared/learn-mode.js (283 lines) + learn-mode.css</font>',
    caption_style
))

story.append(Spacer(1, 6))

story.append(Paragraph(
    "Learn Mode transforms every calculator from a computation tool into an interactive learning environment. "
    "A single toggle switch activates field-level educational content across the entire platform. Combined with "
    "the <b>interactive mind map tooltips</b> (Phase 2), Learn Mode now delivers contextual education at two "
    "levels: individual field guidance and visual concept-relationship mapping.",
    body_style
))

story.append(Spacer(1, 6))

story.append(Paragraph("Core Components", h2_style))

story.append(make_bullet("<b>Field-Level Educational Tooltips:</b> Every input field gains a contextual tooltip explaining "
    "what the value means, why it matters, and what typical values look like. Powered by shared/tooltips.js "
    "(255 lines, 50+ term definitions)."))

story.append(make_bullet("<b>\"Why This Matters\" Context:</b> Each field tooltip includes a section explaining the strategic "
    "significance of the input -- helping users understand not just what to enter, but why it affects their "
    "investment outcome."))

story.append(make_bullet("<b>Pre-Loaded Example Values:</b> When Learn Mode is active, calculators auto-populate with "
    "realistic example values. Users can see a complete analysis before changing any inputs, reducing "
    "the intimidation of a blank form."))

story.append(make_bullet("<b>Per-Calculator Toggle:</b> Learn Mode can be turned ON or OFF independently for each "
    "calculator, respecting the user's preference. Advanced users can disable it; beginners keep it active."))

story.append(Spacer(1, 6))

story.append(Paragraph("Technical Architecture", h2_style))
story.append(Paragraph(
    "Learn Mode is implemented as a 283-line shared JavaScript module (learn-mode.js) that injects educational "
    "overlays into any calculator's DOM. The module is complemented by learn-mode.css for styling and tooltips.js "
    "for the definition database. This shared architecture ensures consistency across all 23+ calculators while "
    "allowing per-calculator customization of example values and contextual guidance.",
    body_style
))


# ─── Phase 2 ──────────────────────────────────────────────────────────────
story.append(PageBreak())
story.append(Paragraph("Phase 2: Learn Mode + Mind Map Tooltips", h1_style))
story.append(teal_divider())

story.append(Paragraph(
    '<font color="#7a7974">Status: LIVE  |  58 mind maps  |  1,549 definitions  |  8 learning paths</font>',
    caption_style
))

story.append(Spacer(1, 6))

story.append(Paragraph(
    "Phase 2 combines two complementary education mechanisms: <b>interactive mind map tooltips</b> embedded "
    "in all 58 calculators and <b>8 structured learning paths</b> that guide users through multi-calculator "
    "journeys. Together, they convert IntelliTC's calculator suite into a <b>structured curriculum</b> with "
    "passive vocabulary acquisition built into every interaction.",
    body_style
))

story.append(Spacer(1, 6))

# Mind Map Tooltips subsection
story.append(Paragraph("Interactive Mind Map Tooltips", h2_style))

story.append(Paragraph(
    "Every calculator now includes a collapsible mind map that visualizes the relationships between all "
    "inputs, outputs, and concepts. When users hover over (desktop) or tap (mobile) any leaf node, a "
    "styled tooltip instantly displays a plain-language definition. This creates <b>passive vocabulary "
    "acquisition</b> -- users learn investment terminology naturally while performing calculations.",
    body_style
))

story.append(Spacer(1, 6))

story.append(make_kpi_row([
    ("Mind Maps Deployed", "58", "#01696f"),
    ("Total Definitions", "1,549", "#D19900"),
    ("Avg Definitions/Tool", "~27", "#01696f"),
    ("Competitor Coverage", "0", "#c0392b"),
]))

story.append(Spacer(1, 8))

story.append(Paragraph("Mind Map Architecture", h3_style))

story.append(make_bullet("<b>Coverage:</b> 58 mind maps, one per calculator tool, spanning 1,549 individual concept definitions"))
story.append(make_bullet("<b>Interaction:</b> Hover (desktop) or tap (mobile) on any leaf concept to see its definition in a styled tooltip"))
story.append(make_bullet("<b>Visual Design:</b> Teal-accented tooltip with header and body, consistent with the platform design system"))
story.append(make_bullet("<b>Accessibility:</b> Full dark mode support, mobile-responsive, collapsible accordion in compact view"))
story.append(make_bullet("<b>Educational Value:</b> Enables passive vocabulary acquisition -- users learn terminology while calculating"))
story.append(make_bullet("<b>Competitive Gap:</b> Zero competitors offer interactive concept maps with hover definitions on calculators"))

story.append(Spacer(1, 8))

story.append(Paragraph("8 Learning Paths", h2_style))

story.append(Paragraph(
    "Learning Paths complement mind map tooltips by providing <b>structured multi-calculator journeys</b>. "
    "Instead of randomly exploring tools, users follow a guided progression from foundational concepts to "
    "advanced analysis techniques -- with mind map tooltips providing contextual definitions at every step.",
    body_style
))

story.append(Spacer(1, 6))

paths_headers = ["Path", "Focus Area", "Progression"]
paths_rows = [
    ["Can I Buy a Home?", "First-time homebuyers", "Affordability --> DTI --> Mortgage --> True Cost"],
    ["My First Rental Property", "Beginner investors", "Cash Flow --> Cap Rate --> Rental Analysis --> ROI"],
    ["BRRRR Strategy Deep Dive", "BRRRR investors", "BRRRR --> Refinance --> ARV --> Cash-on-Cash"],
    ["Creative Finance Toolkit", "Advanced strategies", "Seller Financing --> Subject-To --> Lease Option --> Wrap"],
    ["Agent Deal Analyzer", "Real estate agents", "CMA --> Commission --> Deal Grading --> Investment Analysis"],
    ["Lender Qualification Suite", "Lending professionals", "DTI Stress Test --> DSCR --> Qualification --> Gov Loans"],
    ["Building Wealth Portfolio", "Long-term investors", "Portfolio Manager --> 1031 Exchange --> Sensitivity Grid"],
    ["Commercial Analysis", "Commercial RE", "Multifamily --> Self-Storage --> RV Park --> Net Effective Rent"],
]

story.append(make_table(paths_headers, paths_rows,
    col_widths=[110, 100, 210]))

story.append(Spacer(1, 8))

story.append(Paragraph(
    "Each path links to specific calculators in the recommended learning order, creating a guided journey "
    "that builds competence progressively. Users who complete a path have engaged with 4-6 calculators in a "
    "logical sequence, developing genuine analytical skills rather than isolated calculations.",
    body_style
))


# ─── Phase 3 ──────────────────────────────────────────────────────────────
story.append(PageBreak())
story.append(Paragraph("Phase 3: 12 Scenario Lab Exercises", h1_style))
story.append(teal_divider())

story.append(Paragraph(
    '<font color="#7a7974">Status: LIVE  |  URL: /scenario-lab/  |  12 exercises across 3 modes</font>',
    caption_style
))

story.append(Spacer(1, 6))

story.append(Paragraph(
    "The Scenario Lab bridges the gap between learning concepts and applying them to real-world situations. "
    "It offers 12 carefully designed exercises that simulate authentic investment decisions, available in "
    "three distinct modes:",
    body_style
))

story.append(Spacer(1, 4))

modes_headers = ["Mode", "Description", "Best For"]
modes_rows = [
    ["Guided Mode", "Step-by-step instructions with hints and checkpoints",
     "Beginners learning the analytical process"],
    ["Timed Mode", "Same scenarios with a countdown timer and no hints",
     "Intermediate users building speed and confidence"],
    ["Sandbox Mode", "Open-ended exploration with all parameters adjustable",
     "Advanced users testing creative strategies"],
]

story.append(make_table(modes_headers, modes_rows,
    col_widths=[80, 190, 148]))

story.append(Spacer(1, 8))

story.append(Paragraph(
    "Scenarios are modeled on real-world situations: analyzing a duplex in a college town, evaluating a BRRRR "
    "deal with construction overruns, stress-testing a rental during a vacancy spike, or comparing seller financing "
    "versus conventional loans. Each exercise reinforces calculator skills while building the judgment that "
    "separates novice investors from experienced practitioners.",
    body_style
))


# ─── Phase 4 ──────────────────────────────────────────────────────────────
story.append(PageBreak())
story.append(Paragraph("Phase 4: ICREA Certification Program", h1_style))
story.append(teal_divider())

story.append(Paragraph(
    '<font color="#7a7974">Status: LIVE  |  URL: /certification/  |  3 certification tiers</font>',
    caption_style
))

story.append(Spacer(1, 6))

story.append(Paragraph(
    "The IntelliTC Certified Real Estate Analyst (ICREA) program is the capstone of the education pipeline. "
    "It transforms platform engagement into a verifiable professional credential -- creating the strongest "
    "possible switching cost.",
    body_style
))

story.append(Spacer(1, 6))

cert_headers = ["Tier", "Designation", "Questions", "Question Pool", "Time Limit", "Pass Rate"]
cert_rows = [
    ["Tier 1", "Associate (ACREA)", "25", "40-question pool", "35 minutes", "70%"],
    ["Tier 2", "Professional (PCREA)", "30", "53-question pool", "50 minutes", "80%"],
    ["Tier 3", "Master (MCREA)", "35", "53-question pool", "60 minutes", "85%"],
]

story.append(make_table(cert_headers, cert_rows,
    col_widths=[45, 95, 55, 85, 65, 55]))

story.append(Spacer(1, 8))

story.append(Paragraph("Why Certification Is the Ultimate Moat", h2_style))

story.append(make_bullet("<b>Credential Lock-In:</b> Once a user earns ACREA, PCREA, or MCREA, they have a vested "
    "interest in the IntelliTC ecosystem. The credential's value is tied to the platform's reputation."))

story.append(make_bullet("<b>Progressive Investment:</b> Each tier requires more study, more practice, and deeper "
    "engagement with IntelliTC tools. By the time a user reaches MCREA, they have invested dozens of hours."))

story.append(make_bullet("<b>Network Effects:</b> As more professionals hold ICREA credentials, employer and industry "
    "recognition grows, attracting more candidates -- a self-reinforcing cycle."))

story.append(make_bullet("<b>Total Question Pool:</b> 146 questions across all tiers (40 + 53 + 53), with randomized "
    "selection ensuring each exam attempt is unique. This prevents memorization-based passing."))

story.append(Spacer(1, 6))

story.append(Paragraph(
    "The certification program is hosted at /certification/ with full exam infrastructure: timed assessments, "
    "randomized question selection from the pool, instant scoring, certificate generation, and tier progression "
    "tracking.",
    body_style
))


# ═══════════════════════════════════════════════════════════════════════════
# SECTION 6: NEW FEATURES
# ═══════════════════════════════════════════════════════════════════════════
story.append(PageBreak())
story.append(Paragraph("NEW: Market Benchmark Quick-Select Tags", h1_style))
story.append(gold_divider())

story.append(Paragraph(
    '<font color="#D19900"><b>Education Through UX Innovation</b></font>',
    ParagraphStyle("GoldLabel", parent=body_style, fontSize=10)
))

story.append(Spacer(1, 4))

story.append(Paragraph(
    "Market Benchmark Tags serve a dual purpose: they are both a <b>UX convenience feature</b> and a powerful "
    "<b>educational tool</b>. By showing users what \"typical\" values look like for each input field, the tags "
    "provide contextual anchoring that teaches market norms passively.",
    body_style
))

story.append(Spacer(1, 6))

story.append(make_kpi_row([
    ("Calculators with Benchmark Tags", "23", "#01696f"),
    ("Tier 1 (Core)", "6", "#01696f"),
    ("Tier 2 (Advanced)", "7", "#D19900"),
    ("Tier 3 (Specialized) + Pre-Existing", "8+2", "#01696f"),
]))

story.append(Spacer(1, 8))

story.append(Paragraph("How Tags Educate", h2_style))

story.append(Paragraph(
    "When a user sees a tag reading \"7% Avg\" next to an interest rate field, they immediately learn what "
    "a normal mortgage rate looks like. Tags like \"CA 13.3%\" for state tax rates teach geographic variation. "
    "\"$0.16 Avg\" for per-square-foot values anchors users to realistic cost expectations. Examples of "
    "contextual tags include:",
    body_style
))

story.append(make_bullet("\"7% Avg\" -- Typical mortgage interest rates"))
story.append(make_bullet("\"8% Avg\" -- Average cap rates in many markets"))
story.append(make_bullet("\"CA 13.3%\" -- California's top marginal state income tax rate"))
story.append(make_bullet("\"$0.16 Avg\" -- Average per-square-foot operating costs"))

story.append(Spacer(1, 6))

story.append(Paragraph("Tier Breakdown", h2_style))

tier_headers = ["Tier", "Count", "Scope", "Description"]
tier_rows = [
    ["Tier 1 (Core)", "6 calculators", "Highest-traffic tools",
     "Essential calculators that most users interact with first"],
    ["Tier 2 (Advanced)", "7 calculators", "Strategy-specific tools",
     "Specialized calculators for intermediate/advanced users"],
    ["Tier 3 (Specialized)", "8 calculators", "Niche and professional",
     "Professional-grade tools for specific use cases"],
    ["Pre-Existing", "2 calculators", "Already tagged",
     "Calculators that had benchmark tags before the rollout"],
]

story.append(make_table(tier_headers, tier_rows,
    col_widths=[90, 72, 110, 160]))


# ─── Interactive Mind Map Tooltips (NEW Feature Section) ─────────────────
story.append(PageBreak())
story.append(Paragraph("NEW: Interactive Mind Map Tooltips", h1_style))
story.append(gold_divider())

story.append(Paragraph(
    '<font color="#D19900"><b>Education Through Concept Visualization — Unique in the Market</b></font>',
    ParagraphStyle("GoldLabel2", parent=body_style, fontSize=10)
))

story.append(Spacer(1, 4))

story.append(Paragraph(
    "Interactive Mind Map Tooltips represent IntelliTC's most significant educational innovation. Every one of the "
    "platform's 58 calculator tools now includes a collapsible mind map that visualizes the relationships between "
    "all inputs, outputs, and underlying concepts. Hovering over any leaf node in the tree instantly displays a "
    "plain-language definition in a styled tooltip -- transforming each calculator into a <b>self-contained learning "
    "environment</b>.",
    body_style
))

story.append(Spacer(1, 6))

story.append(make_kpi_row([
    ("Mind Maps Deployed", "58", "#01696f"),
    ("Total Definitions", "1,549", "#D19900"),
    ("Avg per Calculator", "~27", "#01696f"),
    ("Competitor Equivalent", "None", "#c0392b"),
]))

story.append(Spacer(1, 8))

story.append(Paragraph("How Mind Map Tooltips Educate", h2_style))

story.append(Paragraph(
    "Mind maps bridge the gap between raw computation and conceptual understanding. A user analyzing a BRRRR deal "
    "can expand the mind map to see how Purchase Price, Rehab Costs, ARV, Refinance Amount, and Cash Flow all "
    "relate to one another. Hovering over \"ARV\" shows: \"After Repair Value -- the estimated market value of a "
    "property after all renovations are complete.\" This <b>passive vocabulary acquisition</b> means users absorb "
    "investment terminology naturally while performing real calculations.",
    body_style
))

story.append(Spacer(1, 6))

story.append(make_bullet("<b>Collapsible Tree Structure:</b> Mind maps render as expandable/collapsible trees within each calculator, "
    "showing the hierarchy of concepts from high-level strategy down to individual input fields"))
story.append(make_bullet("<b>Hover-to-Learn Definitions:</b> 1,549 individual definitions across all 58 tools, each written in "
    "plain language with practical context for real estate investors"))
story.append(make_bullet("<b>Visual Relationship Mapping:</b> Users see how inputs connect to outputs and how concepts relate "
    "to each other -- building mental models rather than memorizing isolated formulas"))
story.append(make_bullet("<b>Dark Mode + Mobile Support:</b> Full dark mode rendering, responsive mobile layout with tap-to-reveal "
    "tooltips, and collapsible accordion view for compact screens"))
story.append(make_bullet("<b>Mind Map Toggle Button:</b> Each calculator includes a prominent Mind Map button for on-demand "
    "concept exploration -- users choose when to learn, maintaining focus during active calculation"))

story.append(Spacer(1, 8))

story.append(Paragraph("Strategic Value", h2_style))

mm_strat_headers = ["Dimension", "Impact", "Competitive Gap"]
mm_strat_rows = [
    ["Passive Learning", "Users learn terminology without leaving the calculator",
     "No competitor offers embedded concept definitions"],
    ["Content Depth", "1,549 curated definitions -- each human-authored",
     "AI could generate but not replicate curated quality"],
    ["Visual Comprehension", "Concept trees show how variables interrelate",
     "No competitor visualizes calculator relationships"],
    ["Education Pipeline", "Phase 2 integration creates seamless learning",
     "Competitors lack structured education entirely"],
    ["Moat Reinforcement", "1,549 definitions = massive replication barrier",
     "Months of expert authoring to replicate"],
]

story.append(make_table(mm_strat_headers, mm_strat_rows,
    col_widths=[90, 170, 170]))


# ─── Inline Validation ────────────────────────────────────────────────────
story.append(PageBreak())
story.append(Paragraph("NEW: Inline Validation as Educational Guardrail", h1_style))
story.append(gold_divider())

story.append(Paragraph(
    "Six calculators now feature styled inline error messages that replace generic browser alert popups. "
    "These messages do more than flag errors -- they <b>explain why the input is invalid</b>, turning "
    "mistakes into learning moments.",
    body_style
))

story.append(Spacer(1, 6))

story.append(Paragraph(
    "For example, instead of a browser alert saying \"Invalid input,\" the inline validation might display: "
    "\"Down payment cannot exceed purchase price. A typical down payment is 20-25% of the purchase price for "
    "investment properties.\" This transforms an error state into an educational opportunity.",
    body_style
))

story.append(Spacer(1, 6))

story.append(make_kpi_row([
    ("Calculators with Inline Validation", "6", "#01696f"),
    ("Error Type", "Educational", "#D19900"),
    ("Replaces", "Browser Alerts", "#01696f"),
]))

story.append(Spacer(1, 8))

story.append(Paragraph("Design Philosophy", h2_style))

story.append(make_bullet("<b>Contextual:</b> Error messages reference the specific field and explain the valid range"))
story.append(make_bullet("<b>Educational:</b> Messages include typical values and explain why the constraint exists"))
story.append(make_bullet("<b>Non-Blocking:</b> Styled inline beneath the field, not modal popups that interrupt flow"))
story.append(make_bullet("<b>Consistent:</b> Same visual pattern across all 6 calculators using shared CSS"))


# ─── 11 PDF Guides ────────────────────────────────────────────────────────
story.append(PageBreak())
story.append(Paragraph("NEW: 11 Downloadable PDF Guides", h1_style))
story.append(gold_divider())

story.append(Paragraph(
    "IntelliTC now offers <b>11 professionally designed PDF guides</b> that extend education beyond the "
    "calculator interface. Available at /guides/, these guides provide deep-dive content that users can "
    "download, print, and reference offline -- creating engagement that persists even when users are not "
    "on the platform.",
    body_style
))

story.append(Spacer(1, 6))

guides_headers = ["#", "Guide Title", "Focus Area"]
guides_rows = [
    ["1", "Getting Started Guide", "Platform orientation and first steps for new users"],
    ["2", "Going Deeper Guide", "Intermediate concepts and advanced calculator features"],
    ["3", "Mastering the Platform Guide", "Expert-level techniques and workflow optimization"],
    ["4", "Seniors Corner Guide", "Real estate strategies tailored for seniors and retirees"],
    ["5", "Land Flip Guide", "Land acquisition, development, and flipping strategies"],
    ["6", "Deal Underwriting Guide", "Comprehensive deal analysis and underwriting methodology"],
    ["7", "Capital Gains Tax Guide", "Tax implications, 1031 exchanges, and tax optimization"],
    ["8", "Investment Strategy Playbook", "Strategic frameworks for building a real estate portfolio"],
    ["9", "Professional Services Framework", "Guide for agents, lenders, and service professionals"],
    ["10", "The Language of Real Estate", "Complete glossary and terminology reference"],
    ["11", "Wealth Architects Roadmap", "Long-term wealth building through real estate investment"],
]

story.append(make_table(guides_headers, guides_rows,
    col_widths=[22, 145, 260]))

story.append(Spacer(1, 8))

story.append(Paragraph("Strategic Value of PDF Guides", h2_style))

story.append(make_bullet("<b>Offline Engagement:</b> Users carry IntelliTC's brand and content beyond the browser"))
story.append(make_bullet("<b>Lead Generation:</b> Guides can be gated for email capture in future monetization"))
story.append(make_bullet("<b>Authority Building:</b> Professional PDF content positions IntelliTC as an educational authority"))
story.append(make_bullet("<b>Content Depth:</b> Guides cover topics too detailed for in-app tooltips or learning paths"))


# ─── Platform Capabilities Strip ──────────────────────────────────────────
story.append(PageBreak())
story.append(Paragraph("NEW: Platform Capabilities Strip", h1_style))
story.append(gold_divider())

story.append(Paragraph(
    "The homepage now prominently displays a capabilities strip that communicates IntelliTC's core value "
    "propositions at a glance. This strip appears above the fold, ensuring every visitor immediately "
    "understands the platform's differentiated features:",
    body_style
))

story.append(Spacer(1, 6))

cap_headers = ["Capability", "Message", "Strategic Purpose"]
cap_rows = [
    ["PDF and CSV Exports", "Export analyses as professional reports",
     "Enables sharing with lenders, partners, and clients"],
    ["Shareable Report Links", "Generate links to share analyses",
     "Viral distribution mechanism for platform growth"],
    ["Built-In Learn Mode", "Learn as you calculate",
     "Immediately signals education-first positioning"],
    ["No Sign-Up Required", "Start analyzing immediately",
     "Eliminates friction; builds trust through generosity"],
]

story.append(make_table(cap_headers, cap_rows,
    col_widths=[105, 150, 175]))

story.append(Spacer(1, 8))

story.append(Paragraph(
    "The \"No Sign-Up Required\" capability is particularly strategic: it signals confidence in the platform's "
    "value and removes the primary friction point that drives users to competitors. Users who experience the "
    "full platform without registration are more likely to return and eventually convert to paid tiers.",
    body_style
))


# ═══════════════════════════════════════════════════════════════════════════
# SECTION 7: ASSET & LEASE MANAGEMENT SUITE
# ═══════════════════════════════════════════════════════════════════════════
story.append(PageBreak())
story.append(Paragraph("Asset and Lease Management Suite", h1_style))
story.append(gold_divider())

story.append(Paragraph(
    "Five specialized calculators bridge the gap between consumer-grade investment analysis and "
    "institutional-grade asset management. This suite positions IntelliTC to serve not just individual "
    "investors but also property managers, commercial operators, and institutional portfolios.",
    body_style
))

story.append(Spacer(1, 6))

asset_headers = ["Calculator", "Function", "User Segment"]
asset_rows = [
    ["Lease Expiration Tracker", "Monitors lease terms, renewal dates, and vacancy risk across portfolios",
     "Property managers, landlords"],
    ["Budget Variance Analyzer", "Compares actual vs. projected operating expenses with drill-down analysis",
     "Asset managers, operators"],
    ["Net Effective Rent Calculator", "Calculates true rental value after concessions, free rent, and TI allowances",
     "Commercial leasing agents"],
    ["Tenant Turnover Cost Analyzer", "Models the full cost of tenant turnover including vacancy, repairs, and re-leasing",
     "Property managers"],
    ["Housing Code Compliance Checker", "Assesses compliance risk and remediation cost estimates",
     "Landlords, compliance officers"],
]

story.append(make_table(asset_headers, asset_rows,
    col_widths=[120, 190, 120]))

story.append(Spacer(1, 8))

story.append(Paragraph(
    "These tools extend the education moat into professional territory. A user who learns real estate "
    "fundamentals through Phases 0-4 can seamlessly transition into professional asset management tools -- "
    "maintaining continuity within the IntelliTC ecosystem rather than switching to institutional software.",
    body_style
))


# ═══════════════════════════════════════════════════════════════════════════
# SECTION 8: HANDOFF ARCHITECTURE
# ═══════════════════════════════════════════════════════════════════════════
story.append(PageBreak())
story.append(Paragraph("Handoff Architecture", h1_style))
story.append(gold_divider())

story.append(Paragraph(
    "The education pipeline's power comes not from individual phases but from the <b>seamless handoffs between them</b>. "
    "Each phase naturally leads to the next, creating a continuous learning journey with no dead ends.",
    body_style
))

story.append(Spacer(1, 8))

handoff_headers = ["From", "To", "Handoff Mechanism", "User Experience"]
handoff_rows = [
    ["Zero Experience", "Learn Mode",
     "\"Try It Yourself\" calculator links", "User clicks to try a calculator with Learn Mode auto-enabled"],
    ["Learn Mode", "Mind Map Tooltips",
     "Mind Map toggle button on each calculator", "User expands mind map to explore concept relationships"],
    ["Mind Map Tooltips", "Learning Paths",
     "\"Continue Learning\" prompts", "User follows structured path with mind map context at every step"],
    ["Learning Paths", "Scenario Lab",
     "\"Practice This\" links at path completion", "User transitions from guided learning to hands-on practice"],
    ["Scenario Lab", "Certification",
     "\"Ready to Certify?\" progression prompt", "User who completes scenarios is guided toward ACREA exam"],
    ["Certification", "Advanced Tools",
     "Tier-based tool recommendations", "Certified users get directed to professional-grade calculators"],
    ["All Phases", "PDF Guides",
     "Contextual download prompts", "Relevant guides surface throughout the learning journey"],
    ["Homepage", "Zero Experience",
     "Guided Wizard + role-based cards", "New visitors are routed to appropriate entry point"],
]

story.append(make_table(handoff_headers, handoff_rows,
    col_widths=[72, 72, 135, 163]))

story.append(Spacer(1, 8))

story.append(Paragraph(
    "The Guided Wizard on the homepage and the 4 role-based entry cards ensure that every new visitor -- "
    "regardless of experience level -- is immediately routed to the most appropriate starting point. This "
    "eliminates the \"blank page\" problem that causes bounce rates on tool-heavy platforms.",
    body_style
))


# ═══════════════════════════════════════════════════════════════════════════
# SECTION 9: STRATEGIC ENHANCEMENTS
# ═══════════════════════════════════════════════════════════════════════════
story.append(PageBreak())
story.append(Paragraph("Strategic Enhancements", h1_style))
story.append(gold_divider())

story.append(Paragraph(
    "With all five education phases live, the next strategic priority is to deepen and harden the moat. "
    "The following recommendations focus on making IntelliTC's educational model structurally uncopyable -- "
    "even by well-funded competitors with AI capabilities.",
    body_style
))

story.append(Spacer(1, 8))

story.append(Paragraph("1. AI-Powered Personalized Learning Paths", h2_style))
story.append(Paragraph(
    "Implement adaptive learning that adjusts content difficulty, calculator recommendations, and scenario "
    "complexity based on user behavior. Track which concepts users struggle with (via validation errors, "
    "time-on-field, and help tooltip usage) and dynamically adjust the learning path. This creates a "
    "personalization layer that becomes more valuable with more user data -- a classic data network effect.",
    body_style
))

story.append(Spacer(1, 6))

story.append(Paragraph("2. Community-Generated Scenario Library", h2_style))
story.append(Paragraph(
    "Allow certified users (ACREA+) to submit real-world scenarios to the Scenario Lab. Curated, "
    "peer-reviewed scenarios create user-generated content that scales without proportional cost while "
    "building community engagement and credential value.",
    body_style
))

story.append(Spacer(1, 6))

story.append(Paragraph("3. Employer Verification and Industry Recognition", h2_style))
story.append(Paragraph(
    "Partner with real estate brokerages, property management firms, and lending institutions to recognize "
    "ICREA certifications. Employer verification transforms the credential from a platform feature into "
    "an industry standard -- the ultimate moat.",
    body_style
))

story.append(Spacer(1, 6))

story.append(Paragraph("4. Learning Analytics Dashboard", h2_style))
story.append(Paragraph(
    "Build a personal analytics dashboard showing: calculators used, concepts mastered, scenarios completed, "
    "certification progress, and skill gaps. Visualizing progress creates psychological investment that "
    "increases switching costs.",
    body_style
))

story.append(Spacer(1, 6))

story.append(Paragraph("5. Mobile-Native Education Experience", h2_style))
story.append(Paragraph(
    "Develop a progressive web app (PWA) or native mobile app focused on bite-sized learning: daily "
    "real estate concepts, micro-quizzes, market data alerts, and push notifications for learning streak "
    "maintenance. Mobile engagement dramatically increases daily active usage.",
    body_style
))

story.append(Spacer(1, 6))

story.append(Paragraph("6. API and White-Label Education Platform", h2_style))
story.append(Paragraph(
    "Offer IntelliTC's education pipeline as a white-label solution for real estate schools, brokerages, "
    "and continuing education providers. This transforms the platform from a direct-to-consumer tool into "
    "a B2B education infrastructure play -- multiplying distribution and revenue streams.",
    body_style
))

story.append(Spacer(1, 8))

# Enhancement priority matrix
enhance_headers = ["Enhancement", "Impact", "Effort", "Priority", "Moat Contribution"]
enhance_rows = [
    ["AI Personalized Paths", "Very High", "High", "P1 (Next Quarter)", "Data network effect"],
    ["Community Scenarios", "High", "Medium", "P1 (Next Quarter)", "User-generated content moat"],
    ["Employer Verification", "Very High", "Medium", "P2 (6 months)", "Industry standard moat"],
    ["Learning Analytics", "Medium", "Low", "P2 (6 months)", "Switching cost deepener"],
    ["Mobile Experience", "High", "High", "P3 (9 months)", "Engagement multiplier"],
    ["White-Label Platform", "Very High", "Very High", "P3 (12 months)", "Distribution moat"],
]

story.append(make_table(enhance_headers, enhance_rows,
    col_widths=[100, 60, 55, 80, 115]))

story.append(Spacer(1, 10))

# Final callout
story.append(teal_divider())
story.append(Paragraph(
    "IntelliTC Solutions has built something genuinely rare in the real estate technology space: a platform "
    "where education and computation are inseparable. The five-phase pipeline -- now reinforced with 1,549 "
    "interactive mind map definitions, benchmark tags, inline validation, 11 PDF guides, and the capabilities "
    "strip -- creates an ecosystem that teaches, practices, certifies, and retains users at every stage of "
    "their investment journey. The strategic enhancements outlined above will transform this strong position "
    "into an unassailable one.",
    body_style
))

story.append(Spacer(1, 10))

# Document end
story.append(divider())
story.append(Paragraph(
    '<font color="#7a7974" size="8">End of Document  |  IntelliTC Solutions  |  April 2026  |  CONFIDENTIAL</font>',
    ParagraphStyle("EndDoc", parent=caption_style, alignment=TA_CENTER)
))


# ─── Build ────────────────────────────────────────────────────────────────
doc.multiBuild(story)
print(f"PDF generated: {OUTPUT}")
print(f"File size: {os.path.getsize(OUTPUT):,} bytes")
