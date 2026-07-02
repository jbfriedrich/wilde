// Client-side search over the Hugo-generated /index.json, powered by Fuse.js.
// Progressive enhancement: the year-grouped archive stays visible until you type.
(function () {
  var input = document.querySelector('.search__input');
  var results = document.querySelector('.search__results');
  var status = document.querySelector('.search__status');
  var archive = document.querySelector('.archive');
  if (!input || typeof Fuse === 'undefined') return;

  var fuse = null;

  function escapeHtml(s) {
    return (s || '').replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  fetch(input.dataset.index)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      fuse = new Fuse(data, {
        keys: [
          { name: 'title', weight: 3 },
          { name: 'summary', weight: 2 },
          { name: 'tags', weight: 1 }
        ],
        threshold: 0.3,
        ignoreLocation: true,
        minMatchCharLength: 3
      });
      input.disabled = false;
    });

  function render() {
    var q = input.value.trim();
    if (!q || !fuse) {
      results.innerHTML = '';
      if (archive) archive.hidden = false;
      if (status) status.textContent = '';
      return;
    }
    if (archive) archive.hidden = true;
    var hits = fuse.search(q).slice(0, 50);
    if (status) {
      status.textContent = hits.length + ' result' + (hits.length === 1 ? '' : 's') + ' for “' + q + '”';
    }
    // Same column order + type-icon marker as the static archive (icon · title ·
    // date) so result rows match. Icon inherits colour via the .type-icon mask.
    var TYPES = {
      posts:  ['post', 'Post'], notes: ['note', 'Note'],
      links:  ['link', 'Link'], photos: ['photos', 'Photos']
    };
    results.innerHTML = hits.map(function (h) {
      var i = h.item;
      var t = TYPES[i.section] || ['post', i.section];
      return '<li class="archive__item">' +
        '<span class="type-icon type-icon--' + t[0] + '" role="img" aria-label="' + t[1] + '"></span>' +
        '<a class="archive__link" href="' + i.url + '">' + escapeHtml(i.title) + '</a>' +
        '<span class="archive__date">' + escapeHtml(i.date) + '</span></li>';
    }).join('');
  }

  input.addEventListener('input', render);
})();
