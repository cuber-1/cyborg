(() => {
  'use strict';

  const heading = document.querySelector('h1[data-typewriter]');
  if (!heading) return;
  const body = document.body;
  const originalNodes = [...heading.childNodes].map(node => node.cloneNode(true));
  const characters = [];
  const removers = [];
  let frame = 0;
  let fadeTimer = 0;
  let cursor = null;
  let typingDone = false;
  let fadeElapsed = false;

  function revealPage() {
    if (fadeTimer) window.clearTimeout(fadeTimer);
    fadeTimer = 0;
    body.classList.remove('home-entering');
    removers.splice(0).forEach(remove => remove());
  }

  function finish(immediate = true) {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    typingDone = true;
    characters.forEach(({ element }) => element.classList.add('is-visible'));
    if (cursor) cursor.classList.remove('is-cursor');
    cursor = null;
    body.classList.remove('home-typing');
    if (immediate || fadeElapsed) revealPage();
  }

  function fallback() {
    finish();
    heading.replaceChildren(...originalNodes);
  }

  function listen(target, type, listener) {
    target.addEventListener(type, listener);
    removers.push(() => target.removeEventListener(type, listener));
  }

  try {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches || document.hidden) return;

    const visual = document.createElement('span');
    visual.className = 'typing-visual';
    visual.setAttribute('aria-hidden', 'true');
    const accessible = document.createElement('span');
    accessible.className = 'sr-only';
    // The visual spans retain every character for selection, including during typing.
    accessible.style.userSelect = 'none';
    accessible.style.webkitUserSelect = 'none';
    const words = [];
    const segmenter = typeof Intl.Segmenter === 'function'
      ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
    let nextAt = 100;

    function appendContent(node, destination) {
      if (node.nodeType === 3) {
        const text = node.textContent;
        words.push(text);
        const parts = segmenter
          ? [...segmenter.segment(text)].map(part => part.segment) : Array.from(text);
        parts.forEach(character => {
          const element = document.createElement('span');
          element.className = 'typing-char';
          element.textContent = character;
          destination.append(element);
          characters.push({ element, at: nextAt });
          nextAt += 55;
        });
      } else if (node.nodeType === 1 && node.tagName === 'BR') {
        destination.append(document.createElement('br'));
        words.push(' ');
        nextAt += 120;
      } else if (node.nodeType === 1) {
        const copy = node.cloneNode(false);
        destination.append(copy);
        [...node.childNodes].forEach(child => appendContent(child, copy));
      }
    }

    [...heading.childNodes].forEach(node => appendContent(node, visual));
    if (!characters.length) return;
    accessible.textContent = words.join('').replace(/\s+/g, ' ').trim();
    heading.replaceChildren(visual, accessible);

    const onPreference = () => { if (preference.matches) finish(); };
    if (preference.addEventListener) listen(preference, 'change', onPreference);
    else {
      preference.addListener(onPreference);
      removers.push(() => preference.removeListener(onPreference));
    }
    listen(window, 'beforeprint', () => finish());
    listen(document, 'focusin', () => finish());
    listen(document, 'visibilitychange', () => { if (document.hidden) finish(); });
    listen(window, 'pageshow', event => { if (event.persisted) finish(); });

    body.classList.add('home-entering', 'home-typing');
    const started = window.performance.now();
    const cursorEnd = characters[characters.length - 1].at + 300;
    let shown = 0;
    fadeTimer = window.setTimeout(() => {
      fadeElapsed = true;
      if (typingDone) revealPage();
    }, 3200);

    function tick(now) {
      frame = 0;
      try {
        const elapsed = now - started;
        while (shown < characters.length && characters[shown].at <= elapsed) {
          if (cursor) cursor.classList.remove('is-cursor');
          cursor = characters[shown].element;
          cursor.classList.add('is-visible', 'is-cursor');
          shown += 1;
        }
        if (elapsed >= cursorEnd) finish(false);
        else frame = window.requestAnimationFrame(tick);
      } catch (_) {
        fallback();
      }
    }

    frame = window.requestAnimationFrame(tick);
  } catch (_) {
    fallback();
  }
})();
