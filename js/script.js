document.getElementById('year').textContent = new Date().getFullYear();

// Scroll-reveal animation for cards and section headers
const revealTargets = document.querySelectorAll(
  '.section-head, .service-card, .reason-card, .testimonial-card, .step, .gallery-item, .faq-item'
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
      formNote.textContent = 'Die Anfrage konnte nicht automatisch gesendet werden. Bitte kontaktieren Sie uns direkt per Telefon oder E-Mail.';
      formNote.classList.add('error');
      formNote.hidden = false;
    });
});

// Prevent picking a past date for the preferred appointment
const wunschtermin = document.getElementById('wunschtermin');
if (wunschtermin) {
  wunschtermin.min = new Date().toISOString().split('T')[0];
}

// Hide the floating mobile call button while the contact form itself is in view
const mobileCallButton = document.querySelector('.mobile-call-button');
const kontaktSection = document.getElementById('kontakt');

if (mobileCallButton && kontaktSection && 'IntersectionObserver' in window) {
  const kontaktObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        mobileCallButton.classList.toggle('is-hidden', entry.isIntersecting);
      });
    },
    { threshold: 0.2 }
  );
  kontaktObserver.observe(kontaktSection);
}
