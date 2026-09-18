(() => {
  'use strict';

  const section = document.querySelector('[data-feature-expansion]');
  if (!section) return;
  const inner = section.querySelector('.feature-inner.wrap');
  if (!inner) return;
  const header = document.querySelector('.site-header');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = value => Math.max(0, Math.min(1, value));
  let frame = 0;
  let printing = false;

  function render() {
    let inset = 0;
    let radius = 0;
    let contentScale = 1;
    if (!motionPreference.matches && !printing) {
      const bounds = section.getBoundingClientRect();
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const start = Math.min(window.innerHeight * 0.78, bounds.top + window.scrollY);
      const end = headerHeight + 24;
      const distance = start - end;
      const progress = distance > 0
        ? clamp((start - bounds.top) / distance)
        : bounds.top <= end ? 1 : 0;
      const eased = progress * progress * (3 - 2 * progress);
      const compact = bounds.width <= 800;
      inset = bounds.width * (compact ? 0.1 : 0.14) * (1 - eased);
      contentScale = 1 - (compact ? 0.1 : 0.2) * (1 - eased);
      radius = 20 * (1 - eased);
    }
    section.style.setProperty('--feature-inset', `${inset}px`);
    section.style.setProperty('--feature-radius', `${radius}px`);
    section.style.setProperty('--feature-content-scale', String(contentScale));
  }

  function schedule() {
    if (frame || printing || motionPreference.matches) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      render();
    });
  }

  function syncMode() {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    render();
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  if (motionPreference.addEventListener) motionPreference.addEventListener('change', syncMode);
  else motionPreference.addListener(syncMode);
  window.addEventListener('beforeprint', () => {
    printing = true;
    syncMode();
  });
  window.addEventListener('afterprint', () => {
    printing = false;
    syncMode();
  });
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(schedule);
    observer.observe(section);
    observer.observe(inner);
    if (header) observer.observe(header);
  }
  render();
})();
