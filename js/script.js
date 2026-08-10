document.getElementById('year').textContent = new Date().getFullYear();

// Scroll-reveal animation for cards and section headers
const revealTargets = document.querySelectorAll(
  '.section-head, .service-card, .reason-card, .step, .gallery-item, .faq-item'
);

if ('IntersectionObserver' in window) {
  revealTargets.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealTargets.forEach((el) => observer.observe(el));
}

// Mobile navigation toggle
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Contact form submission (Netlify Forms compatible, with graceful fallback)
const form = document.getElementById('contact-form');
const formNote = document.getElementById('form-note');

function encodeFormData(data) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
}

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

// Prevent picking a past date for the preferred appointment
const wunschtermin = document.getElementById('wunschtermin');
if (wunschtermin) {
  wunschtermin.min = new Date().toISOString().split('T')[0];
}

// Hide the floating mobile WhatsApp button whenever the hero or the contact
// section is in view, since both already show their own WhatsApp button
const mobileCallButton = document.querySelector('.mobile-call-button');
const heroSection = document.querySelector('.hero');
const kontaktSection = document.getElementById('kontakt');

if (mobileCallButton && heroSection && kontaktSection && 'IntersectionObserver' in window) {
  const visibility = { hero: false, kontakt: false };

  const updateMobileCallButton = () => {
    mobileCallButton.classList.toggle('is-hidden', visibility.hero || visibility.kontakt);
  };

  const heroObserver = new IntersectionObserver(
    (entries) => {
      visibility.hero = entries[0].isIntersecting;
      updateMobileCallButton();
    },
    { threshold: 0.2 }
  );
  heroObserver.observe(heroSection);

  const kontaktObserver = new IntersectionObserver(
    (entries) => {
      visibility.kontakt = entries[0].isIntersecting;
      updateMobileCallButton();
    },
    { threshold: 0.2 }
  );
  kontaktObserver.observe(kontaktSection);
}

// Auto-scrolling testimonial marquee: duplicate the cards once so the
// looping animation can run seamlessly, and let people pause it by
// clicking/tapping (mouse hover also pauses it, handled purely in CSS)
const testimonialTrack = document.getElementById('testimonial-track');
if (testimonialTrack) {
  const originalCards = Array.from(testimonialTrack.children);
  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    testimonialTrack.appendChild(clone);
  });

  testimonialTrack.addEventListener('click', () => {
    testimonialTrack.classList.toggle('is-paused');
  });
}
