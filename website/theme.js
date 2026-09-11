(() => {
  'use strict';

  const root = document.documentElement;
  const storageKey = 'cyborg-theme';
  const choices = ['light', 'dark', 'system'];
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  const isLocalFile = window.location.protocol === 'file:';
  const valid = value => choices.includes(value);
  let saved;

  try {
    saved = window.localStorage.getItem(storageKey);
  } catch (_) {
    // File previews and privacy settings can make storage unavailable.
  }

  const query = isLocalFile ? new URL(window.location.href).searchParams.get('theme') : null;
  let preference = valid(query) ? query : valid(saved) ? saved : 'light';
  let resolved;

  function remember() {
    try {
      window.localStorage.setItem(storageKey, preference);
    } catch (_) {
      // Local-file links also carry the preference when storage is blocked.
    }
  }

  function apply() {
    resolved = preference === 'system' ? (system.matches ? 'dark' : 'light') : preference;
    root.dataset.theme = resolved;
    root.dataset.themePreference = preference;
    root.style.colorScheme = resolved;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = resolved === 'dark' ? '#191917' : '#f5f2eb';
    document.dispatchEvent(new CustomEvent('cyborg:themechange', {
      detail: { preference, theme: resolved }
    }));
  }

  function syncLink(link) {
    if (!isLocalFile) return;
    const href = link.getAttribute('href');
    if (!href || /^(?:[a-z][a-z\d+.-]*:|\/|#|\?)/i.test(href)) return;
    const path = href.split(/[?#]/, 1)[0];
    if (!/\.html$/i.test(path)) return;
    const target = new URL(href, window.location.href);
    target.searchParams.set('theme', preference);
    link.setAttribute('href', path + target.search + target.hash);
  }

  function syncLinks() {
    if (isLocalFile) document.querySelectorAll('a[href]').forEach(syncLink);
  }

  function set(next) {
    if (!valid(next)) return;
    preference = next;
    remember();
    apply();
    syncLinks();
    if (isLocalFile) {
      const current = new URL(window.location.href);
      current.searchParams.set('theme', preference);
      try {
        window.history.replaceState(window.history.state, '', current.href);
      } catch (_) {
        // Some file origins block history updates; link persistence still works.
      }
    }
  }

  window.CyborgTheme = {
    set,
    syncLinks,
    get preference() { return preference; },
    get theme() { return resolved; }
  };

  if (valid(query)) remember();
  apply();
  const onSystemChange = () => { if (preference === 'system') apply(); };
  if (system.addEventListener) system.addEventListener('change', onSystemChange);
  else system.addListener(onSystemChange);

  window.addEventListener('storage', event => {
    if (event.key !== storageKey && event.key !== null) return;
    preference = valid(event.newValue) ? event.newValue : 'light';
    apply();
    syncLinks();
  });

  document.addEventListener('DOMContentLoaded', syncLinks, { once: true });
  document.addEventListener('click', event => {
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (link) syncLink(link);
  }, true);
})();
