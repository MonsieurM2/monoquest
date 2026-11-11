import { MODULES, lessons } from '../data';
import { csharpBlocks } from '../data/csharp';
import type { Block } from '../data/types';
import { escapeHtml } from '../lib/dom';
import { fixInternalUrls, navigate } from '../router';

interface SearchEntry {
  title: string;
  description: string;
  url: string;
  kind: string;
  meta: string;
  body?: string;
}

function plain(html: string): string {
  return html.replace(/<[^>]*>/g, ' ');
}

function blockText(blocks: Block[]): string {
  return blocks
    .map((block) => {
      switch (block.t) {
        case 'p':
        case 'quote':
          return plain(block.html);
        case 'h2':
        case 'h3':
          return block.text;
        case 'code':
          return block.code;
        case 'callout':
          return `${block.title ?? ''} ${plain(block.html)}`;
        case 'list':
          return block.items.map(plain).join(' ');
        case 'steps':
          return block.items.map((item) => `${item.title} ${plain(item.html)}`).join(' ');
        case 'table':
          return [...block.head, ...block.rows.flat()].map(plain).join(' ');
        case 'image':
          return `${block.alt} ${block.caption ?? ''}`;
        case 'gallery':
          return block.items.map((item) => `${item.alt} ${item.caption ?? ''}`).join(' ');
        default:
          return '';
      }
    })
    .join(' ');
}

const pages: SearchEntry[] = [
  {
    title: 'Le parcours complet',
    description: 'Tous les chapitres, module par module, avec ta progression.',
    url: '/parcours',
    kind: 'Page',
    meta: 'Vue d’ensemble',
  },
  {
    title: 'Les bases de C#',
    description: 'Le vocabulaire C# indispensable avant de commencer MonoGame.',
    url: '/bases-csharp',
    kind: 'Guide',
    meta: 'Prérequis',
    body: blockText(csharpBlocks),
  },
  {
    title: 'Quiz final',
    description: '20 questions pour vérifier l’ensemble du parcours.',
    url: '/quiz-final',
    kind: 'Quiz',
    meta: 'Évaluation',
  },
  {
    title: 'Ressources',
    description: 'Documentation, outils, assets et communautés.',
    url: '/ressources',
    kind: 'Page',
    meta: 'Liens utiles',
  },
];

const entries: SearchEntry[] = [
  ...lessons.map((lesson) => ({
    title: `${String(lesson.chapter).padStart(2, '0')} · ${lesson.title}`,
    description: lesson.description,
    url: `/cours/${lesson.slug}`,
    kind: 'Chapitre',
    meta: MODULES.find((module) => module.id === lesson.module)?.title ?? '',
    body: [
      blockText(lesson.blocks),
      ...lesson.quiz.flatMap((question) => [question.question, question.explanation, ...question.options]),
      ...lesson.exercises.flatMap((exercise) => [exercise.title, exercise.prompt, exercise.hint ?? '']),
    ].join(' '),
  })),
  ...pages,
];

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function search(query: string): SearchEntry[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return entries.slice(0, 5);

  return entries
    .map((entry) => {
      const haystack = normalize(
        `${entry.title} ${entry.description} ${entry.meta} ${entry.kind} ${entry.body ?? ''}`,
      );
      const title = normalize(entry.title);
      let score = 0;
      for (const term of terms) {
        if (!haystack.includes(term)) return { entry, score: -1 };
        if (title.startsWith(term)) score += 4;
        else if (title.includes(term)) score += 2;
        else score += 1;
      }
      return { entry, score };
    })
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((item) => item.entry);
}

export function renderSearch(): string {
  return `<dialog class="search-dialog" id="search-dialog" aria-label="Rechercher">
    <div class="search-panel">
      <div class="search-field">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
        <input type="search" id="search-input" placeholder="Rechercher un chapitre, un concept…" autocomplete="off" spellcheck="false" aria-label="Rechercher dans le cours" />
        <button class="search-close" type="button" data-search-close aria-label="Fermer la recherche">Esc</button>
      </div>
      <div class="search-results" data-search-results></div>
      <div class="search-footer">
        <span><kbd>↑</kbd><kbd>↓</kbd> naviguer</span>
        <span><kbd>Entrée</kbd> ouvrir</span>
        <span><kbd>Esc</kbd> fermer</span>
      </div>
    </div>
  </dialog>`;
}

export function setupSearch(): void {
  const dialog = document.querySelector<HTMLDialogElement>('#search-dialog');
  const input = document.querySelector<HTMLInputElement>('#search-input');
  const results = document.querySelector<HTMLElement>('[data-search-results]');
  if (!dialog || !input || !results) return;

  let activeIndex = 0;
  let current = search('');

  const render = (): void => {
    if (current.length === 0) {
      results.innerHTML = `<p class="search-empty">Aucun résultat. Essaie « sprite », « collision » ou « audio ».</p>`;
      return;
    }

    results.innerHTML = current
      .map(
        (entry, index) => `<a class="search-result${index === activeIndex ? ' is-active' : ''}" href="${entry.url}" data-link data-search-result="${index}">
          <span class="search-result-kind">${escapeHtml(entry.kind)}</span>
          <span class="search-result-copy">
            <strong>${escapeHtml(entry.title)}</strong>
            <small>${escapeHtml(entry.description)}</small>
          </span>
          <span class="search-result-meta">${escapeHtml(entry.meta)}</span>
        </a>`,
      )
      .join('');
    fixInternalUrls(results);
  };

  const open = (): void => {
    if (!dialog.open) dialog.showModal();
    input.value = '';
    activeIndex = 0;
    current = search('');
    render();
    window.setTimeout(() => input.focus(), 20);
  };

  const close = (): void => {
    if (dialog.open) dialog.close();
  };

  document.querySelectorAll<HTMLElement>('[data-search-open]').forEach((button) => {
    button.addEventListener('click', open);
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog || (event.target as Element).closest('[data-search-close]')) {
      close();
      return;
    }
    if ((event.target as Element).closest('[data-search-result]')) {
      close();
    }
  });

  input.addEventListener('input', () => {
    current = search(input.value);
    activeIndex = 0;
    render();
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      activeIndex = Math.min(activeIndex + 1, current.length - 1);
      render();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      render();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const entry = current[activeIndex];
      if (entry) {
        close();
        navigate(entry.url);
      }
    }
  });

  document.addEventListener('keydown', (event) => {
    const isMac = navigator.platform.toLowerCase().includes('mac');
    if ((isMac ? event.metaKey : event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (dialog.open) close();
      else open();
    }
  });

  window.addEventListener('route:change', close);
}
