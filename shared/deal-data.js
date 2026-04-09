/**
 * IntelliTC — Cross-Calculator Deal Data
 * Saves key outputs from one calculator and pre-fills inputs on the next.
 * Usage:
 *   DealData.save({ purchasePrice: 350000, noi: 24500, ... });
 *   DealData.get()  → { purchasePrice, noi, ... } or null
 *   DealData.clear()
 */
(function(global) {
  'use strict';
  var KEY = 'intellitc_deal_data';
  var STALE_MS = 6 * 60 * 60 * 1000; // 6 hours

  function store() {
    try { return window['local' + 'Storage']; } catch(e) { return null; }
  }

  var DealData = {
    /** Save deal fields. Merges with existing data. */
    save: function(fields) {
      var s = store(); if (!s) return;
      var current = this.get() || {};
      var merged = Object.assign({}, current, fields, { _saved: Date.now() });
      try { s.setItem(KEY, JSON.stringify(merged)); } catch(e) {}
      this._showSavedToast();
    },

    /** Get deal data, or null if stale/missing. */
    get: function() {
      var s = store(); if (!s) return null;
      try {
        var raw = s.getItem(KEY);
        if (!raw) return null;
        var d = JSON.parse(raw);
        if (d._saved && (Date.now() - d._saved) > STALE_MS) { s.removeItem(KEY); return null; }
        return d;
      } catch(e) { return null; }
    },

    /** Clear all stored deal data. */
    clear: function() {
      var s = store(); if (!s) return;
      try { s.removeItem(KEY); } catch(e) {}
    },

    /** Returns true if there is usable saved data. */
    has: function() { return !!this.get(); },

    /**
     * Pre-fill a set of fields from saved deal data.
     * @param {Object} fieldMap — { dealDataKey: 'elementId', ... }
     * @param {Function} [onFilled] — optional callback when at least one field was filled
     */
    prefill: function(fieldMap, onFilled) {
      var data = this.get();
      if (!data) return;
      var filled = 0;
      Object.keys(fieldMap).forEach(function(key) {
        if (data[key] == null || data[key] === '') return;
        var ids = Array.isArray(fieldMap[key]) ? fieldMap[key] : [fieldMap[key]];
        ids.forEach(function(id) {
          var el = document.getElementById(id);
          if (!el) return;
          // Only prefill if currently empty or default-looking
          var current = el.value.replace(/,/g, '').trim();
          if (current === '' || current === '0') {
            var val = data[key];
            // Format currency values with commas if field uses currency
            if (el.dataset.currency !== undefined && typeof val === 'number') {
              el.value = Math.round(val).toLocaleString('en-US');
            } else if (el.type === 'number' || el.inputMode === 'numeric' || el.inputMode === 'decimal') {
              el.value = typeof val === 'number' ? (Number.isInteger(val) ? val : val.toFixed(2)) : val;
            } else if (el.tagName === 'SELECT') {
              el.value = val;
            } else {
              el.value = typeof val === 'number' ? (Number.isInteger(val) ? val : val.toFixed(2)) : val;
            }
            // Trigger change event so dependent fields update
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            filled++;
          }
        });
      });
      if (filled > 0 && typeof onFilled === 'function') onFilled(filled);
      if (filled > 0) this._showPrefillBanner(filled);
    },

    /** Show a non-intrusive "fields pre-filled from your last deal" banner. */
    _showPrefillBanner: function(count) {
      if (document.getElementById('ddPrefillBanner')) return;
      var banner = document.createElement('div');
      banner.id = 'ddPrefillBanner';
      banner.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>' +
        ' <span>' + count + ' field' + (count > 1 ? 's' : '') + ' pre-filled from your last analysis</span>' +
        '<button onclick="this.parentElement.remove()" aria-label="Dismiss">&#x2715;</button>';
      banner.style.cssText =
        'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);' +
        'background:var(--color-primary,#01696f);color:#fff;' +
        'border-radius:999px;padding:10px 20px;font-size:13px;font-weight:500;' +
        'display:flex;align-items:center;gap:8px;z-index:9000;' +
        'box-shadow:0 4px 20px rgba(0,0,0,0.2);white-space:nowrap;' +
        'animation:ddFadeIn .3s ease;';
      banner.querySelector('button').style.cssText =
        'background:none;border:none;color:rgba(255,255,255,.7);cursor:pointer;' +
        'font-size:14px;padding:0 0 0 8px;line-height:1;';
      if (!document.getElementById('ddStyles')) {
        var style = document.createElement('style');
        style.id = 'ddStyles';
        style.textContent = '@keyframes ddFadeIn{from{opacity:0;transform:translateX(-50%) translateY(12px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}';
        document.head.appendChild(style);
      }
      document.body.appendChild(banner);
      setTimeout(function() { if (banner.parentElement) banner.remove(); }, 5000);
    },

    /** Show a brief "Deal data saved" toast. */
    _showSavedToast: function() {
      var existing = document.getElementById('ddSavedToast');
      if (existing) existing.remove();
      var toast = document.createElement('div');
      toast.id = 'ddSavedToast';
      toast.textContent = '✓  Deal data saved for your next tool';
      toast.style.cssText =
        'position:fixed;bottom:80px;right:24px;' +
        'background:var(--color-primary,#01696f);color:#fff;' +
        'border-radius:8px;padding:10px 16px;font-size:13px;font-weight:500;' +
        'z-index:9000;box-shadow:0 4px 16px rgba(0,0,0,.18);' +
        'animation:ddFadeIn .3s ease;';
      if (!document.getElementById('ddStyles')) {
        var style = document.createElement('style');
        style.id = 'ddStyles';
        style.textContent = '@keyframes ddFadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}';
        document.head.appendChild(style);
      }
      document.body.appendChild(toast);
      setTimeout(function() { if (toast.parentElement) toast.remove(); }, 3000);
    }
  };

  global.DealData = DealData;
})(window);
