(() => {
  'use strict';

  const section = document.querySelector('[data-brain-arm]');
  if (!section) return;
  const visual = section.querySelector('.sync-visual');
  if (!visual) return;
  const header = document.querySelector('.site-header');

  const forearm = section.querySelector('[data-forearm]');
  const brainNodes = [...section.querySelectorAll('[data-brain-node]')];
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = value => Math.max(0, Math.min(1, value));
  const ease = value => value * value * (3 - 2 * value);
  let frame = 0;
  let printing = false;

  function createSignal(pathSelector, dotSelector) {
    const path = section.querySelector(pathSelector);
    const dot = section.querySelector(dotSelector);
    if (!path) return null;
    path.setAttribute('pathLength', '1');
    path.setAttribute('stroke-dasharray', '1');
    return { path, dot };
  }

  const signal = createSignal('[data-signal-path]', '[data-signal-dot]');
  const feedback = createSignal('[data-feedback-path]', '[data-feedback-dot]');

  function updateSignal(item, progress) {
    if (!item) return;
    item.path.setAttribute('stroke-dashoffset', String(1 - progress));
    if (!item.dot) return;
    item.dot.setAttribute('opacity', progress > 0 ? '1' : '0');
    try {
      const length = item.path.getTotalLength();
      const point = item.path.getPointAtLength(length * progress);
      if (Number.isFinite(point.x) && Number.isFinite(point.y)) {
        item.dot.setAttribute('transform', `translate(${point.x} ${point.y})`);
      }
    } catch (_) {
      // The connecting path remains readable if SVG geometry is unavailable.
    }
  }

  function render(progress, completed = false) {
    section.style.setProperty('--sync-progress', String(progress));
    if (forearm) {
      const angle = -12 + 52 * ease(clamp((progress - 0.22) / 0.55));
      forearm.setAttribute('transform', `translate(790 340) rotate(${angle})`);
    }
    updateSignal(signal, completed ? 1 : ease(clamp(progress / 0.34)));
    updateSignal(feedback, completed ? 1 : ease(clamp((progress - 0.58) / 0.42)));
    brainNodes.forEach((node, index) => {
      const phase = index / Math.max(1, brainNodes.length - 1) * 0.55;
      const activation = completed ? 1 : ease(clamp((progress - phase) / 0.35));
      node.setAttribute('opacity', String(0.25 + 0.75 * activation));
    });
  }

  function measureProgress() {
    const bounds = section.getBoundingClientRect();
    const visualBounds = visual.getBoundingClientRect();
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    // Finish before the diagram disappears behind the header.
    const visibleTail = Math.min(80, visualBounds.height * 0.25);
    const visualTravel = visualBounds.bottom - bounds.top - visibleTail;
    const distance = Math.max(1, Math.min(bounds.height * 0.65, visualTravel));
    return clamp((headerHeight - bounds.top) / distance);
  }

  function schedule() {
    if (frame || printing || motionPreference.matches) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      render(measureProgress());
    });
  }

  function syncMode() {
    if (!printing && !motionPreference.matches) {
      schedule();
    } else {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      render(1, true);
    }
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
    observer.observe(visual);
    if (header) observer.observe(header);
  }
  syncMode();
})();
