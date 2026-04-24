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
    // Support both legacy single-row header (.header-inner) and new 2-tier header (.header-top-right)
    const header = document.querySelector('.header-inner') || document.querySelector('.header-top-right');
    if (!header) return;

    /* Desktop toggle in header bar */
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
        Mind Map
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

    /* Mobile floating action button — visible only below 600px
       where .header-inner is hidden by the site's responsive CSS */
    const fab = document.createElement('button');
    fab.className = 'mindmap-fab';
    fab.setAttribute('aria-label', 'Open Mind Map');
    fab.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="2.5"/>
        <line x1="12" y1="2" x2="12" y2="6"/>
        <line x1="12" y1="18" x2="12" y2="22"/>
        <line x1="2" y1="12" x2="6" y2="12"/>
        <line x1="18" y1="12" x2="22" y2="12"/>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
      </svg>
      <span>Mind Map</span>
    `;
    fab.addEventListener('click', () => toggleMindmap());
    document.body.appendChild(fab);
  }

  /* ---- Toggle State ---- */
  function toggleMindmap() {
    isOpen = !isOpen;
    const toggle = document.getElementById('mindmapToggle');
    if (toggle) {
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-checked', isOpen);
    }

    /* Hide FAB when overlay is open */
    const fab = document.querySelector('.mindmap-fab');
    if (fab) fab.style.display = isOpen ? 'none' : '';

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
      <div class="mindmap-hint">Click a topic to expand · Click again to collapse · Scroll to zoom · Drag to pan</div>
    `;

    document.body.appendChild(overlayEl);

    overlayEl.querySelector('.mindmap-close-btn').addEventListener('click', () => toggleMindmap());

    // ESC key closes
    document.addEventListener('keydown', handleEsc);

    // Reset hierarchy so it starts collapsed each time
    hierRoot = null;

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

  /* ---- Persistent hierarchy root (survives re-draws) ---- */
  let hierRoot = null;

  /**
   * Collapse a node: stash children into _children.
   * Recursive — collapses the entire subtree.
   */
  function collapseNode(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapseNode);
      d.children = null;
    }
  }

  /**
   * Expand a node one level (restore _children → children).
   * Does NOT recurse — only reveals immediate children.
   */
  function expandNode(d) {
    if (d._children) {
      d.children = d._children;
      d._children = null;
    }
  }

  /**
   * Expand a node and ALL its descendants (full subtree reveal).
   */
  function expandAll(d) {
    if (d._children) {
      d.children = d._children;
      d._children = null;
    }
    if (d.children) d.children.forEach(expandAll);
  }

  function drawTree(container, width, height) {
    container.innerHTML = '';

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#cdccca' : '#28251d';
    const linkColor = isDark ? 'rgba(205,204,202,0.2)' : 'rgba(40,37,29,0.15)';
    const bgColor = isDark ? '#171614' : '#f7f6f2';

    /* Build hierarchy once, then reuse across redraws */
    if (!hierRoot) {
      hierRoot = d3.hierarchy(DATA.tree);

      /* Collapse all primary branches by default
         so only the root + top-level topic names are visible */
      if (hierRoot.children) {
        hierRoot.children.forEach(collapseNode);
      }
    }

    const root = hierRoot;

    /* Count visible nodes to size the layout */
    const visible = root.descendants();
    let maxDepth = 0;
    visible.forEach(d => { if (d.depth > maxDepth) maxDepth = d.depth; });

    const isMobile = width < 600;

    /* ----- Horizontal spacing per depth level -----
       Generous spacing keeps branch lines short and clear of text. */
    const depthSpacing = isMobile ? 130 : 200;
    const treeWidth = Math.max(depthSpacing, maxDepth * depthSpacing);

    /* ----- Vertical spacing — scaled per visible node -----
       Each node gets enough vertical room so labels never overlap
       branch lines of neighbouring nodes. */
    const nodeSpacing = isMobile ? 38 : 48;
    const treeHeight = Math.max(height * 0.6, visible.length * nodeSpacing);

    const treeLayout = d3.tree()
      .size([treeHeight, treeWidth])
      .separation((a, b) => {
        /* Give expanded branches more breathing room.
           Collapsed depth-1 nodes stay tight; expanded ones get extra space
           so their children don't crowd neighbouring branch labels. */
        if (a.parent === b.parent) {
          /* siblings — if either has visible children, widen gap */
          const aLeaves = a.children ? a.children.length : 0;
          const bLeaves = b.children ? b.children.length : 0;
          if (aLeaves > 0 || bLeaves > 0) return 1.8;
          return 1;
        }
        return 2;
      });
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
      .scaleExtent([0.2, 5])
      .on('zoom', (event) => g.attr('transform', event.transform));
    svg.call(zoom);

    /* ----- Centre & fit the tree into the viewport -----
       Compute the bounding box of all visible nodes and scale/translate
       so the entire tree is visible without clipping. */
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    visible.forEach(d => {
      if (d.x < minX) minX = d.x;
      if (d.x > maxX) maxX = d.x;
      if (d.y < minY) minY = d.y;
      if (d.y > maxY) maxY = d.y;
    });
    const treeBoundsW = (maxY - minY) + 350;   /* extra for text labels */
    const treeBoundsH = (maxX - minX) + 80;
    const scaleToFit = Math.min(
      (width - 40) / treeBoundsW,
      (height - 40) / treeBoundsH,
      1.0   /* never zoom in past 100% */
    );
    const initScale = Math.max(0.35, scaleToFit);
    const cx = (minY + maxY) / 2;
    const cy = (minX + maxX) / 2;
    const offsetX = width / 2 - cx * initScale;
    const offsetY = height / 2 - cy * initScale;
    svg.call(zoom.transform, d3.zoomIdentity.translate(offsetX, offsetY).scale(initScale));

    // Links (only between visible nodes)
    g.selectAll('.mm-link')
      .data(root.links())
      .join('path')
      .attr('class', 'mm-link')
      .attr('fill', 'none')
      .attr('stroke', linkColor)
      .attr('stroke-width', d => Math.max(1.5, 4 - d.source.depth))
      .attr('d', d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x)
      );

    // Nodes
    const node = g.selectAll('.mm-node')
      .data(visible)
      .join('g')
      .attr('class', 'mm-node')
      .attr('transform', d => `translate(${d.y},${d.x})`)
      .style('cursor', d => d.children || d._children ? 'pointer' : 'default');

    // Node circles — collapsed nodes show a "+" ring
    node.append('circle')
      .attr('r', d => d.depth === 0 ? 10 : (d.depth === 1 ? 7 : (d.children || d._children ? 5 : 3.5)))
      .attr('fill', d => {
        if (d.depth === 0) return '#01696f';
        const branch = d.ancestors().reverse()[1];
        const idx = branch ? branch.parent.children.indexOf(branch) : 0;
        return BRANCH_COLORS[idx % BRANCH_COLORS.length];
      })
      .attr('stroke', d => d._children ? (isDark ? '#cdccca' : '#28251d') : bgColor)
      .attr('stroke-width', d => d._children ? 2.5 : 2)
      .attr('stroke-dasharray', d => d._children ? '3,2' : 'none');

    // "+" indicator on collapsed nodes that have hidden children
    node.filter(d => d._children)
      .append('text')
      .attr('dy', 4.5)
      .attr('text-anchor', 'middle')
      .attr('fill', bgColor)
      .attr('font-size', d => d.depth === 1 ? '11px' : '9px')
      .attr('font-weight', '700')
      .attr('font-family', "'DM Sans', system-ui, sans-serif")
      .attr('pointer-events', 'none')
      .text('+');

    /* ---- Node labels ----
       All labels are placed to the RIGHT of their node circle
       so text never sits on top of branch lines leading to siblings. */
    node.append('text')
      .attr('dy', d => d.depth === 0 ? -18 : 4.5)
      .attr('x', d => {
        if (d.depth === 0) return 0;
        return 14;  /* always right of the node */
      })
      .attr('text-anchor', d => d.depth === 0 ? 'middle' : 'start')
      .attr('fill', d => {
        if (d.depth === 0) return '#01696f';
        if (d.depth === 1) {
          const branch = d.ancestors().reverse()[1];
          const idx = branch ? branch.parent.children.indexOf(branch) : 0;
          return BRANCH_COLORS[idx % BRANCH_COLORS.length];
        }
        return textColor;
      })
      .attr('font-size', d => d.depth === 0 ? '18px' : (d.depth === 1 ? '15px' : '13px'))
      .attr('font-weight', d => {
        if (d.depth === 0) return '700';
        /* Only the expanded (selected) branch is bold; collapsed siblings stay regular */
        if (d.depth === 1 && d.children) return '700';
        return '400';
      })
      .attr('font-family', "'DM Sans', 'Inter', system-ui, sans-serif")
      .text(d => d.data.name);

    /* ---- Tooltip on hover (leaf concepts with desc field) ---- */
    const tooltip = d3.select(container.parentElement)
      .selectAll('.mm-tooltip')
      .data([0])
      .join('div')
      .attr('class', 'mm-tooltip')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('background', isDark ? '#1C1B19' : '#fff')
      .style('color', isDark ? '#cdccca' : '#28251d')
      .style('border', `1px solid ${isDark ? '#393836' : '#D4D1CA'}`)
      .style('border-radius', '8px')
      .style('padding', '10px 14px')
      .style('font-family', "'DM Sans', 'Inter', system-ui, sans-serif")
      .style('font-size', '12px')
      .style('line-height', '1.5')
      .style('max-width', '280px')
      .style('box-shadow', isDark ? '0 4px 16px rgba(0,0,0,0.5)' : '0 4px 16px rgba(0,0,0,0.1)')
      .style('z-index', '10')
      .style('transition', 'opacity 0.15s ease');

    node.on('mouseenter', function(event, d) {
      if (!d.data.desc) return;
      const overlayRect = container.parentElement.getBoundingClientRect();
      tooltip
        .html(`<strong style="font-size:13px;display:block;margin-bottom:4px;color:${isDark ? '#4F98A3' : '#01696f'}">${escapeHtml(d.data.name)}</strong>${escapeHtml(d.data.desc)}`)
        .style('opacity', 1)
        .style('left', (event.clientX - overlayRect.left + 16) + 'px')
        .style('top', (event.clientY - overlayRect.top - 10) + 'px');
    })
    .on('mousemove', function(event) {
      const overlayRect = container.parentElement.getBoundingClientRect();
      tooltip
        .style('left', (event.clientX - overlayRect.left + 16) + 'px')
        .style('top', (event.clientY - overlayRect.top - 10) + 'px');
    })
    .on('mouseleave', function() {
      tooltip.style('opacity', 0);
    });

    // Click behavior — accordion for primary branches
    node.on('click', (event, d) => {
      event.stopPropagation();

      /* Accordion at depth 1: expanding one collapses siblings */
      if (d.depth === 1) {
        const isExpanding = !!d._children;
        if (isExpanding) {
          /* Collapse all sibling branches first */
          if (d.parent && d.parent.children) {
            d.parent.children.forEach(sibling => {
              if (sibling !== d) collapseNode(sibling);
            });
          }
          /* Expand this branch fully */
          expandAll(d);
        } else if (d.children) {
          /* Collapse this branch */
          collapseNode(d);
        }
      } else {
        /* Deeper nodes: simple toggle */
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else if (d._children) {
          d.children = d._children;
          d._children = null;
        } else {
          return;
        }
      }

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
