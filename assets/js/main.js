(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const storageKey = 'burj-elevators-language';
  const languageButton = document.querySelector('[data-language-toggle]');
  const menuButton = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-main-nav]');

  const safeStorage = {
    get() { try { return localStorage.getItem(storageKey); } catch (_) { return null; } },
    set(v) { try { localStorage.setItem(storageKey, v); } catch (_) {} }
  };

  /* ---------------- language ---------------- */

  const TITLES = {
    home:     ['مؤسسة برج للمصاعد | الرئيسية', 'Burj Elevators | Home'],
    about:    ['من نحن | مؤسسة برج للمصاعد', 'About | Burj Elevators'],
    projects: ['معرض الأعمال | مؤسسة برج للمصاعد', 'Projects | Burj Elevators'],
    contact:  ['تواصل معنا | مؤسسة برج للمصاعد', 'Contact | Burj Elevators']
  };

  function currentLang() { return root.lang === 'en' ? 'en' : 'ar'; }

  function setLanguage(language, persist = true) {
    const lang = language === 'en' ? 'en' : 'ar';
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-ar][data-en]').forEach((el) => {
      const value = el.dataset[lang];
      if (typeof value === 'string') el.textContent = value;
    });

    document.querySelectorAll('[data-ar-alt][data-en-alt]').forEach((el) => {
      el.alt = lang === 'ar' ? el.dataset.arAlt : el.dataset.enAlt;
    });

    document.querySelectorAll('[data-ar-label][data-en-label]').forEach((el) => {
      el.setAttribute('aria-label', lang === 'ar' ? el.dataset.arLabel : el.dataset.enLabel);
    });

    if (languageButton) {
      languageButton.textContent = lang === 'ar' ? 'EN' : 'AR';
      const label = lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية';
      languageButton.setAttribute('aria-label', label);
      languageButton.title = label;
    }

    if (persist) safeStorage.set(lang);
    applyTitle();
    updateGalleryCount();
    updateLightboxCaption();
  }

  if (languageButton) {
    languageButton.addEventListener('click', () => setLanguage(currentLang() === 'ar' ? 'en' : 'ar'));
  }

  /* ---------------- view router ---------------- */

  const views = Array.from(document.querySelectorAll('[data-view]'));
  const ORDER = ['home', 'about', 'projects', 'contact'];
  let activeView = 'home';

  function applyTitle() {
    const pair = TITLES[activeView] || TITLES.home;
    document.title = currentLang() === 'ar' ? pair[0] : pair[1];
  }

  function showView(name, scrollTarget) {
    if (!ORDER.includes(name)) name = 'home';
    activeView = name;
    views.forEach((v) => { v.hidden = v.dataset.view !== name; });
    body.dataset.page = name;

    document.querySelectorAll('[data-nav-page]').forEach((link) => {
      const on = link.dataset.navPage === name;
      link.classList.toggle('active', on);
      if (on) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    applyTitle();
    revealVisible();
    updateGalleryCount();

    if (scrollTarget) {
      scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }

  function goTo(id) {
    id = String(id || '').replace('#', '').trim();
    closeMenu();
    if (!id || id === 'main-content') return showView('home');
    if (ORDER.includes(id)) return showView(id);
    const el = document.getElementById(id);
    if (el) {
      const parent = el.closest('[data-view]');
      return showView(parent ? parent.dataset.view : 'home', el);
    }
    showView('home');
  }

  // Internal links have no href at all, so there is nothing for the browser to
  // follow. Everything is routed here instead.
  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-goto]');
    if (link) {
      event.preventDefault();
      goTo(link.getAttribute('data-goto'));
      return;
    }
    // safety net: should never fire, but guarantees no stray '#' link escapes
    const stray = event.target.closest('a[href^="#"]');
    if (stray) {
      event.preventDefault();
      goTo(stray.getAttribute('href'));
    }
  }, true);

  // keyboard support, since an <a> without href is not natively activatable
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const link = event.target.closest && event.target.closest('[data-goto]');
    if (!link) return;
    event.preventDefault();
    goTo(link.getAttribute('data-goto'));
  });

  /* ---------------- mobile menu ---------------- */

  function closeMenu() {
    body.classList.remove('menu-open');
    if (menuButton) menuButton.setAttribute('aria-expanded', 'false');
  }

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = !body.classList.contains('menu-open');
      body.classList.toggle('menu-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('click', (e) => {
      if (!body.classList.contains('menu-open')) return;
      if (!e.target.closest('[data-main-nav]') && !e.target.closest('[data-menu-toggle]')) closeMenu();
    });
  }
  window.addEventListener('resize', () => { if (window.innerWidth > 860) closeMenu(); });

  /* ---------------- reveal on scroll ---------------- */

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let observer = null;

  if ('IntersectionObserver' in window && !reduceMotion) {
    observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px' });
  }

  function revealVisible() {
    const items = Array.from(document.querySelectorAll('.page-view:not([hidden]) .reveal:not(.visible)'));
    if (!observer) { items.forEach((i) => i.classList.add('visible')); return; }
    items.forEach((i) => observer.observe(i));
  }

  /* ---------------- gallery ---------------- */

  const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
  const galleryItems = Array.from(document.querySelectorAll('[data-gallery-item]'));
  const galleryCount = document.querySelector('[data-gallery-count]');

  const visibleItems = () => galleryItems.filter((i) => !i.hidden);

  function countLabel(n) {
    if (currentLang() === 'en') return `${n} project${n === 1 ? '' : 's'} displayed`;
    if (n === 0) return 'لا توجد أعمال معروضة';
    if (n === 1) return 'عمل واحد معروض';
    if (n === 2) return 'عملان معروضان';
    if (n <= 10) return `${n} أعمال معروضة`;
    return `${n} عملًا معروضًا`;
  }

  function updateGalleryCount() {
    if (galleryCount) galleryCount.textContent = countLabel(visibleItems().length);
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((b) => {
        const on = b === button;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      galleryItems.forEach((item) => {
        item.hidden = !(filter === 'all' || item.dataset.category === filter);
      });
      updateGalleryCount();
      revealVisible();
    });
  });

  /* ---------------- lightbox ---------------- */

  const lightbox = document.querySelector('[data-lightbox]');
  const lbImage = lightbox && lightbox.querySelector('[data-lightbox-image]');
  const lbTitle = lightbox && lightbox.querySelector('[data-lightbox-title]');
  const lbMeta = lightbox && lightbox.querySelector('[data-lightbox-meta]');
  const lbClose = lightbox && lightbox.querySelector('[data-lightbox-close]');
  const lbPrev = lightbox && lightbox.querySelector('[data-lightbox-prev]');
  const lbNext = lightbox && lightbox.querySelector('[data-lightbox-next]');
  let currentItem = null;
  let lastFocused = null;

  function updateLightboxCaption() {
    if (!currentItem || !lbTitle || !lbMeta) return;
    const ar = currentLang() === 'ar';
    lbTitle.textContent = ar ? currentItem.dataset.titleAr : currentItem.dataset.titleEn;
    lbMeta.textContent = ar ? currentItem.dataset.metaAr : currentItem.dataset.metaEn;
    if (lbImage) lbImage.alt = lbTitle.textContent || '';
  }

  function renderItem(item) {
    if (!lightbox || !lbImage || !item) return;
    const source = item.querySelector('img');
    if (!source) return;
    currentItem = item;
    lbImage.src = source.currentSrc || source.src;
    updateLightboxCaption();
  }

  function openLightbox(item) {
    if (!lightbox) return;
    lastFocused = document.activeElement;
    renderItem(item);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';
    if (lbClose) lbClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';
    currentItem = null;
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function moveLightbox(step) {
    if (!currentItem) return;
    const items = visibleItems();
    const i = items.indexOf(currentItem);
    if (i < 0 || !items.length) return;
    renderItem(items[(i + step + items.length) % items.length]);
  }

  galleryItems.forEach((item) => item.addEventListener('click', () => openLightbox(item)));
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev) lbPrev.addEventListener('click', () => moveLightbox(-1));
  if (lbNext) lbNext.addEventListener('click', () => moveLightbox(1));
  if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  const isOpen = () => !!lightbox && lightbox.classList.contains('open');

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
      if (isOpen()) closeLightbox();
      return;
    }
    if (!isOpen()) return;

    if (e.key === 'ArrowLeft') moveLightbox(root.dir === 'rtl' ? 1 : -1);
    if (e.key === 'ArrowRight') moveLightbox(root.dir === 'rtl' ? -1 : 1);

    // focus trap — keep Tab inside the dialog
    if (e.key === 'Tab') {
      const focusable = Array.from(lightbox.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
        .filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (!lightbox.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------------- footer year ---------------- */

  document.querySelectorAll('[data-current-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------------- boot ---------------- */

  const stored = safeStorage.get();
  setLanguage(stored === 'en' ? 'en' : 'ar', false);
  showView('home');
  revealVisible();
})();
