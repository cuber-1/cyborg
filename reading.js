(() => {
  'use strict';

  function initializeReading() {
    const list = document.getElementById('paper-list');
    if (!list) return;

    const papers = window.CYBORG_DATA?.papers || [];
    const count = document.getElementById('paper-count');
    const search = document.getElementById('paper-search');
    const empty = document.getElementById('empty-state');
    const filters = [...document.querySelectorAll('[data-filter]')];
    const clearButtons = [...document.querySelectorAll('[data-clear-search]')];
    const topics = new Set(['All', 'Foundations', 'EEG & workload', 'Robotics']);
    const initialTopic = new URL(window.location.href).searchParams.get('topic');
    let activeTopic = topics.has(initialTopic) ? initialTopic : 'All';

    const normalize = (value) => String(value).normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const searchablePapers = papers.map((paper) => ({
      paper,
      text: normalize([paper.title, paper.authors, paper.journal, paper.category].join(' '))
    }));

    if (count) {
      count.setAttribute('role', 'status');
      count.setAttribute('aria-live', 'polite');
      count.setAttribute('aria-atomic', 'true');
    }

    let emptyMessage = empty?.querySelector('[data-empty-message]');
    if (empty && !emptyMessage) {
      emptyMessage = document.createElement('p');
      emptyMessage.dataset.emptyMessage = '';
      empty.prepend(emptyMessage);
    }

    function element(tag, className, text) {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (text !== undefined) node.textContent = text;
      return node;
    }

    function paperRow(paper) {
      const article = element('article', 'paper-row');
      const meta = element('p', 'paper-meta', `${paper.year} · ${paper.category}`);
      const heading = element('h2', 'paper-title');
      const link = element('a', '', paper.title);
      link.href = paper.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      const arrow = element('span', 'paper-arrow', ' ↗');
      arrow.setAttribute('aria-hidden', 'true');
      link.append(arrow);
      heading.append(link);
      article.append(meta, heading, element('p', 'paper-author', paper.authors));
      if (paper.type) article.append(element('span', 'paper-type', paper.type));

      const details = element('details', 'paper-details');
      const content = element('div', 'paper-detail-content');
      const takeaway = element('p');
      takeaway.append(element('strong', '', 'For CYBORG: '), document.createTextNode(paper.takeaway));
      content.append(element('p', '', paper.summary), takeaway);
      details.append(element('summary', '', 'Why it matters'), content);
      article.append(details);
      return article;
    }

    function updateTopicUrl() {
      if (!['http:', 'https:'].includes(window.location.protocol)) return;
      const url = new URL(window.location.href);
      if (activeTopic === 'All') url.searchParams.delete('topic');
      else url.searchParams.set('topic', activeTopic);
      try {
        window.history.replaceState(window.history.state, '', url);
      } catch {
        // Filtering remains available when the browser restricts history updates.
      }
    }

    function render() {
      const query = search?.value.trim() || '';
      const terms = normalize(query).split(/\s+/).filter(Boolean);
      const results = searchablePapers.filter(({ paper, text }) =>
        (activeTopic === 'All' || paper.category === activeTopic) &&
        terms.every((term) => text.includes(term))
      );

      const fragment = document.createDocumentFragment();
      results.forEach(({ paper }) => fragment.append(paperRow(paper)));
      list.replaceChildren(fragment);
      if (count) count.textContent = `${results.length} ${results.length === 1 ? 'paper' : 'papers'}`;
      if (empty) empty.hidden = results.length !== 0;
      if (emptyMessage && results.length === 0) {
        const queryText = query ? ` matching “${query}”` : '';
        const topicText = activeTopic === 'All' ? '' : ` in ${activeTopic}`;
        emptyMessage.textContent = `No papers${queryText}${topicText}. Try another title, author, journal, or topic.`;
      }

      filters.forEach((button) => {
        const selected = button.dataset.filter === activeTopic;
        button.setAttribute('aria-pressed', String(selected));
        button.setAttribute('aria-controls', 'paper-list');
        button.classList.toggle('active', selected);
      });
    }

    filters.forEach((button) => button.addEventListener('click', () => {
      if (!topics.has(button.dataset.filter)) return;
      activeTopic = button.dataset.filter;
      updateTopicUrl();
      render();
    }));
    search?.addEventListener('input', render);
    clearButtons.forEach((button) => button.addEventListener('click', () => {
      if (search) search.value = '';
      activeTopic = 'All';
      updateTopicUrl();
      render();
      search?.focus();
    }));

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeReading, { once: true });
  } else {
    initializeReading();
  }
})();
