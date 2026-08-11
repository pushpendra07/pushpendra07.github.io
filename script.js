// Theme toggle
(function () {
  var root = document.documentElement;
  var stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') {
    root.setAttribute('data-theme', stored);
  }
  function currentTheme() {
    var attr = root.getAttribute('data-theme');
    if (attr) return attr;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  function updateIcon() {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.innerHTML = currentTheme() === 'dark' ? SUN_ICON : MOON_ICON;
  }
  var SUN_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
  var MOON_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  updateIcon();
  var btn = document.getElementById('themeToggle');
  if (btn) {
    btn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateIcon();
    });
  }
})();

// Scroll progress bar
(function () {
  var bar = document.getElementById('scrollProgress');
  if (!bar) return;
  function update() {
    var h = document.documentElement;
    var scrolled = h.scrollTop || document.body.scrollTop;
    var height = h.scrollHeight - h.clientHeight;
    bar.style.width = height > 0 ? (scrolled / height * 100) + '%' : '0%';
  }
  document.addEventListener('scroll', update, { passive: true });
  update();
})();

// Header scrolled state + scroll-to-top button
(function () {
  var header = document.getElementById('siteHeader');
  var topBtn = document.getElementById('scrollTopBtn');
  function update() {
    var y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 8);
    if (topBtn) topBtn.classList.toggle('visible', y > 600);
  }
  document.addEventListener('scroll', update, { passive: true });
  update();
  if (topBtn) {
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();

// Mobile nav toggle
(function () {
  var header = document.getElementById('siteHeader');
  var toggle = document.getElementById('navToggle');
  if (!toggle) return;
  toggle.addEventListener('click', function () {
    header.classList.toggle('menu-open');
  });
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () {
      header.classList.remove('menu-open');
    });
  });
})();

// Active nav link on scroll
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (!links.length) return;
  var sections = links.map(function (l) {
    return document.querySelector(l.getAttribute('href'));
  }).filter(Boolean);

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        links.forEach(function (l) { l.classList.remove('active'); });
        var match = links.find(function (l) { return l.getAttribute('href') === '#' + entry.target.id; });
        if (match) match.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(function (s) { observer.observe(s); });
})();

// Skill filter chips
(function () {
  var chips = document.querySelectorAll('[data-skill-filter]');
  var groups = document.querySelectorAll('[data-skill-group]');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
      var filter = chip.getAttribute('data-skill-filter');
      groups.forEach(function (g) {
        g.style.display = (filter === 'all' || g.getAttribute('data-skill-group') === filter) ? '' : 'none';
      });
    });
  });
})();

// Project modal
(function () {
  var backdrop = document.getElementById('projectModalBackdrop');
  var modal = document.getElementById('projectModal');
  if (!backdrop || !modal) return;

  function openModal(card) {
    var title = card.getAttribute('data-title');
    var meta = card.getAttribute('data-meta');
    var bullets = JSON.parse(card.getAttribute('data-bullets') || '[]');
    var tags = JSON.parse(card.getAttribute('data-tags') || '[]');

    modal.querySelector('.modal-title').textContent = title;
    modal.querySelector('.modal-meta').textContent = meta;
    var list = modal.querySelector('.modal-list');
    list.innerHTML = '';
    bullets.forEach(function (b) {
      var li = document.createElement('li');
      li.textContent = b;
      list.appendChild(li);
    });
    var tagWrap = modal.querySelector('.modal-tags');
    tagWrap.innerHTML = '';
    tags.forEach(function (t) {
      var span = document.createElement('span');
      span.textContent = t;
      tagWrap.appendChild(span);
    });

    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-project-card]').forEach(function (card) {
    card.addEventListener('click', function () { openModal(card); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card); }
    });
  });

  backdrop.addEventListener('click', function (e) {
    if (e.target === backdrop) closeModal();
  });
  modal.querySelector('.modal-close').addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });
})();
