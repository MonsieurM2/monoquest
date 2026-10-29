import { csharpBlocks, csharpQuiz } from '../data/csharp';
import { icon } from '../lib/dom';
import { renderBlocks } from './blocks';
import { renderQuiz, setupQuiz } from './quiz';

export function renderCsharp(): string {
  const { html, toc } = renderBlocks(csharpBlocks);

  return `<div class="page guide-page">
    <header class="page-hero guide-hero">
      <div class="container">
        <nav class="breadcrumb" aria-label="Fil d’Ariane">
          <a href="/" data-link>Accueil</a><span>/</span><span>Bases C#</span>
        </nav>
        <p class="eyebrow">Prérequis express</p>
        <h1>Le C# indispensable pour MonoGame.</h1>
        <p class="page-lead">
          Pas besoin d’être développeur confirmé. Voici le vocabulaire, les types et les mécanismes
          que le parcours utilise — avec des exemples tirés du vrai code de Dungeon Slime.
        </p>
        <div class="guide-meta">
          <span>${icon('clock')} 20 min de lecture</span>
          <span>${icon('book')} 10 sections</span>
          <span>${icon('target')} ${csharpQuiz.length} questions</span>
        </div>
      </div>
    </header>

    <div class="container guide-layout">
      <article class="prose guide-main">
        ${html}
        <div id="quiz">${renderQuiz(csharpQuiz, 'guide-csharp', {
          title: 'Quiz express C#',
          intro: 'Huit questions pour vérifier que le vocabulaire est en place avant de commencer.',
        })}</div>
        <div class="guide-cta">
          <div>
            <p class="eyebrow">On passe à la pratique</p>
            <h2>Prêt pour MonoGame ?</h2>
            <p>Le chapitre 01 raconte d’où vient le framework. Le chapitre 02 installe tout et lance ta première fenêtre.</p>
          </div>
          <a class="btn btn-primary" href="/cours/monogame" data-link>Ouvrir le chapitre 01 ${icon('arrow-right')}</a>
        </div>
      </article>

      <aside class="guide-aside">
        <nav class="toc" aria-label="Dans ce guide">
          <p class="toc-title">Dans ce guide</p>
          ${toc
            .map(
              (entry, index) =>
                `<a class="toc-link${index === 0 ? ' is-active' : ''}" href="#${entry.id}" data-csharp-toc="${entry.id}">${entry.text}</a>`,
            )
            .join('')}
          <a class="toc-link" href="#quiz" data-csharp-toc="quiz">Quiz express</a>
        </nav>
        <div class="aside-card">
          <span class="aside-card-icon">${icon('info')}</span>
          <p class="aside-card-title">Pas besoin de tout savoir</p>
          <p>Reviens sur cette page quand un mot te bloque. Le parcours introduit chaque concept au moment où il sert.</p>
        </div>
      </aside>
    </div>
  </div>`;
}

export function setupCsharp(): () => void {
  setupQuiz(document, csharpQuiz, 'guide-csharp');
  const controller = new AbortController();

  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-csharp-toc]'));
  const sections = links
    .map((link) => document.getElementById(link.dataset.csharpToc ?? ''))
    .filter((section): section is HTMLElement => section !== null);

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!visible) return;
        links.forEach((link) => link.classList.toggle('is-active', link.dataset.csharpToc === visible.target.id));
      },
      { rootMargin: '-96px 0px -68% 0px', threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    controller.signal.addEventListener('abort', () => observer.disconnect());
  }

  return () => controller.abort();
}
