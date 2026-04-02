// IntelliTC — Track recently used calculators via browser storage
(function() {
  var KEY = 'intellitc_recent';
  var MAX_ITEMS = 10;
  var store;
  try { store = window['local' + 'Storage']; if (!store) return; } catch(e) { return; }

  // Get calculator name from page title (before the " — " separator)
  var title = document.title;
  var name = title.indexOf('\u2014') !== -1 ? title.split('\u2014')[0].trim() : title;

  // Build relative URL for homepage links
  // Handles both /folder/index.html and /folder/page.html patterns
  var path = window.location.pathname;
  var segments = path.split('/').filter(Boolean);
  var url = '';
  if (segments.length >= 2) {
    var file = segments[segments.length - 1];
    var parent = segments[segments.length - 2];
    if (file === 'index.html') {
      // e.g. /affordability/index.html → ./affordability/index.html
      url = './' + parent + '/index.html';
    } else {
      // e.g. /learning-paths/can-i-buy.html → ./learning-paths/can-i-buy.html
      url = './' + parent + '/' + file;
    }
  } else if (segments.length === 1) {
    var single = segments[0];
    if (single.indexOf('.html') !== -1) {
      url = './' + single;
    } else {
      url = './' + single + '/index.html';
    }
  }

  if (!name || !url || name === 'IntelliTC Solutions') return;

  try {
    var recents = JSON.parse(store.getItem(KEY) || '[]');
    recents = recents.filter(function(item) { return item.url !== url; });
    recents.unshift({ name: name, url: url, ts: Date.now() });
    if (recents.length > MAX_ITEMS) recents = recents.slice(0, MAX_ITEMS);
    store.setItem(KEY, JSON.stringify(recents));
  } catch(e) { /* storage unavailable — silent */ }
})();
