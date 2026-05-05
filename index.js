  // ── LOADER ──
  const loaderBar = document.getElementById('loaderBar');
  const loader = document.getElementById('loader');
  setTimeout(() => { loaderBar.style.width = '100%'; }, 100);
  setTimeout(() => { loader.classList.add('hidden'); }, 2000);

  // ── HAMBURGER ──
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  document.querySelectorAll('.mobile-nav-link, .mobile-cta').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });

  // ── CUSTOM CURSOR ──
  const cursorOuter = document.getElementById('cursor-outer');
  const cursorInner = document.getElementById('cursor-inner');
  let mouseX = 0, mouseY = 0, outerX = 0, outerY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorInner.style.left = mouseX + 'px';
    cursorInner.style.top = mouseY + 'px';
  });
  (function animateCursor() {
    outerX += (mouseX - outerX) * 0.12;
    outerY += (mouseY - outerY) * 0.12;
    cursorOuter.style.left = outerX + 'px';
    cursorOuter.style.top = outerY + 'px';
    requestAnimationFrame(animateCursor);
  })();
  document.querySelectorAll('a, button, .gallery-item, .service-card, .testimonial-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // ── THEME TOGGLE ──
  const themeToggle = document.getElementById('themeToggle');
  const sunIcon = document.getElementById('sunIcon');
  const moonIcon = document.getElementById('moonIcon');
  let isDark = true;
  themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    sunIcon.style.display = isDark ? 'block' : 'none';
    moonIcon.style.display = isDark ? 'none' : 'block';
  });

  // ── AMBIENT LIGHTING — MOUSE FOLLOWING ──
  const ambientMouse = document.getElementById('ambientMouse');
  let ambX = window.innerWidth / 2, ambY = window.innerHeight / 2;
  let targetX = ambX, targetY = ambY;
  
  document.addEventListener('mousemove', e => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  // Smooth ambient follow with lerp
  function animateAmbient() {
    ambX += (targetX - ambX) * 0.06;
    ambY += (targetY - ambY) * 0.06;
    ambientMouse.style.left = ambX + 'px';
    ambientMouse.style.top = ambY + 'px';
    requestAnimationFrame(animateAmbient);
  }
  animateAmbient();

  // Ambient intensity changes on scroll
  window.addEventListener('scroll', () => {
    const scrollFraction = window.pageYOffset / (document.body.scrollHeight - window.innerHeight);
    const hue = 42 + scrollFraction * 8; // slight hue shift
    ambientMouse.style.background = `radial-gradient(circle, hsla(${hue}, 65%, 55%, 0.07) 0%, transparent 60%)`;
  });

  // ── SCROLL ANIMATIONS ──
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  revealEls.forEach(el => observer.observe(el));

  // ── HERO PARALLAX ──
  const heroBgImg = document.getElementById('heroBg');
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (heroBgImg) heroBgImg.style.transform = `scale(1.05) translateY(${scrolled * 0.25}px)`;
  });

  // ── NAV SCROLL ──
  const mainNav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    mainNav.classList.toggle('scrolled', window.pageYOffset > 60);
  });

  // ── GALLERY LIGHTBOX ──
  const galleryItems = document.querySelectorAll('.gallery-item[data-src]');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxDotsContainer = document.getElementById('lightboxDots');

  // Build array from gallery items
  const galleryData = Array.from(galleryItems).map(item => ({
    src: item.dataset.src,
    title: item.dataset.title
  }));

  let currentIndex = 0;

  // Build dots
  function buildDots() {
    lightboxDotsContainer.innerHTML = '';
    // Show max 12 dots
    const total = Math.min(galleryData.length, 12);
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.className = 'lightbox-dot' + (i === currentIndex ? ' active' : '');
      dot.addEventListener('click', () => openLightbox(i));
      lightboxDotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = lightboxDotsContainer.querySelectorAll('.lightbox-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  }

  function openLightbox(index) {
    currentIndex = index;
    const item = galleryData[index];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.title;
    lightboxCaption.textContent = item.title;
    lightboxCounter.textContent = `${index + 1} / ${galleryData.length}`;
    buildDots();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 400);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryData.length;
    const item = galleryData[currentIndex];
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.title;
      lightboxCaption.textContent = item.title;
      lightboxCounter.textContent = `${currentIndex + 1} / ${galleryData.length}`;
      lightboxImg.style.opacity = '1';
      updateDots();
    }, 200);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
    const item = galleryData[currentIndex];
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.title;
      lightboxCaption.textContent = item.title;
      lightboxCounter.textContent = `${currentIndex + 1} / ${galleryData.length}`;
      lightboxImg.style.opacity = '1';
      updateDots();
    }, 200);
  }

  // Fade transition for image
  lightboxImg.style.transition = 'opacity 0.2s ease';

  // Click gallery items
  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  // Controls
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', showNext);
  lightboxPrev.addEventListener('click', showPrev);

  // Click outside to close
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // Touch/swipe support for lightbox
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? showNext() : showPrev(); }
  });