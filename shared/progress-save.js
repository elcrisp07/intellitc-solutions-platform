/* ============================================================
   IntelliTC Solutions — Progress Save (localStorage Auto-Draft)
   ============================================================
   Automatically saves all input field values as the user types
   and restores them when returning. Shows a subtle restore
   notification so users know their work was recovered.
   ============================================================ */
(function() {
  'use strict';

  var PREFIX = 'intellitc_draft_';
  var DEBOUNCE_MS = 800;
  var store;
  try { store = window.localStorage; if (!store) return; } catch(e) { return; }

  /* ---- Determine unique key from page path ---- */
  var path = window.location.pathname.replace(/\/index\.html$/, '').replace(/\/$/, '');
  var segments = path.split('/').filter(Boolean);
  var calcId = segments[segments.length - 1] || 'home';
  var STORAGE_KEY = PREFIX + calcId;

  /* ---- Collect all saveable fields ---- */
  function getFields() {
    return document.querySelectorAll('#inputPanel input[type="text"], #inputPanel input[type="number"], #inputPanel select');
  }

  /* ---- Save current state ---- */
  function saveDraft() {
    var fields = getFields();
    if (!fields.length) return;
    var data = {};
    fields.forEach(function(f) {
      var id = f.id || f.name;
      if (!id) return;
      data[id] = f.value;
    });
    data.__ts = Date.now();
    try { store.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
  }

  /* ---- Restore saved state ---- */
  function restoreDraft() {
    var raw;
    try { raw = store.getItem(STORAGE_KEY); } catch(e) { return false; }
    if (!raw) return false;

    var data;
    try { data = JSON.parse(raw); } catch(e) { return false; }
    if (!data || !data.__ts) return false;

    // Only restore if saved within the last 45 days
    var age = Date.now() - data.__ts;
    if (age > 45 * 24 * 60 * 60 * 1000) {
      try { store.removeItem(STORAGE_KEY); } catch(e) {}
      return false;
    }

    var fields = getFields();
    var restoredCount = 0;
    fields.forEach(function(f) {
      var id = f.id || f.name;
      if (!id || data[id] === undefined) return;
      // Don't overwrite if user already changed it from the default
      f.value = data[id];
      restoredCount++;
      // Trigger input event so formatters and validation pick it up
      try { f.dispatchEvent(new Event('input', { bubbles: true })); } catch(e) {}
    });

    return restoredCount > 0;
  }

  /* ---- Show save-info caption under the panel title ---- */
  function showSaveCaption() {
    var panel = document.getElementById('inputPanel');
    if (!panel || document.getElementById('progressSaveCaption')) return;
    var caption = document.createElement('div');
    caption.id = 'progressSaveCaption';
    caption.className = 'progress-save-caption';
    caption.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Progress is saved locally on this device for 45 days';
    var title = panel.querySelector('.panel-title');
    if (title) {
      title.parentNode.insertBefore(caption, title.nextSibling);
    } else {
      panel.insertBefore(caption, panel.firstChild);
    }
  }

  /* ---- Show restore notification ---- */
  function showRestoreNotice() {
    var notice = document.createElement('div');
    notice.className = 'progress-restore-notice';
    notice.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg><span>Previous inputs restored</span><button class="progress-restore-dismiss" aria-label="Dismiss">&times;</button>';

    var panel = document.getElementById('inputPanel');
    if (panel) {
      var title = panel.querySelector('.panel-title');
      if (title) {
        title.parentNode.insertBefore(notice, title.nextSibling);
      } else {
        panel.insertBefore(notice, panel.firstChild);
      }
    } else {
      document.body.appendChild(notice);
    }

    // Animate in
    requestAnimationFrame(function() {
      notice.classList.add('visible');
    });

    // Dismiss button
    notice.querySelector('.progress-restore-dismiss').addEventListener('click', function() {
      notice.classList.remove('visible');
      setTimeout(function() { notice.remove(); }, 300);
    });

    // Auto-dismiss after 5 seconds
    setTimeout(function() {
      if (notice.parentNode) {
        notice.classList.remove('visible');
        setTimeout(function() { if (notice.parentNode) notice.remove(); }, 300);
      }
    }, 5000);
  }

  /* ---- Clear draft when results are shown (calculation complete) ---- */
  function clearOnCalculate() {
    var calcBtn = document.getElementById('calcBtn');
    if (calcBtn) {
      calcBtn.addEventListener('click', function() {
        // Clear after a brief delay to let the calculation run
        setTimeout(function() {
          try { store.removeItem(STORAGE_KEY); } catch(e) {}
        }, 500);
      });
    }
  }

  /* ---- Debounced save on input ---- */
  var saveTimer;
  function debouncedSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveDraft, DEBOUNCE_MS);
  }

  /* ---- Initialize ---- */
  function init() {
    // Show the proactive save caption
    showSaveCaption();

    // Restore any saved draft
    var didRestore = restoreDraft();
    if (didRestore) {
      showRestoreNotice();
    }

    // Listen for changes on all input fields
    var fields = getFields();
    fields.forEach(function(f) {
      f.addEventListener('input', debouncedSave);
      f.addEventListener('change', debouncedSave);
    });

    // Clear draft on successful calculation
    clearOnCalculate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
