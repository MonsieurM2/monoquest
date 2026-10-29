import { MODULES, lessonSlugs, lessons, lessonsByModule, totalExercises, totalMinutes, totalQuizQuestions } from '../data';
import type { Lesson } from '../data/types';
import { formatMinutes, icon } from '../lib/dom';
import { completedCount, getProgress, isComplete, nextLesson, resetProgress } from '../lib/progress';

function statusFor(lesson: Lesson, resumeSlug: string | null): string {
  if (isComplete(lesson.slug)) return `<span class="lesson-status is-done">${icon('check')} Terminé</span>`;
  if (lesson.slug === resumeSlug) return `<span class="lesson-status is-current">Reprendre</span>`;
  return `<span class="lesson-status">À faire</span>`;
}

function lessonCard(lesson: Lesson, resumeSlug: string | null): string {
  return `<a class="lesson-card${isComplete(lesson.slug) ? ' is-complete' : ''}" href="/cours/${lesson.slug}" data-link>
    <span class="lesson-card-number">${String(lesson.chapter).padStart(2, '0')}</span>
    <span class="lesson-card-body">
      <span class="lesson-card-top">
        ${statusFor(lesson, resumeSlug)}
        <span class="lesson-card-meta">${icon('clock')} ${formatMinutes(lesson.duration)}</span>
      </span>
      <strong class="lesson-card-title">${lesson.title}</strong>
      <span class="lesson-card-desc">${lesson.description}</span>
      <span class="lesson-card-foot">
        <span>${lesson.quiz.length} question${lesson.quiz.length > 1 ? 's' : ''} de quiz</span>
        <span class="lesson-card-arrow">${icon('arrow-right')}</span>
      </span>
    </span>
  </a>`;
}

export function renderCourse(): string {
  const progress = getProgress();
  const done = completedCount(lessonSlugs);
  const percent = Math.round((done / lessons.length) * 100);
  const resume =
    done > 0 ? (progress.lastLesson ?? nextLesson(lessonSlugs)) : nextLesson(lessonSlugs);
  const resumeLesson = lessons.find((lesson) => lesson.slug === resume);

  return `<div class="page course-page">
    <header class="page-hero course-hero">
      <div class="container">
        <p class="eyebrow">Le parcours complet</p>
        <h1>De ton premier projet à un jeu publié.</h1>
        <p class="page-lead">
          ${lessons.length} chapitres, ${totalQuizQuestions} questions de quiz et ${totalExercises} exercices pour construire
          <strong>Dungeon Slime</strong> de A à Z. Suis l’ordre, ou pioche selon tes besoins — chaque chapitre
          indique ce qu’il suppose déjà connu.
        </p>

        <div class="course-progress-card">
          <div class="progress-ring" style="--progress:${percent}">
            <span>${percent}<small>%</small></span>
          </div>
          <div class="course-progress-copy">
            <p class="course-progress-label">Ta progression</p>
            <p class="course-progress-value">${done} / ${lessons.length} chapitres terminés</p>
            <div class="course-progress-track"><span style="width:${percent}%"></span></div>
            <p class="course-progress-note">
              ${
                done === lessons.length
                  ? 'Parcours terminé. Il ne reste plus qu’à créer ton propre jeu.'
                  : `Environ ${Math.round(totalMinutes / 60)} h de contenu. ${
                      resumeLesson ? `Prochaine étape : ${resumeLesson.navTitle}.` : ''
                    }`
              }
            </p>
          </div>
          ${
            resume
              ? `<a class="btn btn-primary" href="/cours/${resume}" data-link>${done > 0 ? 'Reprendre' : 'Commencer'} ${icon('arrow-right')}</a>`
              : ''
          }
        </div>

        <div class="course-facts">
          <span>${icon('book')} ${lessons.length} chapitres</span>
          <span>${icon('target')} ${totalQuizQuestions} questions</span>
          <span>${icon('code')} ${totalExercises} exercices</span>
          <span>${icon('clock')} ≈ ${Math.round(totalMinutes / 60)} h</span>
        </div>
      </div>
    </header>

    <div class="container course-modules">
      ${MODULES.map((module) => {
        const items = lessonsByModule(module.id);
        const moduleDone = items.filter((item) => isComplete(item.slug)).length;
        if (items.length === 0) return '';
        return `<section class="course-module accent-${module.accent}" id="module-${module.id}">
          <header class="course-module-head">
            <span class="course-module-number">${module.number}</span>
            <div class="course-module-copy">
              <p class="eyebrow">Module</p>
              <h2>${module.title}</h2>
              <p>${module.description}</p>
            </div>
            <span class="course-module-progress">${moduleDone} / ${items.length}</span>
          </header>
          <div class="lesson-grid">
            ${items.map((lesson) => lessonCard(lesson, resume)).join('')}
          </div>
        </section>`;
      }).join('')}

      <div class="course-tools">
        <div>
          <p class="eyebrow">Repartir de zéro</p>
          <h2>Réinitialiser la progression</h2>
          <p>Les chapitres terminés et les scores de quiz sont stockés dans ce navigateur. Cette action les efface définitivement.</p>
        </div>
        <button class="btn btn-secondary" type="button" data-reset-progress>${icon('reset')} Réinitialiser</button>
      </div>

      <div class="course-next">
        <p>Tu hésites sur le point de départ ?</p>
        <div>
          <a class="text-link" href="/cours/monogame" data-link>Commencer par MonoGame ${icon('arrow-right')}</a>
          <a class="text-link" href="/bases-csharp" data-link>Réviser C# d’abord ${icon('arrow-right')}</a>
        </div>
      </div>
    </div>
  </div>`;
}

export function setupCourse(): () => void {
  const button = document.querySelector<HTMLButtonElement>('[data-reset-progress]');
  button?.addEventListener('click', () => {
    const confirmed = window.confirm(
      'Effacer toute la progression (chapitres terminés et scores de quiz) dans ce navigateur ?',
    );
    if (!confirmed) return;
    resetProgress();
    window.dispatchEvent(new CustomEvent('app:refresh'));
  });

  return () => {};
}
