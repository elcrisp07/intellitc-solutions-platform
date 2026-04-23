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

  /* ---- Email Capture (Resume Learning Nudges) ----
     Shows a dismissible card offering email reminders. User can:
       1. Enter email → we POST to /api/capture-email
       2. Dismiss → we set a flag in localStorage so we don't ask again
     If user has previously captured, we silently ping /api/track-activity.
  ---- */
  var EMAIL_KEY = 'intellitc_email';
  var EMAIL_DISMISS_KEY = 'intellitc_email_dismiss';
  var EMAIL_RX = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  function calcLabel() {
    var h1 = document.querySelector('.header-inner .logo-text, h1');
    var panelTitle = document.querySelector('.panel-title');
    if (panelTitle && panelTitle.textContent) return panelTitle.textContent.trim().slice(0, 80);
    if (document.title) return document.title.split('|')[0].trim().slice(0, 80);
    return calcId;
  }

  function pingActivity() {
    var savedEmail;
    try { savedEmail = store.getItem(EMAIL_KEY); } catch(e) {}
    if (!savedEmail) return;
    try {
      fetch('/api/track-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: savedEmail, calcId: calcId, calcName: calcLabel() }),
        keepalive: true
      }).catch(function() {});
    } catch(e) {}
  }

  function shouldShowEmailCard() {
    try {
      if (store.getItem(EMAIL_KEY)) return false;
      if (store.getItem(EMAIL_DISMISS_KEY)) return false;
    } catch(e) { return false; }
    return true;
  }

  function showEmailCard() {
    if (!shouldShowEmailCard()) return;
    var panel = document.getElementById('inputPanel');
    if (!panel) return;
    if (document.getElementById('emailCaptureCard')) return;

    var card = document.createElement('div');
    card.id = 'emailCaptureCard';
    card.className = 'email-capture-card';
    card.innerHTML = '' +
      '<button class="email-capture-close" aria-label="Dismiss">&times;</button>' +
      '<div class="email-capture-icon">\u2709</div>' +
      '<div class="email-capture-body">' +
        '<div class="email-capture-title">Want a reminder to finish this?</div>' +
        '<div class="email-capture-desc">Optional. We\'ll email you one link to pick up where you left off. No marketing, no account required.</div>' +
        '<form class="email-capture-form" novalidate>' +
          '<input type="email" class="email-capture-input" placeholder="your@email.com" autocomplete="email" required>' +
          '<button type="submit" class="email-capture-submit">Send me a reminder</button>' +
        '</form>' +
        '<div class="email-capture-status" role="status" aria-live="polite"></div>' +
      '</div>';

    // Insert at the top of the input panel (above first child, below any caption injected there)
    var caption = document.getElementById('progressSaveCaption');
    try {
      if (caption && caption.parentNode && caption.parentNode.contains(caption)) {
        caption.parentNode.insertBefore(card, caption.nextSibling);
      } else {
        panel.insertBefore(card, panel.firstChild);
      }
    } catch (e) {
      // Fallback: just prepend to the panel
      if (panel.firstChild) panel.insertBefore(card, panel.firstChild);
      else panel.appendChild(card);
    }

    var input = card.querySelector('.email-capture-input');
    var submit = card.querySelector('.email-capture-submit');
    var status = card.querySelector('.email-capture-status');
    var form = card.querySelector('.email-capture-form');

    card.querySelector('.email-capture-close').addEventListener('click', function() {
      try { store.setItem(EMAIL_DISMISS_KEY, String(Date.now())); } catch(e) {}
      card.classList.add('dismissed');
      setTimeout(function() { card.remove(); }, 260);
    });

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var email = (input.value || '').trim().toLowerCase();
      if (!EMAIL_RX.test(email)) {
        status.textContent = 'Please enter a valid email address.';
        status.className = 'email-capture-status err';
        input.focus();
        return;
      }
      submit.disabled = true;
      status.textContent = 'Saving\u2026';
      status.className = 'email-capture-status';

      fetch('/api/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, calcId: calcId, calcName: calcLabel() })
      }).then(function(r) {
        if (!r.ok) throw new Error('bad response');
        try { store.setItem(EMAIL_KEY, email); } catch(e) {}
        status.textContent = '\u2713 You\'re set. We\'ll send one reminder if you don\'t come back.';
        status.className = 'email-capture-status ok';
        submit.disabled = true;
        setTimeout(function() {
          card.classList.add('dismissed');
          setTimeout(function() { if (card.parentNode) card.remove(); }, 260);
        }, 2400);
      }).catch(function() {
        status.textContent = 'Could not save right now. Try again later.';
        status.className = 'email-capture-status err';
        submit.disabled = false;
      });
    });
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

    // Ping activity (silent) + offer email capture
    pingActivity();
    // Delay slightly so the card isn't the first thing users see
    setTimeout(showEmailCard, 1800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
