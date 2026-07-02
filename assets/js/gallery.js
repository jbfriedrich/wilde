// Gallery lightbox: click a thumbnail to open a full-size overlay with
// previous / next navigation and a close button. Keyboard: arrows navigate,
// Escape closes. Built from the markup in photos/single.html — no dependencies.
(function () {
  var gallery = document.querySelector('.gallery');
  var lightbox = document.querySelector('.lightbox');
  if (!gallery || !lightbox) return;

  var items = Array.prototype.slice.call(gallery.querySelectorAll('.gallery__item'));
  if (!items.length) return;

  var img = lightbox.querySelector('.lightbox__img');
  var caption = lightbox.querySelector('.lightbox__caption');
  var btnPrev = lightbox.querySelector('.lightbox__prev');
  var btnNext = lightbox.querySelector('.lightbox__next');
  var btnClose = lightbox.querySelector('.lightbox__close');
  var current = 0;
  var lastFocus = null;

  function show(i) {
    current = (i + items.length) % items.length;
    var item = items[current];
    img.src = item.getAttribute('href');
    var cap = item.getAttribute('data-caption') || '';
    img.alt = cap;
    caption.textContent = cap;
    caption.hidden = !cap;
  }

  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    btnClose.focus();
  }

  function close() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    img.src = '';
    if (lastFocus) lastFocus.focus();
  }

  items.forEach(function (item, i) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      open(i);
    });
  });

  btnPrev.addEventListener('click', function () { show(current - 1); });
  btnNext.addEventListener('click', function () { show(current + 1); });
  btnClose.addEventListener('click', close);

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
  });
})();
