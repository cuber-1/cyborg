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
    if (!motionPreference.matches && !printing) {
      const bounds = section.getBoundingClientRect();
      const innerBounds = inner.getBoundingClientRect();
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const start = window.innerHeight * 0.85;
      const end = headerHeight + 24;
      const distance = start - end;
      const progress = distance > 0
        ? clamp((start - bounds.top) / distance)
        : bounds.top <= end ? 1 : 0;
      const eased = progress * progress * (3 - 2 * progress);
      inset = Math.max(0, innerBounds.left - bounds.left) * (1 - eased);
      radius = 12 * (1 - eased);
    }
    section.style.setProperty('--feature-inset', `${inset}px`);
    section.style.setProperty('--feature-radius', `${radius}px`);
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
