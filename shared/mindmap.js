/* ============================================================
   IntelliTC Solutions — Mind Map Module
   ============================================================
   Usage: Define window.MINDMAP_DATA before this script loads:

   window.MINDMAP_DATA = {
     title: "Calculator Name",
     tree: {
       name: "Root Concept",
       children: [
         { name: "Branch 1", children: [
           { name: "Leaf A" },
           { name: "Leaf B" }
         ]},
         ...
       ]
     }
   };

   Renders an interactive, zoomable mind map using D3.js.
   Fully client-side — no external dependencies beyond D3.
   ============================================================ */

(function () {
  'use strict';

  const DATA = window.MINDMAP_DATA;
  if (!DATA || !DATA.tree) return;

  let overlayEl = null;
  let isOpen = false;

  /* ---- Color palette for branches ---- */
  const BRANCH_COLORS = [
    '#01696f', '#D19900', '#a13544', '#006494',
    '#7a39bb', '#437a22', '#964219', '#da7101'
  ];

  /* ---- Build Toggle (same pattern as Learn Mode) ---- */
  function buildToggle() {
    const header = document.querySelector('.header-inner');
    if (!header) return;

    const wrap = document.createElement('div');
    wrap.className = 'mindmap-toggle-wrap';
    wrap.innerHTML = `
      <label class="mindmap-toggle-label" for="mindmapToggle">
        <svg class="mindmap-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <line x1="12" y1="1" x2="12" y2="5"/>
          <line x1="12" y1="19" x2="12" y2="23"/>
          <line x1="1" y1="12" x2="5" y2="12"/>
          <line x1="19" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/>
          <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
          <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/>
          <line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
        </svg>
        Map
      </label>
      <div class="mindmap-toggle" id="mindmapToggle" role="switch" aria-checked="false" aria-label="Toggle Mind Map" tabindex="0"></div>
    `;

    /* Insert before the Learn toggle if present, otherwise before theme toggle */
    const learnWrap = header.querySelector('.learn-toggle-wrap');
    const themeBtn = header.querySelector('[data-theme-toggle]');
    if (learnWrap) {
      header.insertBefore(wrap, learnWrap);
    } else if (themeBtn) {
      header.insertBefore(wrap, themeBtn);
    } else {
      header.appendChild(wrap);
    }

    const toggle = document.getElementById('mindmapToggle');
    toggle.addEventListener('click', () => toggleMindmap());
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMindmap(); }
    });
  }

  /* ---- Toggle State ---- */
  function toggleMindmap() {
    isOpen = !isOpen;
    const toggle = document.getElementById('mindmapToggle');
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-checked', isOpen);

    if (isOpen) {
      showOverlay();
    } else {
      hideOverlay();
    }
  }

  /* ---- Show Overlay ---- */
  function showOverlay() {
    if (overlayEl) {
      overlayEl.classList.add('visible');
      return;
    }

    overlayEl = document.createElement('div');
    overlayEl.className = 'mindmap-overlay visible';
    overlayEl.innerHTML = `
      <div class="mindmap-header">
        <div class="mindmap-header-left">
          <div>
            <div class="mindmap-header-title">${escapeHtml(DATA.title || 'Mind Map')}</div>
            <div class="mindmap-header-subtitle">Concept Map — click nodes to expand/collapse</div>
          </div>
        </div>
        <button class="mindmap-close-btn" aria-label="Close mind map">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Close
        </button>
      </div>
      <div class="mindmap-container" id="mindmapContainer"></div>
      <div class="mindmap-hint">Scroll to zoom · Drag to pan · Click nodes to expand/collapse</div>
    `;

    document.body.appendChild(overlayEl);

    overlayEl.querySelector('.mindmap-close-btn').addEventListener('click', () => toggleMindmap());

    // ESC key closes
    document.addEventListener('keydown', handleEsc);

    // Render the mind map with D3
    setTimeout(() => renderD3MindMap(), 50);
  }

  /* ---- Hide Overlay ---- */
  function hideOverlay() {
    if (overlayEl) overlayEl.classList.remove('visible');
    document.removeEventListener('keydown', handleEsc);
  }

  function handleEsc(e) {
    if (e.key === 'Escape' && isOpen) {
      toggleMindmap();
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ============================================================
     D3-based Mind Map Renderer (no external deps beyond D3)
     ============================================================ */
  function renderD3MindMap() {
    const container = document.getElementById('mindmapContainer');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Load D3 from CDN if not already loaded
    if (typeof d3 === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js';
      script.onload = () => drawTree(container, width, height);
      document.head.appendChild(script);
    } else {
      drawTree(container, width, height);
    }
  }

  function drawTree(container, width, height) {
    container.innerHTML = '';

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#cdccca' : '#28251d';
    const linkColor = isDark ? 'rgba(205,204,202,0.2)' : 'rgba(40,37,29,0.15)';
    const bgColor = isDark ? '#171614' : '#f7f6f2';

    // Create hierarchical data
    const root = d3.hierarchy(DATA.tree);

    // Count total depth to size the layout
    let maxDepth = 0;
    root.each(d => { if (d.depth > maxDepth) maxDepth = d.depth; });

    const treeWidth = Math.max(width - 200, maxDepth * 220);
    const treeHeight = Math.max(height - 100, root.descendants().length * 22);

    const treeLayout = d3.tree().size([treeHeight, treeWidth]);
    treeLayout(root);

    // SVG
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background', bgColor);

    // Zoom behavior
    const g = svg.append('g');
    const zoom = d3.zoom()
      .scaleExtent([0.2, 4])
      .on('zoom', (event) => g.attr('transform', event.transform));
    svg.call(zoom);

    // Center the tree initially
    const initialX = 100;
    const initialY = height / 2 - treeHeight / 2;
    svg.call(zoom.transform, d3.zoomIdentity.translate(initialX, initialY).scale(0.9));

    // Links
    g.selectAll('.mm-link')
      .data(root.links())
      .join('path')
      .attr('class', 'mm-link')
      .attr('fill', 'none')
      .attr('stroke', linkColor)
      .attr('stroke-width', d => Math.max(1, 4 - d.source.depth))
      .attr('d', d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x)
      );

    // Nodes
    const node = g.selectAll('.mm-node')
      .data(root.descendants())
      .join('g')
      .attr('class', 'mm-node')
      .attr('transform', d => `translate(${d.y},${d.x})`)
      .style('cursor', d => d.children || d._children ? 'pointer' : 'default');

    // Node circles
    node.append('circle')
      .attr('r', d => d.depth === 0 ? 8 : (d.children ? 5 : 3.5))
      .attr('fill', d => {
        if (d.depth === 0) return '#01696f';
        // Color by top-level branch
        const branch = d.ancestors().reverse()[1];
        const idx = branch ? branch.parent.children.indexOf(branch) : 0;
        return BRANCH_COLORS[idx % BRANCH_COLORS.length];
      })
      .attr('stroke', bgColor)
      .attr('stroke-width', 2);

    // Node labels
    node.append('text')
      .attr('dy', d => d.depth === 0 ? -14 : 4)
      .attr('x', d => {
        if (d.depth === 0) return 0;
        return d.children ? -10 : 10;
      })
      .attr('text-anchor', d => {
        if (d.depth === 0) return 'middle';
        return d.children ? 'end' : 'start';
      })
      .attr('fill', d => {
        if (d.depth === 0) return '#01696f';
        return textColor;
      })
      .attr('font-size', d => d.depth === 0 ? '16px' : (d.depth === 1 ? '13px' : '11.5px'))
      .attr('font-weight', d => d.depth <= 1 ? '600' : '400')
      .attr('font-family', "'DM Sans', 'Inter', system-ui, sans-serif")
      .text(d => d.data.name);

    // Click to collapse/expand
    node.on('click', (event, d) => {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else if (d._children) {
        d.children = d._children;
        d._children = null;
      } else {
        return;
      }
      // Re-render
      drawTree(container, width, height);
    });

    // Observe theme changes to re-render
    if (!container._themeObserver) {
      container._themeObserver = new MutationObserver(() => {
        if (overlayEl && overlayEl.classList.contains('visible')) {
          drawTree(container, container.clientWidth, container.clientHeight);
        }
      });
      container._themeObserver.observe(document.documentElement, {
        attributes: true, attributeFilter: ['data-theme']
      });
    }
  }

  /* ---- Initialize ---- */
  function init() {
    buildToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
