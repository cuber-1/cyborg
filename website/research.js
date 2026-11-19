(() => {
  'use strict';

  const assistance = document.querySelector('[data-assistance]');
  const demand = document.querySelector('[data-demand]');
  const dot = document.querySelector('[data-condition-dot]');
  const letter = document.querySelector('[data-condition-letter]');
  const title = document.querySelector('[data-condition-title]');
  const description = document.querySelector('[data-condition-description]');
  const assistanceOutput = document.querySelector('[data-assistance-output]');
  const demandOutput = document.querySelector('[data-demand-output]');
  const presets = [...document.querySelectorAll('[data-condition]')];
  if (!assistance || !demand || !dot || !letter || !title || !description) return;

  const conditions = {
    A: { assistance: 25, demand: 25, title: 'Baseline challenge', description: 'Lower assistance with lower cognitive demand.' },
    B: { assistance: 25, demand: 75, title: 'More to think about', description: 'Lower assistance with higher cognitive demand.' },
    C: { assistance: 75, demand: 25, title: 'A stronger helping hand', description: 'Higher assistance with lower cognitive demand.' },
    D: { assistance: 75, demand: 75, title: 'Help under pressure', description: 'Higher assistance with higher cognitive demand.' }
  };

  function update() {
    const assistanceValue = Number(assistance.value);
    const demandValue = Number(demand.value);
    const condition = `${assistanceValue >= 50 ? 'C' : 'A'}${demandValue >= 50 ? '+' : ''}`;
    const key = condition === 'A' ? 'A' : condition === 'A+' ? 'B' : condition === 'C' ? 'C' : 'D';
    const content = conditions[key];
    assistance.style.setProperty('--range-value', `${assistanceValue}%`);
    demand.style.setProperty('--range-value', `${demandValue}%`);
    dot.style.left = `${assistanceValue}%`;
    dot.style.bottom = `${demandValue}%`;
    assistanceOutput.textContent = assistanceValue >= 50 ? 'Higher' : 'Lower';
    demandOutput.textContent = demandValue >= 50 ? 'Higher' : 'Lower';
    letter.textContent = key;
    title.textContent = content.title;
    description.textContent = content.description;
    presets.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.condition === key)));
  }

  assistance.addEventListener('input', update);
  demand.addEventListener('input', update);
  presets.forEach(button => button.addEventListener('click', () => {
    const condition = conditions[button.dataset.condition];
    assistance.value = condition.assistance;
    demand.value = condition.demand;
    update();
  }));
  update();
})();
