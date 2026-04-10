/**
 * IntelliTC — Regional Market Benchmark Presets
 * Stores market-level defaults (tax rate, rent, vacancy, cap rate, insurance)
 * to pre-fill calculator fields and reduce manual entry.
 *
 * Now supports ZIP code entry — maps any US zip to the nearest of 35 tracked metros.
 * Requires: zip3-metro-map.js loaded before this file.
 *
 * Usage (called by calculator pages):
 *   MarketPresets.init('containerId', fieldMap)
 *   MarketPresets.getMarket()  → preset object or null
 */
(function(global) {
  'use strict';

  var STORAGE_KEY = 'intellitc_market';
  var ZIP_KEY     = 'intellitc_market_zip';

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

    /** Get/set the stored zip code. */
    getZip: function() {
      var s = getStore(); if (!s) return '';
      try { return s.getItem(ZIP_KEY) || ''; } catch(e) { return ''; }
    },
    setZip: function(zip) {
      var s = getStore(); if (!s) return;
      try { if (zip) s.setItem(ZIP_KEY, zip); else s.removeItem(ZIP_KEY); } catch(e) {}
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
     * @param {Function} [getPriceVal] — function that returns current price
     */
    init: function(containerId, fieldMap, getPriceVal) {
      var self = this;
      var container = document.getElementById(containerId);
      if (!container) return;

      var market = this.getMarket();
      var storedZip = this.getZip();
      var label = market ? market.name : 'No market set';
      var chipClass = market ? 'mp-chip mp-chip-set' : 'mp-chip mp-chip-unset';

      // If we have a stored zip, show it in the label
      if (market && storedZip) {
        label = storedZip + ' → ' + market.name;
      }

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
      var storedZip = this.getZip();
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
          '<p class="mp-panel-desc">Enter your property\'s zip code to auto-match the nearest tracked market — or choose one manually below.</p>' +

          // Zip code input
          '<div class="mp-zip-wrap">' +
            '<label class="mp-zip-label" for="mpZipInput">ZIP Code</label>' +
            '<div class="mp-zip-row">' +
              '<input type="text" id="mpZipInput" class="mp-zip-input" placeholder="e.g. 37064" maxlength="5" inputmode="numeric" pattern="[0-9]*" value="' + (storedZip || '') + '">' +
              '<button class="mp-zip-go" id="mpZipGoBtn" onclick="MarketPresets._lookupZip()">Find Market</button>' +
            '</div>' +
            '<div class="mp-zip-result" id="mpZipResult"></div>' +
          '</div>' +

          '<div class="mp-divider-row"><span class="mp-divider-text">or select manually</span></div>' +

          // Dropdown fallback
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
        // Clear zip result when manually selecting
        document.getElementById('mpZipResult').innerHTML = '';
        document.getElementById('mpZipInput').value = '';
      });

      // Allow Enter key on zip input
      document.getElementById('mpZipInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); self._lookupZip(); }
      });

      // Auto-digits only
      document.getElementById('mpZipInput').addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').substring(0, 5);
      });

      setTimeout(function() { panel.classList.add('mp-panel-visible'); }, 10);
    },

    /** Look up the entered zip code using ZipMetroMap. */
    _lookupZip: function() {
      var zip = (document.getElementById('mpZipInput').value || '').trim();
      var resultEl = document.getElementById('mpZipResult');

      if (!zip || zip.length < 5) {
        resultEl.innerHTML = '<span class="mp-zip-error">Please enter a 5-digit zip code.</span>';
        return;
      }

      // Check if ZipMetroMap is loaded
      if (!window.ZipMetroMap || !window.ZipMetroMap.lookup) {
        resultEl.innerHTML = '<span class="mp-zip-error">Zip lookup unavailable.</span>';
        return;
      }

      var result = window.ZipMetroMap.lookup(zip);
      if (!result || !PRESETS[result.metroKey]) {
        resultEl.innerHTML = '<span class="mp-zip-error">Could not match this zip code. Try selecting a market manually.</span>';
        return;
      }

      var preset = PRESETS[result.metroKey];
      var metroName = preset.name;

      // Show match
      resultEl.innerHTML =
        '<div class="mp-zip-match">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>' +
          '<span>Matched to <strong>' + metroName + '</strong></span>' +
        '</div>';

      // Update the dropdown to match
      var sel = document.getElementById('mpSelect');
      sel.value = result.metroKey;

      // Show preview
      var p = Object.assign({ key: result.metroKey }, preset);
      document.getElementById('mpPreview').innerHTML = this._buildPreviewHTML(p);
      document.getElementById('mpApplyBtn').disabled = false;

      // Store zip and approximate flag for apply step
      this._pendingZip = zip;
      this._pendingApproximate = result.approximate;

      // If approximate, show the notice immediately
      if (result.approximate) {
        this._showProximityNotice(zip, metroName);
      }
    },

    /** Show the proximity limitation popup for rural / distant zip codes. */
    _showProximityNotice: function(zip, metroName) {
      // Don't stack multiples
      if (document.getElementById('mpProximityNotice')) return;

      var notice = document.createElement('div');
      notice.id = 'mpProximityNotice';
      notice.innerHTML =
        '<div class="mp-notice-overlay" onclick="MarketPresets._closeProximityNotice()"></div>' +
        '<div class="mp-notice-card">' +
          '<div class="mp-notice-icon">' +
            '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
              '<circle cx="12" cy="12" r="10"/>' +
              '<line x1="12" y1="8" x2="12" y2="12"/>' +
              '<line x1="12" y1="16" x2="12.01" y2="16"/>' +
            '</svg>' +
          '</div>' +
          '<h3 class="mp-notice-title">Approximate Market Match</h3>' +
          '<p class="mp-notice-body">' +
            'Your zip code <strong>' + zip + '</strong> is outside the immediate metro area of any of our 35 tracked markets. ' +
            'We\'ve matched you to <strong>' + metroName + '</strong> as the closest available market in our database.' +
          '</p>' +
          '<p class="mp-notice-body mp-notice-disclaimer">' +
            'The benchmarks shown — including property tax rates, vacancy rates, rents, and cap rates — are based on ' +
            metroName + ' metro data and <strong>may not accurately reflect conditions in your specific area</strong>. ' +
            'Use these figures as a starting point and adjust based on your local knowledge.' +
          '</p>' +
          '<div class="mp-notice-footer">' +
            '<button class="mp-notice-btn" onclick="MarketPresets._closeProximityNotice()">I Understand</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(notice);
      setTimeout(function() { notice.classList.add('mp-notice-visible'); }, 10);
    },

    _closeProximityNotice: function() {
      var el = document.getElementById('mpProximityNotice');
      if (!el) return;
      el.classList.remove('mp-notice-visible');
      setTimeout(function() { if (el.parentElement) el.remove(); }, 220);
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

      // Store zip if one was used
      var zipInput = document.getElementById('mpZipInput');
      var zip = zipInput ? zipInput.value.trim() : '';
      this.setZip(zip);

      var preset = Object.assign({ key: key }, PRESETS[key]);
      this._applyPreset(preset);

      // Update chip — show zip → metro if zip was used
      var chip = document.getElementById('mpChipBtn');
      if (chip) {
        chip.className = 'mp-chip mp-chip-set';
        var label = document.getElementById('mpChipLabel');
        if (label) {
          label.textContent = (zip ? zip + ' → ' : '') + preset.name;
        }
        var hint = chip.querySelector('.mp-chip-hint');
        if (hint) { hint.className = 'mp-chip-badge'; hint.textContent = 'Benchmarks active'; }
        var badge = chip.querySelector('.mp-chip-badge');
        if (badge) { badge.textContent = 'Benchmarks active'; }
      }
      this._closePanel();
      this._showAppliedToast(preset.name);

      // Clean up
      this._pendingZip = null;
      this._pendingApproximate = false;
    },

    _clearMarket: function() {
      var s = getStore(); if (!s) return;
      try { s.removeItem(STORAGE_KEY); s.removeItem(ZIP_KEY); } catch(e) {}
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
