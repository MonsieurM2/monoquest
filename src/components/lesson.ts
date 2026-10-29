import { MODULES, getModule, lessonNeighbours, lessonSlugs, lessonsByModule } from '../data';
import type { Lesson } from '../data/types';
import { formatMinutes, icon } from '../lib/dom';
import { completedCount, isComplete, markComplete, setLastLesson } from '../lib/progress';
import { highlightCode, renderBlocks } from './blocks';
import { renderQuiz, setupQuiz } from './quiz';

function railLink(lesson: Lesson, currentSlug: string): string {
  const complete = isComplete(lesson.slug);
  const current = lesson.slug === currentSlug;
  return `<a class="rail-link${current ? ' is-current' : ''}${complete ? ' is-complete' : ''}" href="/cours/${
    lesson.slug
  }"${current ? ' aria-current="page"' : ''} data-link>
    <span class="rail-check">${complete ? icon('check') : ''}</span>
    <span class="rail-link-title">${lesson.navTitle}</span>
  </a>`;
}

function renderRail(lesson: Lesson): string {
  const total = lessonSlugs.length;
  const done = completedCount(lessonSlugs);

  return `<aside class="course-rail" data-course-rail aria-label="Sommaire du cours">
    <div class="rail-top">
      <button class="rail-close" type="button" data-rail-close aria-label="Fermer le sommaire du cours">${icon('close')}</button>
      <p class="rail-kicker">Parcours</p>
      <a class="rail-title" href="/parcours" data-link>Dungeon Slime</a>
      <div class="rail-progress" aria-hidden="true"><span style="width:${(done / total) * 100}%"></span></div>
      <p class="rail-count"><span data-rail-count>${done}</span> / ${total} chapitres</p>
    </div>
    <nav class="rail-nav">
      ${MODULES.map((module) => {
        const moduleLessons = lessonsByModule(module.id);
        if (moduleLessons.length === 0) return '';
        return `<div class="rail-module">
          <p class="rail-module-title"><span>${module.number}</span>${module.title}</p>
          ${moduleLessons.map((item) => railLink(item, lesson.slug)).join('')}
        </div>`;
      }).join('')}
    </nav>
    <div class="rail-footer">
      <a class="rail-all" href="/parcours" data-link>${icon('list')} Vue d’ensemble</a>
    </div>
  </aside>`;
}

function renderExercises(lesson: Lesson): string {
  if (lesson.exercises.length === 0) return '';

  return `<section class="exercises-section" id="exercices">
    <div class="section-heading">
      <p class="eyebrow">À toi de jouer</p>
      <h2>Exercices optionnels</h2>
      <p>Des exercices progressifs pour ancrer le chapitre. Essaie avant de regarder la solution.</p>
    </div>
    <div class="exercise-list">
      ${lesson.exercises
        .map(
          (exercise, index) => `<details class="exercise">
            <summary>
              <span class="exercise-number">${String(index + 1).padStart(2, '0')}</span>
              <span class="exercise-summary">
                <strong>${exercise.title}</strong>
                <span class="exercise-level">${exercise.level}</span>
              </span>
              <span class="exercise-chevron">${icon('chevron-down')}</span>
            </summary>
            <div class="exercise-body">
              <p>${exercise.prompt}</p>
              ${
                exercise.hint
                  ? `<p class="exercise-hint">${icon('lightbulb')}<span><strong>Indice.</strong> ${exercise.hint}</span></p>`
                  : ''
              }
              ${
                exercise.solution
                  ? `<details class="solution">
                      <summary>${icon('code')} Voir une solution possible</summary>
                      ${
                        exercise.solutionLang
                          ? `<pre class="solution-pre"><code class="hljs language-${exercise.solutionLang}">${highlightCode(
                              exercise.solution,
                              exercise.solutionLang,
                            )}</code></pre>`
                          : `<p>${exercise.solution}</p>`
                      }
                    </details>`
                  : ''
              }
            </div>
          </details>`,
        )
        .join('')}
    </div>
  </section>`;
}

function renderSources(lesson: Lesson): string {
  if (!lesson.sources?.length) return '';
  return `<div class="lesson-sources">
    <p class="sources-label">Sources et pour aller plus loin</p>
    <ul>${lesson.sources
      .map(
        (source) =>
          `<li><a href="${source.url}" target="_blank" rel="noreferrer">${source.label} ${icon('external')}</a></li>`,
      )
      .join('')}</ul>
    <p class="sources-note">Traduction et adaptation française : MonoQuest. Les extraits de code sont parfois abrégés pour la lecture ; les fichiers complets sont ceux du tutoriel officiel.</p>
  </div>`;
}

function renderPager(lesson: Lesson): string {
  const { previous, next } = lessonNeighbours(lesson.slug);
  return `<nav class="lesson-pager" aria-label="Navigation entre chapitres">
    ${
      previous
        ? `<a class="pager-card pager-prev" href="/cours/${previous.slug}" data-link>
            <span class="pager-label">${icon('arrow-left')} Chapitre précédent</span>
            <strong>${previous.title}</strong>
          </a>`
        : `<span></span>`
    }
    ${
      next
        ? `<a class="pager-card pager-next" href="/cours/${next.slug}" data-link>
            <span class="pager-label">Chapitre suivant ${icon('arrow-right')}</span>
            <strong>${next.title}</strong>
          </a>`
        : `<a class="pager-card pager-next" href="/quiz-final" data-link>
            <span class="pager-label">Terminer le parcours ${icon('arrow-right')}</span>
            <strong>Passer au quiz final</strong>
          </a>`
    }
  </nav>`;
}

export function renderLesson(lesson: Lesson): string {
  const module = getModule(lesson.module);
  const { html, toc } = renderBlocks(lesson.blocks);
  const index = lessonSlugs.indexOf(lesson.slug) + 1;

  const tocEntries = [
    ...toc,
    ...(lesson.quiz.length ? [{ id: 'quiz', text: 'Quiz' }] : []),
    ...(lesson.exercises.length ? [{ id: 'exercices', text: 'Exercices' }] : []),
  ];

  return `<div class="lesson-layout">
    <button class="rail-mobile-toggle" type="button" data-rail-toggle aria-expanded="false">
      ${icon('list')} Sommaire du cours
    </button>
    <div class="rail-overlay" data-rail-overlay hidden></div>
    ${renderRail(lesson)}

    <div class="lesson-main">
      <header class="lesson-header">
        <nav class="breadcrumb" aria-label="Fil d’Ariane">
          <a href="/parcours" data-link>Parcours</a>
          <span>/</span>
          <span>${module.title}</span>
        </nav>

        <div class="lesson-badges">
          <span class="badge badge-accent">Chapitre ${String(lesson.chapter).padStart(2, '0')}</span>
          <span class="badge">${icon('clock')} ${formatMinutes(lesson.duration)}</span>
          <span class="badge">${icon('book')} ${index} / ${lessonSlugs.length}</span>
        </div>

        <h1>${lesson.title}</h1>
        <p class="lesson-description">${lesson.description}</p>
      </header>

      <section class="objectives-card" aria-labelledby="objectifs">
        <div class="objectives-head">
          <span class="objectives-icon">${icon('target')}</span>
          <div>
            <p class="eyebrow">Objectifs</p>
            <h2 id="objectifs">À la fin de ce chapitre, tu sauras…</h2>
          </div>
        </div>
        <ul>${lesson.objectives.map((objective) => `<li>${icon('check')} ${objective}</li>`).join('')}</ul>
      </section>

      <article class="prose">
        ${html}
      </article>

      ${
        lesson.quiz.length
          ? `<div id="quiz">${renderQuiz(lesson.quiz, `lesson-${lesson.slug}`)}</div>`
          : ''
      }

      ${renderExercises(lesson)}
      ${renderSources(lesson)}

      <div class="completion-card" data-completion>
        <div>
          <p class="eyebrow">Progression</p>
          <h2>${isComplete(lesson.slug) ? 'Chapitre terminé' : 'Chapitre terminé ?'}</h2>
          <p>${
            isComplete(lesson.slug)
              ? 'Beau travail. Tu peux passer à la suite, ou relire les passages qui demandent encore un peu de pratique.'
              : 'Coche ce chapitre pour le retrouver dans ta progression. Ton avancement reste dans ce navigateur.'
          }</p>
        </div>
        <button class="btn ${isComplete(lesson.slug) ? 'btn-secondary' : 'btn-primary'}" type="button" data-complete>
          ${isComplete(lesson.slug) ? `${icon('check')} Terminé` : `${icon('check')} Marquer comme terminé`}
        </button>
      </div>

      ${renderPager(lesson)}
    </div>

    <aside class="lesson-aside">
      ${
        tocEntries.length > 2
          ? `<nav class="toc" aria-label="Dans ce chapitre">
              <p class="toc-title">Dans ce chapitre</p>
              ${tocEntries
                .map(
                  (entry, i) =>
                    `<a class="toc-link${i === 0 ? ' is-active' : ''}" href="#${entry.id}" data-toc-link="${entry.id}">${entry.text}</a>`,
                )
                .join('')}
            </nav>`
          : ''
      }
      <div class="aside-card">
        <span class="aside-card-icon">${icon('sparkle')}</span>
        <p class="aside-card-title">Conseil de progression</p>
        <p>Ne copie pas le code à l’aveugle. Lis-le, ferme l’onglet, puis réécris-le de mémoire. C’est trois fois plus efficace.</p>
      </div>
    </aside>
  </div>`;
}

export function setupLesson(lesson: Lesson): () => void {
  setLastLesson(lesson.slug);
  const controller = new AbortController();
  const { signal } = controller;

  const quizRoot = document.querySelector('#quiz');
  if (quizRoot) setupQuiz(quizRoot, lesson.quiz, `lesson-${lesson.slug}`);

  const completeButton = document.querySelector<HTMLButtonElement>('[data-complete]');
  const completionCard = document.querySelector<HTMLElement>('[data-completion]');
  const railCount = document.querySelector<HTMLElement>('[data-rail-count]');
  const railBar = document.querySelector<HTMLElement>('.rail-progress span');
  const railCurrent = document.querySelector<HTMLElement>('.rail-link.is-current .rail-check');

  const syncCompletion = (): void => {
    const done = isComplete(lesson.slug);
    completeButton?.classList.toggle('btn-secondary', done);
    completeButton?.classList.toggle('btn-primary', !done);
    if (completeButton) {
      completeButton.innerHTML = done ? `${icon('check')} Terminé` : `${icon('check')} Marquer comme terminé`;
    }
    if (railCurrent) railCurrent.innerHTML = done ? icon('check') : '';
    railCurrent?.closest('.rail-link')?.classList.toggle('is-complete', done);
    if (railCount) railCount.textContent = String(completedCount(lessonSlugs));
    if (railBar) railBar.style.width = `${(completedCount(lessonSlugs) / lessonSlugs.length) * 100}%`;
    const title = completionCard?.querySelector('h2');
    if (title) title.textContent = done ? 'Chapitre terminé' : 'Chapitre terminé ?';
    const text = completionCard?.querySelector('p:last-of-type');
    if (text) {
      text.textContent = done
        ? 'Beau travail. Tu peux passer à la suite, ou relire les passages qui demandent encore un peu de pratique.'
        : 'Coche ce chapitre pour le retrouver dans ta progression. Ton avancement reste dans ce navigateur.';
    }
  };

  completeButton?.addEventListener(
    'click',
    () => {
      markComplete(lesson.slug, !isComplete(lesson.slug));
      syncCompletion();
    },
    { signal },
  );

  // Active table of contents entry.
  const tocLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-toc-link]'));
  const sections = tocLinks
    .map((link) => document.getElementById(link.dataset.tocLink ?? ''))
    .filter((section): section is HTMLElement => section !== null);

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!visible) return;
        tocLinks.forEach((link) => {
          link.classList.toggle('is-active', link.dataset.tocLink === visible.target.id);
        });
      },
      { rootMargin: '-96px 0px -68% 0px', threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    controller.signal.addEventListener('abort', () => observer.disconnect());
  }

  // Mobile course rail.
  const railToggle = document.querySelector<HTMLButtonElement>('[data-rail-toggle]');
  const rail = document.querySelector<HTMLElement>('[data-course-rail]');
  const overlay = document.querySelector<HTMLElement>('[data-rail-overlay]');

  const closeRail = (): void => {
    rail?.classList.remove('is-open');
    overlay?.classList.add('hidden');
    railToggle?.setAttribute('aria-expanded', 'false');
  };

  railToggle?.addEventListener(
    'click',
    () => {
      const open = !rail?.classList.contains('is-open');
      rail?.classList.toggle('is-open', open);
      overlay?.classList.toggle('hidden', !open);
      railToggle.setAttribute('aria-expanded', String(open));
    },
    { signal },
  );

  overlay?.addEventListener('click', closeRail, { signal });
  rail?.querySelector('[data-rail-close]')?.addEventListener('click', closeRail, { signal });
  rail?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeRail, { signal }));

  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape') closeRail();
    },
    { signal },
  );

  window.addEventListener(
    'resize',
    () => {
      if (window.innerWidth > 1024) closeRail();
    },
    { passive: true, signal },
  );

  const hash = window.location.hash;
  if (hash) {
    window.setTimeout(() => document.querySelector(hash)?.scrollIntoView({ block: 'start' }), 60);
  }

  return () => controller.abort();
}
