import '@fontsource-variable/inter';
import '@fontsource-variable/space-grotesk';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import './styles/base.css';
import './styles/pages.css';
import './styles/lesson.css';

import { renderCourse, setupCourse } from './components/course';
import { renderCsharp, setupCsharp } from './components/csharp';
import { renderExam, setupExam } from './components/exam';
import { renderHome } from './components/home';
import { renderApp, renderFooter, updateHeader } from './components/layout';
import { renderLesson, setupLesson } from './components/lesson';
import { renderNotFound } from './components/notfound';
import { renderResources } from './components/resources';
import { renderSearch, setupSearch } from './components/search';
import { getLesson } from './data';
import { fixInternalUrls, initLinks, parseRoute, type Route } from './router';

const app = document.querySelector<HTMLElement>('#app');
if (!app) throw new Error('Missing #app element');

let cleanup: (() => void) | null = null;
let currentRoute: Route = parseRoute();

app.innerHTML = `${renderApp(currentRoute)}${renderSearch()}`;

const viewElement = document.querySelector<HTMLElement>('#contenu');
if (!viewElement) throw new Error('Missing #contenu element');
const view: HTMLElement = viewElement;

function setMeta(description: string): void {
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);
}

function renderRoute(): void {
  cleanup?.();
  cleanup = null;

  currentRoute = parseRoute();
  const route = currentRoute;

  let title = 'MonoQuest — Apprendre le C# et MonoGame en créant un jeu';
  let description =
    'Apprends le C# et MonoGame en construisant Dungeon Slime, un jeu 2D complet. Cours en français, quiz et exercices, vérifié pour MonoGame 3.8.6.';

  switch (route.name) {
    case 'home': {
      view.innerHTML = renderHome();
      break;
    }
    case 'course': {
      view.innerHTML = renderCourse();
      cleanup = setupCourse();
      title = 'Le parcours complet — MonoQuest';
      description =
        '20 chapitres pour apprendre MonoGame et le C# en construisant un jeu 2D complet, avec quiz et exercices.';
      break;
    }
    case 'lesson': {
      const lesson = getLesson(route.slug);
      if (!lesson) {
        view.innerHTML = renderNotFound();
        title = 'Chapitre introuvable — MonoQuest';
        break;
      }
      view.innerHTML = renderLesson(lesson);
      cleanup = setupLesson(lesson);
      title = `${lesson.title} — MonoQuest`;
      description = lesson.description;
      break;
    }
    case 'csharp': {
      view.innerHTML = renderCsharp();
      cleanup = setupCsharp();
      title = 'Les bases de C# indispensables — MonoQuest';
      description =
        'Un guide express du C# nécessaire pour suivre le parcours MonoGame : types, classes, propriétés, héritage, collections et nullabilité.';
      break;
    }
    case 'exam': {
      view.innerHTML = renderExam();
      cleanup = setupExam();
      title = 'Quiz final — MonoQuest';
      description = '20 questions pour vérifier ta maîtrise des concepts du parcours MonoGame.';
      break;
    }
    case 'resources': {
      view.innerHTML = renderResources();
      title = 'Ressources — MonoQuest';
      description =
        'Documentation MonoGame, outils, assets libres, communautés et ressources pour continuer après le parcours.';
      break;
    }
    case 'notfound': {
      view.innerHTML = renderNotFound();
      title = 'Page introuvable — MonoQuest';
      break;
    }
  }

  document.title = title;
  setMeta(description);
  updateHeader(route);
  fixInternalUrls(document.body);

  document.body.classList.remove('menu-open');
  document.querySelector<HTMLButtonElement>('[data-menu-toggle]')?.setAttribute('aria-expanded', 'false');
  document.querySelector<HTMLElement>('.mobile-nav')?.setAttribute('hidden', '');

  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      window.requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
    }
  } else {
    // `instant` court-circuite le scroll-behavior: smooth du document, sinon la
    // nouvelle page s'affiche avant que le retour en haut ne soit terminé.
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

function setupChrome(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const mobileNav = document.querySelector<HTMLElement>('.mobile-nav');

  const onScroll = (): void => {
    header?.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const closeMenu = (): void => {
    mobileNav?.setAttribute('hidden', '');
    toggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  toggle?.addEventListener('click', () => {
    const open = mobileNav?.hasAttribute('hidden') ?? false;
    if (open) {
      mobileNav?.removeAttribute('hidden');
      document.body.classList.add('menu-open');
    } else {
      mobileNav?.setAttribute('hidden', '');
      document.body.classList.remove('menu-open');
    }
    toggle.setAttribute('aria-expanded', String(open));
  });

  mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  setupSearch();

  document.addEventListener('click', async (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-copy]');
    if (!button) return;
    const block = button.closest('.code-block');
    const code = block?.querySelector('code')?.textContent ?? '';
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }

    const label = button.querySelector('span');
    const original = label?.textContent ?? 'Copier';
    if (label) label.textContent = 'Copié !';
    button.classList.add('is-copied');
    window.setTimeout(() => {
      if (label) label.textContent = original;
      button.classList.remove('is-copied');
    }, 1600);
  });
}

initLinks();
setupChrome();
renderRoute();

window.addEventListener('route:change', renderRoute);
window.addEventListener('popstate', renderRoute);
window.addEventListener('app:refresh', renderRoute);
window.addEventListener('progress:change', () => updateHeader(currentRoute));

window.addEventListener('hashchange', () => {
  const target = document.querySelector(window.location.hash);
  target?.scrollIntoView({ block: 'start' });
});

// Ensure the footer is present even if a renderer replaces #contenu early.
if (!document.querySelector('.site-footer')) {
  app.insertAdjacentHTML('beforeend', renderFooter());
}
