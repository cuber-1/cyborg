(() => {
  'use strict';

  const navigation = window.performance.getEntriesByType('navigation')[0];
  if (navigation && navigation.type === 'reload') {
    const restoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    if (window.location.hash) {
      const url = new URL(window.location.href);
      url.hash = '';
      window.history.replaceState(window.history.state, '', url.href);
    }
    const startAtTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    startAtTop();
    window.addEventListener('pageshow', () => {
      startAtTop();
      window.setTimeout(() => {
        startAtTop();
        window.history.scrollRestoration = restoration;
      }, 0);
    }, { once: true });
  }

  function routeLegacyAnchor() {
    if (!/(?:\/index\.html|\/)$/i.test(window.location.pathname)) return false;
    const routes = {
      '#research': 'research.html',
      '#approach': 'research.html#method',
      '#team': 'team.html',
      '#reading': 'reading.html',
      '#contact': 'contact.html'
    };
    const route = routes[window.location.hash.toLowerCase()];
    if (!route) return false;
    const destination = new URL(route, window.location.href);
    destination.search = window.location.search;
    window.location.replace(destination.href);
    return true;
  }

  if (routeLegacyAnchor()) return;
  window.addEventListener('hashchange', routeLegacyAnchor);

  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.getElementById('mobile-nav');

  function closeNavigation(restoreFocus = false) {
    if (!mobileNav || !menuToggle) return;
    mobileNav.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    if (restoreFocus) menuToggle.focus();
  }

  if (menuToggle && mobileNav) {
    menuToggle.setAttribute('aria-controls', 'mobile-nav');
    closeNavigation();
    menuToggle.addEventListener('click', () => {
      const open = mobileNav.hidden;
      mobileNav.hidden = !open;
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    mobileNav.addEventListener('click', event => {
      if (event.target instanceof Element && event.target.closest('a[href]')) closeNavigation();
    });
    const desktop = window.matchMedia('(min-width: 801px)');
    const onDesktop = () => { if (desktop.matches) closeNavigation(); };
    if (desktop.addEventListener) desktop.addEventListener('change', onDesktop);
    else desktop.addListener(onDesktop);
  }

  document.addEventListener('click', event => {
    if (mobileNav && menuToggle && !mobileNav.contains(event.target) && !menuToggle.contains(event.target)) closeNavigation();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (mobileNav && !mobileNav.hidden) {
      event.preventDefault();
      closeNavigation(true);
    }
  });

  const email = 'draicha@umd.edu';
  const copyStatus = document.getElementById('copy-status');
  document.querySelectorAll('[data-copy-email]').forEach(button => {
    const label = button.querySelector('[data-copy-label], .copy-label, span');
    const originalLabel = label ? label.textContent : '';
    let resetTimer;

    button.addEventListener('click', async () => {
      let copied = false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
          copied = true;
        }
      } catch (_) {
        // Retry with the local-file-compatible clipboard path below.
      }
      if (!copied) {
        const active = document.activeElement;
        const field = document.createElement('textarea');
        field.value = email;
        field.readOnly = true;
        field.style.cssText = 'position:fixed;left:-9999px;top:0;';
        document.body.append(field);
        field.select();
        try {
          copied = document.execCommand('copy');
        } catch (_) {
          copied = false;
        } finally {
          field.remove();
          if (active instanceof HTMLElement) active.focus({ preventScroll: true });
        }
      }
      if (copyStatus) copyStatus.textContent = copied ? 'Email address copied.' : `Please select and copy ${email}.`;
      if (label) label.textContent = copied ? 'Email copied' : 'Select the email to copy';
      button.dataset.copied = String(copied);
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        if (label) label.textContent = originalLabel;
        delete button.dataset.copied;
      }, 3000);
    });
  });

  document.querySelectorAll('[data-year]').forEach(element => {
    element.textContent = String(new Date().getFullYear());
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const reveal = element => {
      element.classList.remove('reveal-pending');
      observer.unobserve(element);
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) reveal(entry.target); });
    }, { rootMargin: '0px 0px 64px 0px', threshold: 0 });
    document.querySelectorAll('.reveal').forEach(element => {
      if (element.getBoundingClientRect().top <= window.innerHeight) return;
      element.classList.add('reveal-pending');
      observer.observe(element);
    });
    const revealAll = () => {
      document.querySelectorAll('.reveal-pending').forEach(reveal);
      observer.disconnect();
    };
    const onMotionChange = () => { if (reducedMotion.matches) revealAll(); };
    if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', onMotionChange);
    else reducedMotion.addListener(onMotionChange);
    window.addEventListener('beforeprint', revealAll);
    document.addEventListener('focusin', event => {
      document.querySelectorAll('.reveal-pending').forEach(element => {
        if (element.contains(event.target)) reveal(element);
      });
    });
  }
})();
