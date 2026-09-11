(() => {
  'use strict';

  const theme = window.CyborgTheme;

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
    if (window.location.protocol === 'file:' && theme) {
      destination.searchParams.set('theme', theme.preference);
    }
    window.location.replace(destination.href);
    return true;
  }

  if (routeLegacyAnchor()) return;
  window.addEventListener('hashchange', routeLegacyAnchor);

  const themeToggle = document.querySelector('[data-theme-toggle]');
  const themeMenu = document.getElementById('theme-menu');
  const themeOptions = [...document.querySelectorAll('[data-theme-option]')];
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.getElementById('mobile-nav');

  function closeTheme(restoreFocus = false) {
    if (!themeMenu || !themeToggle) return;
    themeMenu.hidden = true;
    themeToggle.setAttribute('aria-expanded', 'false');
    if (restoreFocus) themeToggle.focus();
  }

  function closeNavigation(restoreFocus = false) {
    if (!mobileNav || !menuToggle) return;
    mobileNav.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    if (restoreFocus) menuToggle.focus();
  }

  function syncThemeControls() {
    if (!theme) return;
    const preference = theme.preference;
    if (themeToggle) themeToggle.setAttribute('aria-label', `Appearance: ${preference[0].toUpperCase() + preference.slice(1)}`);
    document.querySelectorAll('.theme-label').forEach(label => {
      label.textContent = preference[0].toUpperCase() + preference.slice(1);
    });
    themeOptions.forEach(option => {
      option.setAttribute('aria-checked', String(option.dataset.themeOption === preference));
      option.tabIndex = -1;
    });
  }

  function openTheme(last = false) {
    closeNavigation();
    themeMenu.hidden = false;
    themeToggle.setAttribute('aria-expanded', 'true');
    const selected = themeOptions.find(option => option.dataset.themeOption === theme.preference);
    const target = last ? themeOptions[themeOptions.length - 1] : selected || themeOptions[0];
    if (target) target.focus();
  }

  if (theme && themeToggle && themeMenu) {
    themeToggle.setAttribute('aria-controls', 'theme-menu');
    themeToggle.setAttribute('aria-haspopup', 'menu');
    themeMenu.setAttribute('role', 'menu');
    themeOptions.forEach(option => {
      option.setAttribute('role', 'menuitemradio');
      option.addEventListener('click', () => {
        theme.set(option.dataset.themeOption);
        closeTheme(true);
      });
    });
    closeTheme();
    syncThemeControls();
    document.addEventListener('cyborg:themechange', syncThemeControls);
    themeToggle.addEventListener('click', () => {
      if (themeMenu.hidden) openTheme();
      else closeTheme();
    });
    themeToggle.addEventListener('keydown', event => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      event.preventDefault();
      openTheme(event.key === 'ArrowUp');
    });
    themeMenu.addEventListener('keydown', event => {
      const index = themeOptions.indexOf(document.activeElement);
      let next;
      if (event.key === 'ArrowDown') next = (index + 1) % themeOptions.length;
      else if (event.key === 'ArrowUp') next = (index - 1 + themeOptions.length) % themeOptions.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = themeOptions.length - 1;
      else if (/^[lds]$/i.test(event.key)) {
        next = themeOptions.findIndex(option => option.dataset.themeOption.startsWith(event.key.toLowerCase()));
      }
      if (next === undefined || next < 0 || !themeOptions[next]) return;
      event.preventDefault();
      themeOptions[next].focus();
    });
  }

  if (menuToggle && mobileNav) {
    menuToggle.setAttribute('aria-controls', 'mobile-nav');
    closeNavigation();
    menuToggle.addEventListener('click', () => {
      const open = mobileNav.hidden;
      closeTheme();
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
    if (themeMenu && themeToggle && !themeMenu.contains(event.target) && !themeToggle.contains(event.target)) closeTheme();
    if (mobileNav && menuToggle && !mobileNav.contains(event.target) && !menuToggle.contains(event.target)) closeNavigation();
  });
  document.addEventListener('focusin', event => {
    if (themeMenu && themeToggle && !themeMenu.contains(event.target) && !themeToggle.contains(event.target)) closeTheme();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (themeMenu && !themeMenu.hidden) {
      event.preventDefault();
      closeTheme(true);
    } else if (mobileNav && !mobileNav.hidden) {
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
