/* ============================================================
   IntelliTC Solutions — In-Tool Feedback Button
   ============================================================
   Adds a persistent "Feedback" button to every calculator.
   Opens a small modal for bug reports or feature suggestions.
   Submissions are stored locally and can be exported.
   ============================================================ */
(function() {
  'use strict';

  var STORAGE_KEY = 'intellitc_feedback';
  var store;
  try { store = window.localStorage; } catch(e) {}

  /* ---- Get calculator name ---- */
  function getCalcName() {
    var h1 = document.querySelector('#inputPanel .panel-title');
    return h1 ? h1.textContent.trim() : document.title.split('—')[0].trim();
  }

  /* ---- Build feedback button ---- */
  function buildButton() {
    var btn = document.createElement('button');
    btn.className = 'itc-feedback-btn';
    btn.setAttribute('aria-label', 'Report a bug or suggest a feature');
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span>Feedback</span>';
    document.body.appendChild(btn);
    btn.addEventListener('click', openModal);
  }

  /* ---- Build modal ---- */
  function buildModal() {
    var overlay = document.createElement('div');
    overlay.className = 'itc-feedback-overlay';
    overlay.id = 'feedbackOverlay';

    overlay.innerHTML = '\
<div class="itc-feedback-modal">\
  <div class="itc-feedback-header">\
    <h3>Send Feedback</h3>\
    <button class="itc-feedback-close" aria-label="Close feedback form">&times;</button>\
  </div>\
  <div class="itc-feedback-body">\
    <div class="itc-feedback-type-row">\
      <button class="itc-feedback-type-btn active" data-type="bug">\
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 2l1.88 1.88M14.12 3.88L16 2M9 7.13v-1a3 3 0 0 1 6 0v1M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6M12 20v-9M6.53 9C4.6 8.8 3 7.1 3 5M6 13H2M6 17H3M17.47 9c1.93-.2 3.53-1.9 3.53-4M18 13h4M18 17h3"/></svg>\
        Report a Bug\
      </button>\
      <button class="itc-feedback-type-btn" data-type="feature">\
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>\
        Suggest a Feature\
      </button>\
    </div>\
    <textarea class="itc-feedback-textarea" id="feedbackText" rows="4" placeholder="Describe the issue or your idea..."></textarea>\
    <div class="itc-feedback-meta">\
      <span class="itc-feedback-calc-name"></span>\
    </div>\
  </div>\
  <div class="itc-feedback-footer">\
    <button class="btn btn-primary itc-feedback-submit" id="feedbackSubmit">Submit Feedback</button>\
  </div>\
  <div class="itc-feedback-success" id="feedbackSuccess">\
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>\
    <p>Thank you for your feedback!</p>\
  </div>\
</div>';

    document.body.appendChild(overlay);

    // Wire events
    overlay.querySelector('.itc-feedback-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeModal();
    });

    // Type toggle
    overlay.querySelectorAll('.itc-feedback-type-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        overlay.querySelectorAll('.itc-feedback-type-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
      });
    });

    // Submit
    document.getElementById('feedbackSubmit').addEventListener('click', submitFeedback);

    // Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeModal();
    });

    // Set calc name
    overlay.querySelector('.itc-feedback-calc-name').textContent = getCalcName();
  }

  function openModal() {
    var overlay = document.getElementById('feedbackOverlay');
    if (!overlay) { buildModal(); overlay = document.getElementById('feedbackOverlay'); }
    overlay.classList.add('visible');
    // Reset state
    var success = document.getElementById('feedbackSuccess');
    success.classList.remove('visible');
    document.getElementById('feedbackText').value = '';
    document.getElementById('feedbackText').focus();
  }

  function closeModal() {
    var overlay = document.getElementById('feedbackOverlay');
    if (overlay) overlay.classList.remove('visible');
  }

  function submitFeedback() {
    var text = document.getElementById('feedbackText').value.trim();
    if (!text) {
      document.getElementById('feedbackText').focus();
      return;
    }

    var activeType = document.querySelector('.itc-feedback-type-btn.active');
    var type = activeType ? activeType.dataset.type : 'bug';

    var entry = {
      type: type,
      message: text,
      calculator: getCalcName(),
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };

    // Store locally
    if (store) {
      try {
        var existing = JSON.parse(store.getItem(STORAGE_KEY) || '[]');
        existing.push(entry);
        store.setItem(STORAGE_KEY, JSON.stringify(existing));
      } catch(e) {}
    }

    // Show success
    var success = document.getElementById('feedbackSuccess');
    success.classList.add('visible');

    // Auto-close after 2 seconds
    setTimeout(closeModal, 2000);
  }

  /* ---- Initialize ---- */
  function init() {
    buildButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
