/**
 * IntelliTC Solutions — Embeddable Widget Loader
 * Usage:
 *   <div id="intellitc-widget"></div>
 *   <script src="https://intellitcsolutions.com/embed/intellitc-embed.js"
 *           data-tool="rent-vs-buy"
 *           data-theme="auto"
 *           data-height="800">
 *   </script>
 *
 * Attributes:
 *   data-tool     (required) — calculator slug, e.g. "rent-vs-buy", "brrrr"
 *   data-theme    (optional) — "light", "dark", or "auto" (default: "auto")
 *   data-height   (optional) — initial iframe height in px (default: 800)
 *   data-container(optional) — CSS selector for target container (default: auto-inserts before script)
 */
(function() {
  'use strict';

  var DOMAIN = 'https://intellitcsolutions.com';

  // Find the current script tag
  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];

  var tool = currentScript.getAttribute('data-tool');
  if (!tool) {
    console.error('[IntelliTC] Missing data-tool attribute. Example: data-tool="rent-vs-buy"');
    return;
  }

  var theme = currentScript.getAttribute('data-theme') || 'auto';
  var initialHeight = parseInt(currentScript.getAttribute('data-height'), 10) || 800;
  var containerId = currentScript.getAttribute('data-container');

  // Build iframe URL
  var src = DOMAIN + '/embed/' + tool + '/index.html';
  if (theme !== 'auto') {
    src += '?theme=' + theme;
  }

  // Create iframe
  var iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.style.width = '100%';
  iframe.style.height = initialHeight + 'px';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '12px';
  iframe.style.overflow = 'hidden';
  iframe.style.colorScheme = 'light dark';
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('allowtransparency', 'true');
  iframe.setAttribute('title', 'IntelliTC ' + tool.replace(/-/g, ' ') + ' calculator');
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-forms');

  // Listen for resize messages from the embedded page
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'intellitc-resize' && e.source === iframe.contentWindow) {
      iframe.style.height = (e.data.height + 20) + 'px';
    }
  });

  // Insert into DOM
  var container;
  if (containerId) {
    container = document.querySelector(containerId);
  }

  if (container) {
    container.appendChild(iframe);
  } else {
    // Insert before the script tag
    currentScript.parentNode.insertBefore(iframe, currentScript);
  }
})();
