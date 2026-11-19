(() => {
  'use strict';
  const items = Array.isArray(window.BUDGET_ITEMS) ? window.BUDGET_ITEMS : [];
  const body = document.querySelector('[data-budget-body]');
  const search = document.querySelector('[data-budget-search]');
  const filter = document.querySelector('[data-budget-filter]');
  const results = document.querySelector('[data-budget-results]');
  if (!body || !search || !filter || !results) return;
  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  const categories = [...new Set(items.map(item => item.category))];
  const priced = items.filter(item => typeof item.cost === 'number');
  const total = priced.reduce((sum, item) => sum + item.cost, 0);
  document.querySelector('[data-budget-total]').textContent = money.format(total);
  document.querySelector('[data-budget-items]').textContent = items.length;
  document.querySelector('[data-budget-categories]').textContent = categories.length;
  document.querySelector('[data-budget-quotes]').textContent = items.length - priced.length;
  categories.forEach(category => filter.add(new Option(category, category)));
  function render() {
    const query = search.value.trim().toLowerCase();
    const visible = items.filter(item => (!filter.value || item.category === filter.value) && (!query || `${item.name} ${item.category} ${item.notes || ''}`.toLowerCase().includes(query)));
    body.replaceChildren(...visible.map((item, index) => {
      const row = document.createElement('tr');
      const pending = typeof item.cost !== 'number';
      row.innerHTML = `<td class="row-number">${index + 1}</td><td class="budget-name">${item.name}</td><td>${item.category}</td><td class="budget-notes">${item.notes || '—'}</td><td class="budget-cost${pending ? ' budget-cost-pending' : ''}">${pending ? 'Quote needed' : money.format(item.cost)}</td><td><a class="budget-buy-link" href="${item.url}" target="_blank" rel="noopener noreferrer" aria-label="View source for ${item.name}">Open ↗</a></td>`;
      return row;
    }));
    results.textContent = `${visible.length} ${visible.length === 1 ? 'row' : 'rows'}`;
    body.closest('table').hidden = !visible.length;
    document.querySelector('.budget-empty')?.remove();
    if (!visible.length) { const empty = document.createElement('p'); empty.className = 'budget-empty'; empty.textContent = 'No components match those filters.'; document.querySelector('.budget-table-wrap').after(empty); }
  }
  search.addEventListener('input', render); filter.addEventListener('change', render); render();
})();
