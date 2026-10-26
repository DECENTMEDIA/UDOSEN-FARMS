(function () {
  'use strict';
  var PHONE = '2347040620480';
  var EMAIL = 'ubongudosen1967@gmail.com';

  // Mobile menu
  var header = document.getElementById('header');
  var burger = document.getElementById('hamburger');
  var nav = document.getElementById('siteNav');
  function setMenu(open) {
    burger.classList.toggle('active', open);
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  burger.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('open') && !nav.contains(e.target) && !burger.contains(e.target)) setMenu(false);
  });
  window.addEventListener('resize', function () { if (window.innerWidth > 860) setMenu(false); });

  // Header shadow + back to top
  var backTop = document.getElementById('backTop');
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('scrolled', y > 20);
    backTop.classList.toggle('visible', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  backTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // Active nav link
  var links = nav.querySelectorAll('a[href^="#"]:not(.nav-cta)');
  if ('IntersectionObserver' in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { secObs.observe(s); });

    // Reveal on scroll
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); revObs.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { revObs.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
  }

  // Gallery lightbox
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');
  var current = 0;
  function show(i) {
    current = (i + items.length) % items.length;
    var img = items[current].querySelector('img');
    lbImg.src = img.src; lbImg.alt = img.alt;
    lbCap.textContent = items[current].querySelector('figcaption').textContent;
  }
  function openLb(i) { show(i); lb.hidden = false; document.body.style.overflow = 'hidden'; }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ''; }
  items.forEach(function (it, i) {
    it.tabIndex = 0;
    it.addEventListener('click', function () { openLb(i); });
    it.addEventListener('keydown', function (e) { if (e.key === 'Enter') openLb(i); });
  });
  document.getElementById('lbClose').addEventListener('click', closeLb);
  document.getElementById('lbPrev').addEventListener('click', function () { show(current - 1); });
  document.getElementById('lbNext').addEventListener('click', function () { show(current + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  var touchX = null;
  lb.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    touchX = null;
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { setMenu(false); if (!lb.hidden) closeLb(); }
    if (!lb.hidden && e.key === 'ArrowRight') show(current + 1);
    if (!lb.hidden && e.key === 'ArrowLeft') show(current - 1);
  });

  // Quote form: WhatsApp or email
  var form = document.getElementById('inquiryForm');
  var success = document.getElementById('formSuccess');
  var sendVia = 'whatsapp';
  form.querySelectorAll('button[data-send]').forEach(function (b) {
    b.addEventListener('click', function () { sendVia = b.getAttribute('data-send'); });
  });
  function validate(field) {
    var group = field.closest('.form-group');
    var v = field.value.trim();
    var ok = true;
    if (field.required && !v) ok = false;
    if (ok && field.type === 'email' && v) ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    if (ok && field.type === 'tel' && v) ok = v.replace(/\D/g, '').length >= 7;
    group.classList.toggle('error', !ok);
    return ok;
  }
  form.querySelectorAll('input, select, textarea').forEach(function (f) {
    f.addEventListener('blur', function () { validate(f); });
    f.addEventListener('input', function () { if (f.closest('.form-group').classList.contains('error')) validate(f); });
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;
    form.querySelectorAll('input, select, textarea').forEach(function (f) { if (!validate(f)) valid = false; });
    if (!valid) {
      var first = form.querySelector('.form-group.error input, .form-group.error select, .form-group.error textarea');
      if (first) first.focus();
      return;
    }
    var val = function (id) { return document.getElementById(id).value.trim(); };
    var text = 'Quote request - Udosen Agro Farms\n\n' +
      'Name: ' + val('fullName') + '\n' +
      'Phone: ' + val('phone') + '\n' +
      (val('email') ? 'Email: ' + val('email') + '\n' : '') +
      'Product: ' + val('productInterest') + '\n\n' +
      'Message: ' + val('message');
    if (sendVia === 'email') {
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Quote request from ' + val('fullName')) + '&body=' + encodeURIComponent(text);
      success.textContent = 'Your email app is opening with your request. Just press send.';
    } else {
      window.open('https://wa.me/' + PHONE + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
      success.textContent = 'WhatsApp is opening with your request. Just press send.';
    }
    success.classList.add('show');
    form.reset();
    setTimeout(function () { success.classList.remove('show'); }, 9000);
  });

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();
})();
