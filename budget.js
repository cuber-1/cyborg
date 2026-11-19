(() => {
  'use strict';
  const items = Array.isArray(window.BUDGET_ITEMS) ? window.BUDGET_ITEMS : [];
  const body = document.querySelector('[data-budget-body]');
  const search = document.querySelector('[data-budget-search]');
  const filter = document.querySelector('[data-budget-filter]');
  const results = document.querySelector('[data-budget-results]');
  const breakdown = document.querySelector('[data-category-breakdown]');
  if (!body || !search || !filter || !results || !breakdown) return;
  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  const categories = [...new Set(items.map(item => item.category))];
  const priced = items.filter(item => typeof item.cost === 'number');
  const total = priced.reduce((sum, item) => sum + item.cost, 0);
  document.querySelector('[data-budget-total]').textContent = money.format(total);
  document.querySelector('[data-budget-items]').textContent = items.length;
  document.querySelector('[data-budget-categories]').textContent = categories.length;
  document.querySelector('[data-budget-quotes]').textContent = items.length - priced.length;
  categories.forEach(category => filter.add(new Option(category, category)));
  categories.map(category => ({ category, value: items.filter(item => item.category === category).reduce((sum, item) => sum + (item.cost || 0), 0) })).sort((a, b) => b.value - a.value).forEach(({ category, value }, index) => {
    const row = document.createElement('button');
    row.type = 'button'; row.className = 'category-row';
    row.innerHTML = `<span class="category-rank">${String(index + 1).padStart(2, '0')}</span><span class="category-name">${category}</span><span class="category-track"><span style="width:${total ? value / total * 100 : 0}%"></span></span><span class="category-value">${money.format(value)}</span>`;
    row.addEventListener('click', () => { filter.value = category; render(); document.querySelector('.budget-ledger').scrollIntoView({ behavior: 'smooth' }); });
    breakdown.append(row);
  });
  function render() {
    const query = search.value.trim().toLowerCase();
    const visible = items.filter(item => (!filter.value || item.category === filter.value) && (!query || `${item.name} ${item.category} ${item.notes || ''}`.toLowerCase().includes(query)));
    body.replaceChildren(...visible.map(item => {
      const row = document.createElement('tr');
      const pending = typeof item.cost !== 'number';
      const note = item.notes ? `<span>${item.notes}</span>` : '';
      row.innerHTML = `<td><strong>${item.name}</strong>${note}</td><td><span class="budget-category-tag">${item.category}</span></td><td class="budget-cost${pending ? ' budget-cost-pending' : ''}">${pending ? 'Quote needed' : money.format(item.cost)}</td><td><a class="budget-buy-link" href="${item.url}" target="_blank" rel="noopener noreferrer" aria-label="View source for ${item.name}">View <span aria-hidden="true">↗</span></a></td>`;
      return row;
    }));
    results.textContent = `${visible.length} ${visible.length === 1 ? 'item' : 'items'}`;
    body.closest('table').hidden = !visible.length;
    document.querySelector('.budget-empty')?.remove();
    if (!visible.length) { const empty = document.createElement('p'); empty.className = 'budget-empty'; empty.textContent = 'No components match those filters.'; document.querySelector('.budget-table-wrap').after(empty); }
  }
  search.addEventListener('input', render); filter.addEventListener('change', render); render();
})();
