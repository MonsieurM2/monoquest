import { examQuestions } from '../data/exam';
import { icon } from '../lib/dom';
import { getProgress } from '../lib/progress';
import { renderQuiz, setupQuiz } from './quiz';

function bestScoreText(): string {
  const result = getProgress().quizzes['final-exam'];
  return result ? `Meilleur score : ${result.score} / ${result.total}` : 'Aucune tentative pour le moment';
}

export function renderExam(): string {
  return `<div class="page exam-page">
    <header class="page-hero exam-hero">
      <div class="container exam-hero-inner">
        <div>
          <nav class="breadcrumb" aria-label="Fil d’Ariane">
            <a href="/" data-link>Accueil</a><span>/</span><span>Quiz final</span>
          </nav>
          <p class="eyebrow">Évaluation finale</p>
          <h1>Le grand quiz MonoGame.</h1>
          <p class="page-lead">
            Vingt questions pour faire le tour du parcours : boucle de jeu, rendu, entrées, collisions,
            audio, scènes, shaders et publication. Chaque réponse est expliquée.
          </p>
          <div class="guide-meta">
            <span>${icon('target')} ${examQuestions.length} questions</span>
            <span>${icon('clock')} 10 à 15 min</span>
            <span>${icon('sparkle')} Sans chronomètre</span>
          </div>
        </div>
        <div class="exam-best">
          <span class="exam-best-label">Ta meilleure tentative</span>
          <strong data-best-score>${bestScoreText()}</strong>
          <span class="exam-best-note">Sauvegardée dans ce navigateur</span>
        </div>
      </div>
    </header>

    <div class="container exam-body">
      <div class="exam-note">
        <span>${icon('info')}</span>
        <p>Une seule bonne réponse par question. Tu peux recommencer autant de fois que tu veux : seul ton meilleur score est conservé.</p>
      </div>

      ${renderQuiz(examQuestions, 'final-exam', {
        title: 'Vérifie ta maîtrise du parcours',
        intro: 'Prends ton temps. L’objectif n’est pas le score, mais de repérer les chapitres à revoir.',
      })}

      <div class="exam-footer">
        <div>
          <p class="eyebrow">Une question manquée ?</p>
          <h2>Retrouve le chapitre correspondant.</h2>
          <p>Chaque explication renvoie à un concept précis. Le parcours et le guide C# sont là pour combler les trous.</p>
        </div>
        <div class="exam-footer-actions">
          <a class="btn btn-secondary" href="/parcours" data-link>${icon('list')} Voir le parcours</a>
          <a class="btn btn-ghost" href="/bases-csharp" data-link>Réviser C#</a>
        </div>
      </div>
    </div>
  </div>`;
}

export function setupExam(): () => void {
  setupQuiz(document, examQuestions, 'final-exam');
  const controller = new AbortController();
  const target = document.querySelector<HTMLElement>('[data-best-score]');

  window.addEventListener(
    'progress:change',
    () => {
      if (target) target.textContent = bestScoreText();
    },
    { signal: controller.signal },
  );

  return () => controller.abort();
}
