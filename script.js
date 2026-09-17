document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('site-header');
  const navToggle = document.getElementById('nav-toggle');

  if (navToggle && header) {
    navToggle.addEventListener('click', () => {
      header.classList.toggle('nav-open');
    });

    document.querySelectorAll('.main-nav a').forEach((link) => {
      link.addEventListener('click', () => {
        header.classList.remove('nav-open');
      });
    });
  }

  let lastScrollY = window.scrollY;
  if (header) {
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > header.offsetHeight) {
        header.classList.add('header-hidden');
        header.classList.remove('nav-open');
      } else {
        header.classList.remove('header-hidden');
      }
      lastScrollY = currentScrollY;
    }, { passive: true });
  }

  document.querySelectorAll('[data-accordion]').forEach((item) => {
    const trigger = item.querySelector('.schedule-head');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', String(isOpen));
    });
  });

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
});
