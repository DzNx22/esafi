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

  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    scrollTopBtn.hidden = false;
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('is-visible', window.scrollY > 600);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  document.querySelectorAll('[data-accordion]').forEach((item) => {
    const trigger = item.querySelector('.schedule-head, .faq-head');
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

  const infoModal = document.getElementById('info-modal-overlay');
  if (infoModal) {
    const modal = infoModal.querySelector('.modal');
    const form = document.getElementById('info-modal-form');
    const nameInput = document.getElementById('info-name');
    const phoneInput = document.getElementById('info-phone');
    const emailInput = document.getElementById('info-email');
    const successBox = document.getElementById('info-modal-success');
    const closeBtn = document.getElementById('info-modal-close');
    const cancelBtn = document.getElementById('info-modal-cancel');
    let lastFocused = null;

    const setError = (input, message) => {
      const errorEl = infoModal.querySelector(`[data-error-for="${input.id}"]`);
      input.classList.toggle('is-invalid', Boolean(message));
      if (errorEl) errorEl.textContent = message || '';
    };

    const openModal = () => {
      lastFocused = document.activeElement;
      infoModal.hidden = false;
      requestAnimationFrame(() => infoModal.classList.add('is-visible'));
      document.body.style.overflow = 'hidden';
      setTimeout(() => nameInput.focus(), 50);
    };

    const closeModal = () => {
      infoModal.classList.remove('is-visible');
      document.body.style.overflow = '';
      setTimeout(() => {
        infoModal.hidden = true;
        form.reset();
        form.hidden = false;
        successBox.hidden = true;
        [nameInput, phoneInput, emailInput].forEach((input) => setError(input, ''));
        if (lastFocused) lastFocused.focus();
      }, 250);
    };

    document.querySelectorAll('.js-open-info-modal').forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    infoModal.addEventListener('click', (e) => {
      if (e.target === infoModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !infoModal.hidden) closeModal();
    });

    phoneInput.addEventListener('input', () => {
      const digits = phoneInput.value.replace(/\D/g, '').slice(0, 11);
      const ddd = digits.slice(0, 2);
      const local = digits.slice(2);
      const splitAt = local.length > 8 ? 5 : 4;
      let formatted = digits.length > 0 ? '(' + ddd : '';
      if (digits.length >= 3) formatted += ') ' + local.slice(0, splitAt);
      if (local.length > splitAt) formatted += '-' + local.slice(splitAt, splitAt + 4);
      phoneInput.value = formatted;
      setError(phoneInput, '');
    });

    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isValidPhone = (value) => /^\(\d{2}\) \d{4,5}-\d{4}$/.test(value);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      if (!nameInput.value.trim()) {
        setError(nameInput, 'Informe seu nome.');
        valid = false;
      } else {
        setError(nameInput, '');
      }

      if (!isValidPhone(phoneInput.value)) {
        setError(phoneInput, 'WhatsApp inválido. Use (00) 0000-0000 ou (00) 00000-0000.');
        valid = false;
      } else {
        setError(phoneInput, '');
      }

      if (!isValidEmail(emailInput.value.trim())) {
        setError(emailInput, 'Informe um e-mail válido.');
        valid = false;
      } else {
        setError(emailInput, '');
      }

      if (!valid) return;

      form.hidden = true;
      successBox.hidden = false;
      setTimeout(closeModal, 2200);
    });
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
