/* ============================================================
   IntelliTC Solutions — Export Engine (CSV + PDF)
   ============================================================
   Universal export for all calculators. Auto-detects inputs,
   KPIs, and result tables from the DOM. No per-calculator
   configuration required.
   ============================================================ */

(function() {
  'use strict';

  /* ---- Helpers ---- */
  function getCalcName() {
    const h1 = document.querySelector('#inputPanel .panel-title');
    return h1 ? h1.textContent.trim() : 'IntelliTC Report';
  }

  function getTimestamp() {
    return new Date().toLocaleString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  function sanitizeCSV(val) {
    const s = String(val).replace(/"/g, '""');
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s;
  }

  /* ---- Collect Inputs ---- */
  function collectInputs() {
    const inputs = [];
    document.querySelectorAll('#inputPanel .field').forEach(field => {
      const label = field.querySelector('label');
      const input = field.querySelector('input, select');
      if (!label || !input) return;
      const name = label.textContent.trim();
      let val = input.value;
      const unit = field.querySelector('.unit');
      if (unit) {
        const u = unit.textContent.trim();
        if (u === '$') val = '$' + val;
        else if (u === '%') val = val + '%';
        else if (u === 'yrs') val = val + ' years';
        else if (u !== '') val = val + ' ' + u;
      }
      if (input.tagName === 'SELECT') {
        const opt = input.options[input.selectedIndex];
        if (opt) val = opt.textContent.trim();
      }
      inputs.push({ name, value: val });
    });
    return inputs;
  }

  /* ---- Collect KPIs ---- */
  function collectKPIs() {
    const kpis = [];
    document.querySelectorAll('#resultsPanel .kpi-card').forEach(card => {
      const label = card.querySelector('.kpi-label');
      const value = card.querySelector('.kpi-value');
      if (!label || !value) return;
      const detail = card.querySelector('.kpi-delta');
      kpis.push({
        name: label.textContent.trim(),
        value: value.textContent.trim(),
        detail: detail ? detail.textContent.trim() : ''
      });
    });
    return kpis;
  }

  /* ---- Collect Tables ---- */
  function collectTables() {
    const tables = [];
    document.querySelectorAll('#resultsPanel .results-table').forEach(table => {
      const headers = [];
      table.querySelectorAll('thead th').forEach(th => headers.push(th.textContent.trim()));
      const rows = [];
      table.querySelectorAll('tbody tr').forEach(tr => {
        const cells = [];
        tr.querySelectorAll('td').forEach(td => cells.push(td.textContent.trim()));
        if (cells.length) rows.push(cells);
      });
      // Try to find a title above the table
      let title = '';
      const wrap = table.closest('.table-wrap');
      if (wrap) {
        const prev = wrap.previousElementSibling;
        if (prev && (prev.tagName === 'H3' || prev.tagName === 'H4')) {
          title = prev.textContent.trim();
        }
      }
      if (headers.length || rows.length) {
        tables.push({ title, headers, rows });
      }
    });
    return tables;
  }

  /* ---- CSV Export ---- */
  function exportCSV() {
    const name = getCalcName();
    const ts = getTimestamp();
    const inputs = collectInputs();
    const kpis = collectKPIs();
    const tables = collectTables();
    const lines = [];

    lines.push(sanitizeCSV(name));
    lines.push('Generated,' + sanitizeCSV(ts));
    lines.push('Source,IntelliTC Solutions');
    lines.push('');

    // Inputs
    if (inputs.length) {
      lines.push('INPUTS');
      inputs.forEach(i => lines.push(sanitizeCSV(i.name) + ',' + sanitizeCSV(i.value)));
      lines.push('');
    }

    // KPIs
    if (kpis.length) {
      lines.push('KEY RESULTS');
      kpis.forEach(k => {
        let row = sanitizeCSV(k.name) + ',' + sanitizeCSV(k.value);
        if (k.detail) row += ',' + sanitizeCSV(k.detail);
        lines.push(row);
      });
      lines.push('');
    }

    // Tables
    tables.forEach(t => {
      if (t.title) lines.push(sanitizeCSV(t.title));
      if (t.headers.length) lines.push(t.headers.map(sanitizeCSV).join(','));
      t.rows.forEach(r => lines.push(r.map(sanitizeCSV).join(',')));
      lines.push('');
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, slugify(name) + '.csv');
  }

  /* ---- PDF Export — Professional Client-Ready Layout ---- */
  function exportPDF() {
    const name = getCalcName();
    const ts = getTimestamp();
    const inputs = collectInputs();
    const kpis = collectKPIs();
    const tables = collectTables();

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 18;
    const contentW = pageW - margin * 2;
    let y = margin;

    /* -- Theme colors -- */
    const TEAL = [1, 105, 111];
    const DARK_TEAL = [0, 75, 80];
    const LIGHT_BG = [247, 246, 242];
    const WHITE = [255, 255, 255];
    const DARK = [28, 25, 20];
    const MID = [90, 90, 85];
    const LIGHT = [160, 160, 155];

    function checkPage(needed) {
      if (y + needed > pageH - 20) {
        doc.addPage();
        y = margin;
      }
    }

    function drawSectionHeader(title) {
      checkPage(16);
      doc.setFillColor(...TEAL);
      doc.roundedRect(margin, y - 1, contentW, 8, 1.5, 1.5, 'F');
      doc.setTextColor(...WHITE);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(title.toUpperCase(), margin + 4, y + 4.5);
      y += 12;
    }

    /* ---- Page Header with accent bar ---- */
    // Teal header block
    doc.setFillColor(...TEAL);
    doc.rect(0, 0, pageW, 32, 'F');
    // Darker accent strip at bottom of header
    doc.setFillColor(...DARK_TEAL);
    doc.rect(0, 32, pageW, 1.5, 'F');

    // Logo text
    doc.setTextColor(...WHITE);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('IntelliTC', margin, 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('SOLUTIONS', margin + 24, 10);

    // Report title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(name, margin, 22);

    // Subtitle with date
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Generated ' + ts, margin, 28);

    // Confidential marker (right side)
    doc.setFontSize(7);
    doc.setTextColor(200, 230, 232);
    doc.text('CLIENT REPORT', pageW - margin, 10, { align: 'right' });

    y = 40;

    /* ---- Inputs Section ---- */
    if (inputs.length) {
      drawSectionHeader('Input Assumptions');

      doc.setFontSize(8.5);
      const colW = contentW / 2;
      inputs.forEach((inp, i) => {
        checkPage(7);
        const col = i % 2;
        const xLabel = margin + col * colW + 2;
        const xVal = xLabel + colW - 6;

        // Alternating row shading for pairs
        if (col === 0) {
          const rowIdx = Math.floor(i / 2);
          if (rowIdx % 2 === 0) {
            doc.setFillColor(...LIGHT_BG);
            doc.rect(margin, y - 3, contentW, 6, 'F');
          }
        }

        doc.setTextColor(...MID);
        doc.setFont('helvetica', 'normal');
        doc.text(inp.name, xLabel, y);
        doc.setTextColor(...DARK);
        doc.setFont('helvetica', 'bold');
        doc.text(inp.value, xVal, y, { align: 'right' });
        if (col === 1 || i === inputs.length - 1) y += 6;
      });
      y += 4;
    }

    /* ---- KPIs Section ---- */
    if (kpis.length) {
      drawSectionHeader('Key Results');

      const kpiPerRow = Math.min(kpis.length, 4);
      const kpiW = contentW / kpiPerRow;
      const kpiH = 18;

      kpis.forEach((kpi, i) => {
        const col = i % kpiPerRow;
        if (col === 0 && i > 0) y += kpiH + 4;
        checkPage(kpiH + 4);
        const x = margin + col * kpiW;

        // KPI card background
        doc.setFillColor(...LIGHT_BG);
        doc.roundedRect(x + 1, y - 2, kpiW - 4, kpiH, 2, 2, 'F');
        // Left accent bar
        doc.setFillColor(...TEAL);
        doc.roundedRect(x + 1, y - 2, 1.5, kpiH, 0.75, 0.75, 'F');

        // Label
        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...LIGHT);
        doc.text(kpi.name.toUpperCase(), x + 5, y + 3.5);

        // Value
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...DARK);
        doc.text(kpi.value, x + 5, y + 11);

        // Detail
        if (kpi.detail) {
          doc.setFontSize(6);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...LIGHT);
          doc.text(kpi.detail, x + 5, y + 15);
        }
      });
      y += kpiH + 8;
    }

    /* ---- Tables ---- */
    tables.forEach(t => {
      if (t.title) {
        drawSectionHeader(t.title);
      }

      if (t.headers.length && t.rows.length) {
        const colCount = t.headers.length;
        const colWidths = [];
        // Smart column sizing
        colWidths.push(contentW * 0.40);
        const remaining = contentW * 0.60;
        for (let c = 1; c < colCount; c++) {
          colWidths.push(remaining / (colCount - 1));
        }

        // Header row
        checkPage(8);
        doc.setFillColor(...TEAL);
        doc.roundedRect(margin, y - 3.5, contentW, 7, 1, 1, 'F');
        doc.setTextColor(...WHITE);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        let hx = margin + 3;
        t.headers.forEach((h, i) => {
          if (i === 0) doc.text(h, hx, y + 0.5);
          else doc.text(h, hx + colWidths[i] - 5, y + 0.5, { align: 'right' });
          hx += colWidths[i];
        });
        y += 6;

        // Data rows
        doc.setFontSize(7.5);
        t.rows.forEach((row, ri) => {
          checkPage(6.5);
          // Alternating row shading
          if (ri % 2 === 0) {
            doc.setFillColor(250, 249, 246);
            doc.rect(margin, y - 3.5, contentW, 6, 'F');
          }

          // Bold totals/summary rows with accent line
          const isTotal = row[0] && (
            row[0].startsWith('Net ') || row[0].startsWith('Total ') ||
            row[0].startsWith('Effective ') || row[0].includes('DSCR') ||
            row[0].startsWith('Gross ')
          );

          if (isTotal) {
            doc.setDrawColor(...TEAL);
            doc.setLineWidth(0.3);
            doc.line(margin, y - 3.5, margin + contentW, y - 3.5);
          }

          let rx = margin + 3;
          row.forEach((cell, ci) => {
            doc.setTextColor(isTotal ? DARK[0] : MID[0], isTotal ? DARK[1] : MID[1], isTotal ? DARK[2] : MID[2]);
            doc.setFont('helvetica', isTotal ? 'bold' : 'normal');
            if (ci === 0) doc.text(String(cell), rx, y);
            else doc.text(String(cell), rx + colWidths[ci] - 5, y, { align: 'right' });
            rx += colWidths[ci];
          });
          y += 5.5;
        });
        y += 6;
      }
    });

    /* ---- Footer on all pages ---- */
    const pageCount = doc.internal.getNumberOfPages();
    for (let p = 1; p <= pageCount; p++) {
      doc.setPage(p);
      const footY = pageH - 8;

      // Footer line
      doc.setDrawColor(...TEAL);
      doc.setLineWidth(0.3);
      doc.line(margin, footY - 4, pageW - margin, footY - 4);

      // Footer text
      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...LIGHT);
      doc.text('IntelliTC Solutions  \u2022  intellitcsolutions.com  \u2022  For educational purposes only \u2014 not financial advice', margin, footY);
      doc.text('Page ' + p + ' of ' + pageCount, pageW - margin, footY, { align: 'right' });
    }

    doc.save(slugify(name) + '.pdf');
  }

  /* ---- Utilities ---- */
  function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
  }

  /* ---- Inject Export UI ---- */
  function injectExportButtons() {
    const resultsHeader = document.querySelector('#resultsPanel .results-header');
    if (!resultsHeader || resultsHeader.querySelector('.export-group')) return;

    const group = document.createElement('div');
    group.className = 'export-group';
    group.innerHTML = `
      <button class="btn btn-export" id="exportCSV" aria-label="Export as CSV">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        CSV
      </button>
      <button class="btn btn-export" id="exportPDF" aria-label="Export as PDF">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        PDF
      </button>
    `;

    // Insert between title and Modify Inputs button
    const backBtn = resultsHeader.querySelector('[data-back]');
    if (backBtn) {
      resultsHeader.insertBefore(group, backBtn);
    } else {
      resultsHeader.appendChild(group);
    }

    document.getElementById('exportCSV').addEventListener('click', exportCSV);
    document.getElementById('exportPDF').addEventListener('click', exportPDF);
  }

  /* ---- Initialize ---- */
  function init() {
    injectExportButtons();

    // Also re-inject after calculate (in case results panel is rebuilt)
    const calcBtn = document.getElementById('calcBtn');
    if (calcBtn) {
      calcBtn.addEventListener('click', () => {
        setTimeout(injectExportButtons, 200);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
