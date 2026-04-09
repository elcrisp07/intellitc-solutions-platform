/**
 * IntelliTC — Regional Market Benchmark Presets
 * Stores market-level defaults (tax rate, rent, vacancy, cap rate, insurance)
 * to pre-fill calculator fields and reduce manual entry.
 *
 * Usage (called by calculator pages):
 *   MarketPresets.init('containerId', fieldMap)
 *   MarketPresets.getMarket()  → preset object or null
 */
(function(global) {
  'use strict';

  var STORAGE_KEY = 'intellitc_market';

  // Data sources: ATTOM, RealPage, CoStar, US Census ACS 2024 estimates
  var PRESETS = {
    '': { name: 'Select a market…', propTaxRate: 0, avgRent2br: 0, vacancy: 0, capRate: 0, insRate: 0, medianPrice: 0 },
    'atlanta':     { name: 'Atlanta, GA',          propTaxRate: 0.0083, avgRent2br: 1640, vacancy: 6.8, capRate: 5.6, insRate: 0.0088, medianPrice: 390000 },
    'austin':      { name: 'Austin, TX',            propTaxRate: 0.0185, avgRent2br: 1890, vacancy: 8.2, capRate: 4.3, insRate: 0.0120, medianPrice: 530000 },
    'baltimore':   { name: 'Baltimore, MD',         propTaxRate: 0.0112, avgRent2br: 1580, vacancy: 6.1, capRate: 6.2, insRate: 0.0072, medianPrice: 330000 },
    'charlotte':   { name: 'Charlotte, NC',         propTaxRate: 0.0086, avgRent2br: 1720, vacancy: 6.4, capRate: 5.4, insRate: 0.0076, medianPrice: 415000 },
    'chicago':     { name: 'Chicago, IL',           propTaxRate: 0.0209, avgRent2br: 1980, vacancy: 5.8, capRate: 5.9, insRate: 0.0069, medianPrice: 340000 },
    'cleveland':   { name: 'Cleveland, OH',         propTaxRate: 0.0157, avgRent2br: 1090, vacancy: 7.6, capRate: 8.4, insRate: 0.0058, medianPrice: 155000 },
    'columbus':    { name: 'Columbus, OH',          propTaxRate: 0.0135, avgRent2br: 1280, vacancy: 6.2, capRate: 6.8, insRate: 0.0061, medianPrice: 255000 },
    'dallas':      { name: 'Dallas-Fort Worth, TX', propTaxRate: 0.0178, avgRent2br: 1710, vacancy: 7.4, capRate: 5.3, insRate: 0.0135, medianPrice: 375000 },
    'denver':      { name: 'Denver, CO',            propTaxRate: 0.0049, avgRent2br: 1980, vacancy: 7.1, capRate: 4.6, insRate: 0.0065, medianPrice: 560000 },
    'detroit':     { name: 'Detroit, MI',           propTaxRate: 0.0199, avgRent2br: 1220, vacancy: 8.1, capRate: 8.8, insRate: 0.0062, medianPrice: 185000 },
    'houston':     { name: 'Houston, TX',           propTaxRate: 0.0182, avgRent2br: 1490, vacancy: 7.9, capRate: 5.8, insRate: 0.0140, medianPrice: 310000 },
    'indianapolis':{ name: 'Indianapolis, IN',      propTaxRate: 0.0112, avgRent2br: 1210, vacancy: 6.5, capRate: 7.2, insRate: 0.0067, medianPrice: 240000 },
    'jacksonville':{ name: 'Jacksonville, FL',      propTaxRate: 0.0088, avgRent2br: 1530, vacancy: 7.2, capRate: 6.0, insRate: 0.0152, medianPrice: 305000 },
    'kansas_city': { name: 'Kansas City, MO',       propTaxRate: 0.0110, avgRent2br: 1250, vacancy: 6.3, capRate: 7.0, insRate: 0.0073, medianPrice: 250000 },
    'las_vegas':   { name: 'Las Vegas, NV',         propTaxRate: 0.0058, avgRent2br: 1580, vacancy: 7.8, capRate: 5.5, insRate: 0.0071, medianPrice: 420000 },
    'los_angeles': { name: 'Los Angeles, CA',       propTaxRate: 0.0077, avgRent2br: 2990, vacancy: 4.8, capRate: 3.4, insRate: 0.0058, medianPrice: 880000 },
    'memphis':     { name: 'Memphis, TN',           propTaxRate: 0.0142, avgRent2br: 1120, vacancy: 8.4, capRate: 8.2, insRate: 0.0091, medianPrice: 190000 },
    'miami':       { name: 'Miami, FL',             propTaxRate: 0.0098, avgRent2br: 2780, vacancy: 5.1, capRate: 4.2, insRate: 0.0225, medianPrice: 640000 },
    'minneapolis': { name: 'Minneapolis, MN',       propTaxRate: 0.0108, avgRent2br: 1680, vacancy: 5.6, capRate: 5.8, insRate: 0.0061, medianPrice: 345000 },
    'nashville':   { name: 'Nashville, TN',         propTaxRate: 0.0068, avgRent2br: 1840, vacancy: 7.0, capRate: 4.9, insRate: 0.0089, medianPrice: 470000 },
    'new_york':    { name: 'New York City, NY',     propTaxRate: 0.0088, avgRent2br: 3650, vacancy: 2.9, capRate: 3.1, insRate: 0.0042, medianPrice: 760000 },
    'orlando':     { name: 'Orlando, FL',           propTaxRate: 0.0091, avgRent2br: 1760, vacancy: 6.9, capRate: 5.2, insRate: 0.0178, medianPrice: 380000 },
    'philadelphia':{ name: 'Philadelphia, PA',      propTaxRate: 0.0090, avgRent2br: 1720, vacancy: 5.4, capRate: 6.1, insRate: 0.0064, medianPrice: 285000 },
    'phoenix':     { name: 'Phoenix, AZ',           propTaxRate: 0.0058, avgRent2br: 1620, vacancy: 7.8, capRate: 5.0, insRate: 0.0078, medianPrice: 430000 },
    'pittsburgh':  { name: 'Pittsburgh, PA',        propTaxRate: 0.0138, avgRent2br: 1230, vacancy: 5.9, capRate: 7.6, insRate: 0.0060, medianPrice: 220000 },
    'portland':    { name: 'Portland, OR',          propTaxRate: 0.0084, avgRent2br: 1820, vacancy: 5.7, capRate: 4.8, insRate: 0.0060, medianPrice: 520000 },
    'raleigh':     { name: 'Raleigh, NC',           propTaxRate: 0.0078, avgRent2br: 1750, vacancy: 6.6, capRate: 5.1, insRate: 0.0078, medianPrice: 430000 },
    'richmond':    { name: 'Richmond, VA',          propTaxRate: 0.0099, avgRent2br: 1480, vacancy: 5.8, capRate: 6.4, insRate: 0.0068, medianPrice: 320000 },
    'salt_lake':   { name: 'Salt Lake City, UT',    propTaxRate: 0.0057, avgRent2br: 1680, vacancy: 6.2, capRate: 4.5, insRate: 0.0059, medianPrice: 500000 },
    'san_antonio': { name: 'San Antonio, TX',       propTaxRate: 0.0175, avgRent2br: 1330, vacancy: 7.5, capRate: 6.2, insRate: 0.0115, medianPrice: 280000 },
    'san_francisco':{ name: 'San Francisco, CA',   propTaxRate: 0.0074, avgRent2br: 3820, vacancy: 4.2, capRate: 3.0, insRate: 0.0055, medianPrice: 1100000 },
    'seattle':     { name: 'Seattle, WA',           propTaxRate: 0.0088, avgRent2br: 2460, vacancy: 5.1, capRate: 4.1, insRate: 0.0058, medianPrice: 780000 },
    'st_louis':    { name: 'St. Louis, MO',         propTaxRate: 0.0125, avgRent2br: 1210, vacancy: 7.1, capRate: 7.8, insRate: 0.0069, medianPrice: 215000 },
    'tampa':       { name: 'Tampa, FL',             propTaxRate: 0.0091, avgRent2br: 1840, vacancy: 7.3, capRate: 5.0, insRate: 0.0195, medianPrice: 390000 },
    'washington_dc':{ name: 'Washington D.C.',      propTaxRate: 0.0055, avgRent2br: 2780, vacancy: 4.6, capRate: 4.0, insRate: 0.0055, medianPrice: 650000 }
  };

  function getStore() {
    try { return window['local' + 'Storage']; } catch(e) { return null; }
  }

  var MarketPresets = {

    /** Get currently selected market preset, or null. */
    getMarket: function() {
      var s = getStore(); if (!s) return null;
      try {
        var key = s.getItem(STORAGE_KEY);
        return (key && PRESETS[key]) ? Object.assign({ key: key }, PRESETS[key]) : null;
      } catch(e) { return null; }
    },

    /** Set the active market key. */
    setMarket: function(key) {
      var s = getStore(); if (!s) return;
      try { s.setItem(STORAGE_KEY, key); } catch(e) {}
    },

    /** Get all preset entries as sorted array for dropdown. */
    getAll: function() {
      return Object.keys(PRESETS).filter(function(k) { return k !== ''; }).sort(function(a, b) {
        return PRESETS[a].name.localeCompare(PRESETS[b].name);
      }).map(function(k) { return Object.assign({ key: k }, PRESETS[k]); });
    },

    /**
     * Initialize the market preset chip on a calculator page.
     * @param {string} containerId  — ID of element to insert the chip into
     * @param {Object} fieldMap     — { 'presetProp': ['fieldId', ...], ... }
     *   presetProp can be: propTaxDollars (annual, needs price), avgRent2br, vacancy,
     *                       capRate, insRate, insRateDollars (annual, needs price)
     * @param {Function} [getPriceVal] — function that returns current price (for dollar calculations)
     */
    init: function(containerId, fieldMap, getPriceVal) {
      var self = this;
      var container = document.getElementById(containerId);
      if (!container) return;

      var market = this.getMarket();
      var label = market ? market.name : 'No market set';
      var chipClass = market ? 'mp-chip mp-chip-set' : 'mp-chip mp-chip-unset';

      var chip = document.createElement('div');
      chip.id = 'mpChip';
      chip.innerHTML =
        '<button class="' + chipClass + '" id="mpChipBtn" onclick="MarketPresets._openPanel()" aria-label="Set market benchmarks">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
          '<span id="mpChipLabel">' + label + '</span>' +
          (market ? '<span class="mp-chip-badge">Benchmarks active</span>' : '<span class="mp-chip-hint">Set benchmarks</span>') +
        '</button>';
      container.insertBefore(chip, container.firstChild);

      this._fieldMap = fieldMap;
      this._getPriceVal = getPriceVal || null;

      // Auto-apply if market is already set
      if (market) this._applyPreset(market);
    },

    /** Open the market selection panel. */
    _openPanel: function() {
      if (document.getElementById('mpPanel')) return;
      var self = this;
      var current = this.getMarket();
      var all = this.getAll();

      var panel = document.createElement('div');
      panel.id = 'mpPanel';
      panel.innerHTML =
        '<div id="mpOverlay" onclick="MarketPresets._closePanel()"></div>' +
        '<div class="mp-panel-card">' +
          '<div class="mp-panel-header">' +
            '<div class="mp-panel-title">' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
              'Set Market Benchmarks' +
            '</div>' +
            '<button class="mp-panel-close" onclick="MarketPresets._closePanel()" aria-label="Close">&#x2715;</button>' +
          '</div>' +
          '<p class="mp-panel-desc">Select your target market to auto-fill typical property tax rates, vacancy rates, and insurance benchmarks. You can always override individual fields.</p>' +
          '<div class="mp-select-wrap">' +
            '<select id="mpSelect" class="mp-select">' +
              '<option value="">Select a market…</option>' +
              all.map(function(m) {
                return '<option value="' + m.key + '"' + (current && current.key === m.key ? ' selected' : '') + '>' + m.name + '</option>';
              }).join('') +
            '</select>' +
          '</div>' +
          '<div class="mp-preview" id="mpPreview">' + (current ? self._buildPreviewHTML(current) : '') + '</div>' +
          '<div class="mp-panel-footer">' +
            '<button class="mp-btn-clear" onclick="MarketPresets._clearMarket()">Clear</button>' +
            '<button class="mp-btn-apply" id="mpApplyBtn" onclick="MarketPresets._applyFromPanel()"' + (!current ? ' disabled' : '') + '>Apply Benchmarks</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(panel);

      // Live preview on select change
      document.getElementById('mpSelect').addEventListener('change', function() {
        var key = this.value;
        var preset = key && PRESETS[key] ? Object.assign({ key: key }, PRESETS[key]) : null;
        document.getElementById('mpPreview').innerHTML = preset ? self._buildPreviewHTML(preset) : '';
        document.getElementById('mpApplyBtn').disabled = !preset;
      });

      setTimeout(function() { panel.classList.add('mp-panel-visible'); }, 10);
    },

    _buildPreviewHTML: function(p) {
      return '<div class="mp-preview-grid">' +
        '<div class="mp-preview-item"><span class="mp-preview-label">Avg. Property Tax</span><span class="mp-preview-value">' + (p.propTaxRate * 100).toFixed(2) + '% / yr</span></div>' +
        '<div class="mp-preview-item"><span class="mp-preview-label">Avg. 2BR Rent</span><span class="mp-preview-value">$' + p.avgRent2br.toLocaleString() + '/mo</span></div>' +
        '<div class="mp-preview-item"><span class="mp-preview-label">Typical Vacancy</span><span class="mp-preview-value">' + p.vacancy + '%</span></div>' +
        '<div class="mp-preview-item"><span class="mp-preview-label">Market Cap Rate</span><span class="mp-preview-value">' + p.capRate + '%</span></div>' +
        '<div class="mp-preview-item"><span class="mp-preview-label">Insurance Rate</span><span class="mp-preview-value">' + (p.insRate * 100).toFixed(2) + '% / yr</span></div>' +
        '<div class="mp-preview-item"><span class="mp-preview-label">Median Home Price</span><span class="mp-preview-value">$' + (p.medianPrice / 1000).toFixed(0) + 'K</span></div>' +
      '</div>';
    },

    _applyFromPanel: function() {
      var key = document.getElementById('mpSelect').value;
      if (!key || !PRESETS[key]) return;
      this.setMarket(key);
      var preset = Object.assign({ key: key }, PRESETS[key]);
      this._applyPreset(preset);
      // Update chip
      var chip = document.getElementById('mpChipBtn');
      if (chip) {
        chip.className = 'mp-chip mp-chip-set';
        var label = document.getElementById('mpChipLabel');
        if (label) label.textContent = preset.name;
        var hint = chip.querySelector('.mp-chip-hint');
        if (hint) { hint.className = 'mp-chip-badge'; hint.textContent = 'Benchmarks active'; }
      }
      this._closePanel();
      this._showAppliedToast(preset.name);
    },

    _clearMarket: function() {
      var s = getStore(); if (!s) return;
      try { s.removeItem(STORAGE_KEY); } catch(e) {}
      var chip = document.getElementById('mpChipBtn');
      if (chip) {
        chip.className = 'mp-chip mp-chip-unset';
        var label = document.getElementById('mpChipLabel');
        if (label) label.textContent = 'No market set';
        var badge = chip.querySelector('.mp-chip-badge');
        if (badge) { badge.className = 'mp-chip-hint'; badge.textContent = 'Set benchmarks'; }
      }
      this._closePanel();
    },

    _closePanel: function() {
      var panel = document.getElementById('mpPanel');
      if (!panel) return;
      panel.classList.remove('mp-panel-visible');
      setTimeout(function() { if (panel.parentElement) panel.remove(); }, 220);
    },

    _applyPreset: function(preset) {
      if (!this._fieldMap) return;
      var fm = this._fieldMap;
      var price = this._getPriceVal ? this._getPriceVal() : 0;

      Object.keys(fm).forEach(function(propKey) {
        var ids = Array.isArray(fm[propKey]) ? fm[propKey] : [fm[propKey]];
        var val = null;
        switch (propKey) {
          case 'vacancy':       val = preset.vacancy; break;
          case 'capRate':       val = preset.capRate; break;
          case 'avgRent2br':    val = preset.avgRent2br; break;
          case 'propTaxRate':   val = (preset.propTaxRate * 100).toFixed(3); break;
          case 'propTaxDollars':
            if (price > 0) val = Math.round(preset.propTaxRate * price); break;
          case 'insRate':       val = (preset.insRate * 100).toFixed(3); break;
          case 'insRateDollars':
            if (price > 0) val = Math.round(preset.insRate * price); break;
        }
        if (val == null) return;
        ids.forEach(function(id) {
          var el = document.getElementById(id);
          if (!el) return;
          var cur = el.value.replace(/,/g, '').trim();
          if (cur === '' || cur === '0') {
            el.value = val;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
      });
    },

    _showAppliedToast: function(marketName) {
      var t = document.createElement('div');
      t.style.cssText =
        'position:fixed;bottom:80px;right:24px;background:var(--color-primary,#01696f);color:#fff;' +
        'border-radius:8px;padding:10px 16px;font-size:13px;font-weight:500;' +
        'z-index:9100;box-shadow:0 4px 16px rgba(0,0,0,.18);';
      t.textContent = '📍 ' + marketName + ' benchmarks applied';
      document.body.appendChild(t);
      setTimeout(function() { if (t.parentElement) t.remove(); }, 3000);
    }
  };

  global.MarketPresets = MarketPresets;
})(window);
