/* ============================================================
   IntelliTC — Share Link (Data Mobility)
   Encodes calculator inputs into a compact URL for cross-device
   sharing, bookmarking, and collaboration. No backend required.
   ============================================================ */
(function() {
  'use strict';

  var PARAM = 'd';  // URL parameter name for shared data

  /* ---- Lightweight UTF-16 compression (LZString-style) ---- */
  var LZ = (function() {
    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=';

    function compressToBase64URL(input) {
      if (input == null || input === '') return '';
      var output = [];
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;
      // Convert to UTF-8 bytes first
      var bytes = [];
      for (var ci = 0; ci < input.length; ci++) {
        var c = input.charCodeAt(ci);
        if (c < 128) {
          bytes.push(c);
        } else if (c < 2048) {
          bytes.push((c >> 6) | 192);
          bytes.push((c & 63) | 128);
        } else {
          bytes.push((c >> 12) | 224);
          bytes.push(((c >> 6) & 63) | 128);
          bytes.push((c & 63) | 128);
        }
      }
      while (i < bytes.length) {
        chr1 = bytes[i++];
        chr2 = i < bytes.length ? bytes[i++] : NaN;
        chr3 = i < bytes.length ? bytes[i++] : NaN;
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }
        output.push(keyStr.charAt(enc1));
        output.push(keyStr.charAt(enc2));
        output.push(keyStr.charAt(enc3));
        output.push(keyStr.charAt(enc4));
      }
      return output.join('');
    }

    function decompressFromBase64URL(input) {
      if (input == null || input === '') return '';
      var bytes = [];
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;
      // Remove any characters not in our alphabet
      input = input.replace(/[^A-Za-z0-9\-_=]/g, '');
      while (i < input.length) {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        bytes.push(chr1);
        if (enc3 !== 64) bytes.push(chr2);
        if (enc4 !== 64) bytes.push(chr3);
      }
      // Decode UTF-8 bytes
      var result = [];
      var bi = 0;
      while (bi < bytes.length) {
        var b = bytes[bi];
        if (b < 128) {
          result.push(String.fromCharCode(b));
          bi++;
        } else if (b >= 192 && b < 224) {
          result.push(String.fromCharCode(((b & 31) << 6) | (bytes[bi+1] & 63)));
          bi += 2;
        } else {
          result.push(String.fromCharCode(((b & 15) << 12) | ((bytes[bi+1] & 63) << 6) | (bytes[bi+2] & 63)));
          bi += 3;
        }
      }
      return result.join('');
    }

    return { compress: compressToBase64URL, decompress: decompressFromBase64URL };
  })();

  /* ---- Collect current input values ---- */
  function collectInputs() {
    var fields = document.querySelectorAll(
      '#inputPanel input[type="text"], #inputPanel input[type="number"], #inputPanel select'
    );
    var data = {};
    var count = 0;
    fields.forEach(function(f) {
      var id = f.id || f.name;
      if (!id) return;
      var val = f.value;
      // Skip empty/default values to keep URL short
      if (val === '' || val === '0') return;
      data[id] = val;
      count++;
    });
    return count > 0 ? data : null;
  }

  /* ---- Apply shared data to inputs ---- */
  function applySharedData(data) {
    var fields = document.querySelectorAll(
      '#inputPanel input[type="text"], #inputPanel input[type="number"], #inputPanel select'
    );
    var applied = 0;
    fields.forEach(function(f) {
      var id = f.id || f.name;
      if (!id || data[id] === undefined) return;
      f.value = data[id];
      applied++;
      try { f.dispatchEvent(new Event('input', { bubbles: true })); } catch(e) {}
    });
    return applied;
  }

  /* ---- Generate share URL ---- */
  function generateShareURL() {
    var data = collectInputs();
    if (!data) return null;
    var json = JSON.stringify(data);
    var encoded = LZ.compress(json);
    var url = window.location.origin + window.location.pathname;
    return url + '?' + PARAM + '=' + encoded;
  }

  /* ---- Check URL for shared data on page load ---- */
  function checkForSharedData() {
    var params = new URLSearchParams(window.location.search);
    var encoded = params.get(PARAM);
    if (!encoded) return false;

    try {
      var json = LZ.decompress(encoded);
      var data = JSON.parse(json);
      if (!data || typeof data !== 'object') return false;
      var applied = applySharedData(data);
      if (applied > 0) {
        // Clean the URL without reloading
        var cleanURL = window.location.origin + window.location.pathname;
        window.history.replaceState({}, '', cleanURL);
        showSharedBanner(applied);
        return true;
      }
    } catch(e) {
      // Invalid share data — ignore silently
    }
    return false;
  }

  /* ---- Show banner when shared data is loaded ---- */
  function showSharedBanner(fieldCount) {
    var banner = document.createElement('div');
    banner.className = 'share-link-banner visible';
    banner.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>' +
        '<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>' +
      '</svg>' +
      '<span>Shared deal loaded — ' + fieldCount + ' field' + (fieldCount !== 1 ? 's' : '') + ' populated</span>' +
      '<button class="share-link-banner-dismiss" aria-label="Dismiss">&times;</button>';

    var panel = document.getElementById('inputPanel');
    if (panel) {
      panel.insertBefore(banner, panel.firstChild);
    } else {
      document.body.appendChild(banner);
    }

    banner.querySelector('.share-link-banner-dismiss').addEventListener('click', function() {
      banner.classList.remove('visible');
      setTimeout(function() { banner.remove(); }, 300);
    });

    // Auto-dismiss after 8 seconds
    setTimeout(function() {
      if (banner.parentNode) {
        banner.classList.remove('visible');
        setTimeout(function() { if (banner.parentNode) banner.remove(); }, 300);
      }
    }, 8000);
  }

  /* ---- Show copy-success toast ---- */
  function showCopyToast() {
    // Remove existing toast if any
    var existing = document.querySelector('.share-link-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'share-link-toast';
    toast.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M20 6L9 17l-5-5"/>' +
      '</svg>' +
      '<span>Share link copied to clipboard</span>';
    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(function() {
      toast.classList.add('visible');
    });

    setTimeout(function() {
      toast.classList.remove('visible');
      setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
  }

  /* ---- Copy to clipboard with fallback ---- */
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(showCopyToast).catch(function() {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showCopyToast();
    } catch(e) {
      // Last resort: show the URL in a prompt
      prompt('Copy this share link:', text);
    }
    document.body.removeChild(ta);
  }

  /* ---- Share button click handler ---- */
  function handleShareClick() {
    var url = generateShareURL();
    if (!url) return;

    // Check URL length
    if (url.length > 8000) {
      alert('This calculation has too many fields to share via link. Use CSV or PDF export instead.');
      return;
    }

    copyToClipboard(url);
  }

  /* ---- Inject share button into the export group ---- */
  function injectShareButton() {
    var exportGroup = document.querySelector('.export-group');
    if (!exportGroup || exportGroup.querySelector('.btn-share')) return;

    var btn = document.createElement('button');
    btn.className = 'btn btn-export btn-share';
    btn.setAttribute('aria-label', 'Share deal link');
    btn.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<circle cx="18" cy="5" r="3"/>' +
        '<circle cx="6" cy="12" r="3"/>' +
        '<circle cx="18" cy="19" r="3"/>' +
        '<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>' +
        '<line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>' +
      '</svg>' +
      ' Share';
    btn.addEventListener('click', handleShareClick);

    exportGroup.appendChild(btn);
  }

  /* ---- Also handle alternate layout (Senior's Corner, Land Flip, etc.) ---- */
  function injectShareButtonAlternate() {
    var groups = document.querySelectorAll('.export-group');
    groups.forEach(function(group) {
      if (group.querySelector('.btn-share')) return;
      var btn = document.createElement('button');
      btn.className = 'btn btn-export btn-share';
      btn.setAttribute('aria-label', 'Share deal link');
      btn.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<circle cx="18" cy="5" r="3"/>' +
          '<circle cx="6" cy="12" r="3"/>' +
          '<circle cx="18" cy="19" r="3"/>' +
          '<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>' +
          '<line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>' +
        '</svg>' +
        ' Share';
      btn.addEventListener('click', handleShareClick);
      group.appendChild(btn);
    });
  }

  /* ---- Initialize ---- */
  function init() {
    // 1. Check for shared data in URL (before any other restore)
    checkForSharedData();

    // 2. Inject share button once export buttons exist
    //    Export.js creates them on DOMContentLoaded or on calculate click,
    //    so we watch for them with a brief retry + MutationObserver
    function tryInject() {
      injectShareButton();
      injectShareButtonAlternate();
    }

    // Try immediately
    tryInject();

    // Retry a few times (export buttons may appear after calculate)
    var retries = [300, 600, 1200, 2000];
    retries.forEach(function(delay) {
      setTimeout(tryInject, delay);
    });

    // Also watch for dynamically added export groups
    if (typeof MutationObserver !== 'undefined') {
      var observer = new MutationObserver(function() {
        tryInject();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    // Listen for calculate button clicks
    var calcBtn = document.getElementById('calcBtn');
    if (calcBtn) {
      calcBtn.addEventListener('click', function() {
        setTimeout(tryInject, 300);
        setTimeout(tryInject, 600);
      });
    }

    // Also handle .calc-submit buttons (alternate layouts)
    document.querySelectorAll('.calc-submit').forEach(function(btn) {
      btn.addEventListener('click', function() {
        setTimeout(tryInject, 300);
        setTimeout(tryInject, 600);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
