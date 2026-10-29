import { lessons } from '../data';
import { icon, slimeMark } from '../lib/dom';
import { completedCount, getProgress, nextLesson } from '../lib/progress';
import type { Route } from '../router';

const navItems = [
  { href: '/parcours', label: 'Le parcours', match: 'course' },
  { href: '/bases-csharp', label: 'Bases C#', match: 'csharp' },
  { href: '/quiz-final', label: 'Quiz final', match: 'exam' },
  { href: '/ressources', label: 'Ressources', match: 'resources' },
] as const;

function navLink(item: (typeof navItems)[number], route: Route): string {
  const active = route.name === item.match || (route.name === 'lesson' && item.match === 'course');
  return `<a class="nav-link${active ? ' is-active' : ''}" href="${item.href}"${active ? ' aria-current="page"' : ''} data-link>${item.label}</a>`;
}

export function renderHeader(route: Route): string {
  const progress = getProgress();
  const count = completedCount(lessons.map((lesson) => lesson.slug));
  const resume =
    count > 0
      ? (progress.lastLesson ?? nextLesson(lessons.map((lesson) => lesson.slug)))
      : nextLesson(lessons.map((lesson) => lesson.slug));
  const ctaHref = resume ? `/cours/${resume}` : '/parcours';
  const ctaLabel = count > 0 ? 'Reprendre' : 'Commencer';

  return `<header class="site-header" data-header>
    <div class="container header-inner">
      <a class="brand" href="/" data-link aria-label="MonoQuest, accueil">
        <span class="brand-mark">${slimeMark(30)}</span>
        <span class="brand-word">Mono<span>Quest</span></span>
      </a>

      <nav class="main-nav" aria-label="Navigation principale">
        ${navItems.map((item) => navLink(item, route)).join('')}
      </nav>

      <div class="header-actions">
        <button class="search-trigger" type="button" data-search-open aria-label="Rechercher dans le cours">
          ${icon('search')}
          <span class="search-trigger-label">Rechercher</span>
          <kbd class="search-kbd"><span class="kbd-mod">Ctrl</span>K</kbd>
        </button>
        <span class="header-progress" title="${count} chapitre${count > 1 ? 's' : ''} terminé${count > 1 ? 's' : ''} sur ${lessons.length}">
          <span class="header-progress-bar"><span style="width:${(count / lessons.length) * 100}%"></span></span>
          <span class="header-progress-text">${count}/${lessons.length}</span>
        </span>
        <a class="btn btn-primary btn-sm header-cta" href="${ctaHref}" data-link>${ctaLabel} ${icon('arrow-right')}</a>
        <button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-controls="mobile-nav" aria-label="Ouvrir le menu">
          ${icon('menu')}
        </button>
      </div>
    </div>

    <div class="mobile-nav" id="mobile-nav" hidden>
      <nav aria-label="Navigation mobile">
        ${navItems.map((item) => navLink(item, route)).join('')}
        <a class="mobile-progress" href="/parcours" data-link>
          <span>Ma progression</span>
          <span>${count} / ${lessons.length} chapitres</span>
        </a>
      </nav>
    </div>
  </header>`;
}

export function renderFooter(): string {
  return `<footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <a class="brand" href="/" data-link aria-label="MonoQuest, accueil">
          <span class="brand-mark">${slimeMark(28)}</span>
          <span class="brand-word">Mono<span>Quest</span></span>
        </a>
        <p>Apprendre le C# et MonoGame en construisant un vrai jeu 2D, pas à pas.</p>
        <p class="footer-version"><span class="status-dot"></span> Vérifié pour MonoGame 3.8.6 · octobre 2026</p>
      </div>

      <div class="footer-col">
        <h3>Cours</h3>
        <a href="/parcours" data-link>Le parcours complet</a>
        <a href="/cours/monogame" data-link>Qu'est-ce que MonoGame ?</a>
        <a href="/cours/installation" data-link>Installer son environnement</a>
        <a href="/bases-csharp" data-link>Les bases de C#</a>
      </div>

      <div class="footer-col">
        <h3>Pratiquer</h3>
        <a href="/quiz-final" data-link>Quiz final</a>
        <a href="/cours/gameplay-final" data-link>Le jeu complet</a>
        <a href="/ressources" data-link>Ressources</a>
        <a href="https://docs.monogame.net/articles/tutorials/building_2d_games/index.html" target="_blank" rel="noreferrer">Tutoriel officiel ${icon('external')}</a>
      </div>

      <div class="footer-col">
        <h3>Communauté</h3>
        <a href="https://discord.gg/monogame" target="_blank" rel="noreferrer">Discord MonoGame ${icon('external')}</a>
        <a href="https://github.com/MonoGame/MonoGame" target="_blank" rel="noreferrer">GitHub MonoGame ${icon('external')}</a>
        <a href="https://monogame.net/showcase/" target="_blank" rel="noreferrer">Jeux réalisés ${icon('external')}</a>
        <a href="https://aristurtle.net/" target="_blank" rel="noreferrer">Christopher Whitley ${icon('external')}</a>
      </div>
    </div>

    <div class="container footer-bottom">
      <p>Adaptation française non officielle du tutoriel <em>Building 2D Games with MonoGame</em> de Christopher Whitley. MonoGame est une marque de la MonoGame Foundation.</p>
      <p class="footer-mono">Fait avec du C#, des pixels et beaucoup de café.</p>
    </div>
  </footer>`;
}

export function renderApp(route: Route): string {
  return `${renderHeader(route)}
    <main id="contenu" tabindex="-1"></main>
    ${renderFooter()}
    <div class="toast" id="toast" role="status" aria-live="polite"></div>`;
}

export function updateHeader(route: Route): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;

  const count = completedCount(lessons.map((lesson) => lesson.slug));
  const bar = header.querySelector<HTMLElement>('.header-progress-bar span');
  if (bar) bar.style.width = `${(count / lessons.length) * 100}%`;
  const text = header.querySelector<HTMLElement>('.header-progress-text');
  if (text) text.textContent = `${count}/${lessons.length}`;

  header.querySelectorAll<HTMLAnchorElement>('.main-nav .nav-link').forEach((link) => {
    const matched = navItems.find((item) => item.href === link.getAttribute('href'));
    const active = matched
      ? route.name === matched.match || (route.name === 'lesson' && matched.match === 'course')
      : false;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  const progress = getProgress();
  const resume =
    count > 0
      ? (progress.lastLesson ?? nextLesson(lessons.map((lesson) => lesson.slug)))
      : nextLesson(lessons.map((lesson) => lesson.slug));
  const cta = header.querySelector<HTMLAnchorElement>('.header-cta');
  if (cta && resume) {
    cta.href = `/cours/${resume}`;
    cta.innerHTML = `${count > 0 ? 'Reprendre' : 'Commencer'} ${icon('arrow-right')}`;
  }
}

export function showToast(message: string): void {
  const toast = document.querySelector<HTMLElement>('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.setTimeout(() => toast.classList.remove('is-visible'), 2200);
}
