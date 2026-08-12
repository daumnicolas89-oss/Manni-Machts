/* ============================================================
   Manni Macht's — Interaktion
   Jahr · Header-Stuck · Rotator-Signature · Scroll-Reveal
   · Mobile-Nav · Formular · Mobile-Bar · Testimonial-Band
   ============================================================ */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- Jahr im Footer ---
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// --- Header: Schatten/Rahmen sobald gescrollt wird ---
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// --- Signature: rotierendes Problem-Wort in der Hero-Headline ---
const rotator = document.getElementById('rotator');
if (rotator) {
  const words = ['klemmt', 'hakt', 'wackelt', 'tropft', 'quietscht'];
  const wordEl = rotator.querySelector('.rotator-word');

  if (prefersReducedMotion) {
    // Ohne Bewegung: einzelnes Wort stehen lassen (bleibt auf eigener
    // Zeile ruhig), kein Wechsel.
  } else if (wordEl) {
    let i = 0;
    setInterval(() => {
      i = (i + 1) % words.length;
      rotator.classList.remove('is-animating');
      // Reflow erzwingen, damit die Animation neu startet
      void rotator.offsetWidth;
      wordEl.textContent = words[i];
      rotator.classList.add('is-animating');
    }, 2100);
  }
}

// --- Scroll-Reveal für Karten und Sektionsköpfe ---
const revealTargets = document.querySelectorAll(
  '.section-head, .service-card, .reason-card, .step, .gallery-item, .faq-item, .contact-form'
);

if ('IntersectionObserver' in window && !prefersReducedMotion) {
  revealTargets.forEach((el) => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Einblenden, sobald das Element sichtbar wird ODER bereits nach oben
        // aus dem Viewport gescrollt wurde (verhindert unsichtbare Elemente
        // bei Deep-Links oder wiederhergestellter Scroll-Position).
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));
}

// --- Mobile-Navigation ---
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Menü öffnen');
    });
  });

  // Menü mit Escape schließen
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('open')) {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    }
  });
}

// --- Kontaktformular (Netlify-kompatibel, mit Fallback) ---
const form = document.getElementById('contact-form');
const formNote = document.getElementById('form-note');

function encodeFormData(data) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
}

if (form && formNote) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const submitBtnDefaultText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Wird gesendet…';

    const data = Object.fromEntries(new FormData(form).entries());

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodeFormData(data),
    })
      .then(() => {
        formNote.textContent = 'Danke! Ihre Anfrage ist angekommen. Wir melden uns zeitnah bei Ihnen.';
        formNote.classList.remove('error');
        formNote.hidden = false;
        form.reset();
      })
      .catch(() => {
        formNote.textContent = 'Die Anfrage konnte nicht automatisch gesendet werden. Bitte kontaktieren Sie uns direkt per WhatsApp oder E-Mail.';
        formNote.classList.add('error');
        formNote.hidden = false;
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtnDefaultText;
      });
  });
}

// --- Vergangene Termine im Datumsfeld sperren ---
const wunschtermin = document.getElementById('wunschtermin');
if (wunschtermin) {
  wunschtermin.min = new Date().toISOString().split('T')[0];
}

// --- Mobile-Bar ausblenden, wenn Hero oder Kontakt sichtbar sind
//     (dort gibt es die Buttons ohnehin schon) ---
const mobileBar = document.getElementById('mobile-bar');
const heroSection = document.querySelector('.hero');
const kontaktSection = document.getElementById('kontakt');

if (mobileBar && heroSection && kontaktSection && 'IntersectionObserver' in window) {
  const visibility = { hero: false, kontakt: false };
  const update = () => mobileBar.classList.toggle('is-hidden', visibility.hero || visibility.kontakt);

  new IntersectionObserver((entries) => {
    visibility.hero = entries[0].isIntersecting;
    update();
  }, { threshold: 0.25 }).observe(heroSection);

  new IntersectionObserver((entries) => {
    visibility.kontakt = entries[0].isIntersecting;
    update();
  }, { threshold: 0.2 }).observe(kontaktSection);
}

// --- Testimonial-Band: Karten einmal klonen für nahtlose Schleife,
//     Pause beim Drücken/Halten (Hover-Pause läuft rein über CSS) ---
const testimonialTrack = document.getElementById('testimonial-track');
if (testimonialTrack && !prefersReducedMotion) {
  const originalCards = Array.from(testimonialTrack.children);
  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    testimonialTrack.appendChild(clone);
  });

  const firstClone = testimonialTrack.children[originalCards.length];
  const setMarqueeDistance = () => {
    if (!firstClone) return;
    const distance = firstClone.getBoundingClientRect().left - testimonialTrack.getBoundingClientRect().left;
    if (distance > 0) {
      const pixelsPerSecond = 42;
      testimonialTrack.style.setProperty('--marquee-distance', `${distance}px`);
      testimonialTrack.style.animationDuration = `${distance / pixelsPerSecond}s`;
    }
  };
  setMarqueeDistance();
  window.addEventListener('resize', setMarqueeDistance);

  const pause = () => testimonialTrack.classList.add('is-paused');
  const resume = () => testimonialTrack.classList.remove('is-paused');
  testimonialTrack.addEventListener('pointerdown', pause);
  testimonialTrack.addEventListener('pointerup', resume);
  testimonialTrack.addEventListener('pointercancel', resume);
  testimonialTrack.addEventListener('pointerleave', resume);
}
