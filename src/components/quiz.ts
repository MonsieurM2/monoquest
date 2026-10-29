import type { QuizQuestion } from '../data/types';
import { escapeHtml } from '../lib/dom';
import { recordQuiz } from '../lib/progress';
import { renderCode } from './blocks';

interface QuizOptions {
  title?: string;
  intro?: string;
}

interface QuizState {
  index: number;
  selected: number | null;
  locked: boolean;
  answers: number[];
  finished: boolean;
}

const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

export function renderQuiz(questions: QuizQuestion[], id: string, options: QuizOptions = {}): string {
  return `<section class="quiz-card" data-quiz data-quiz-id="${escapeHtml(id)}" aria-label="${escapeHtml(
    options.title ?? 'Quiz',
  )}">
    <div class="quiz-top">
      <div>
        <p class="quiz-eyebrow">Quiz</p>
        <h2>${escapeHtml(options.title ?? 'Vérifie tes acquis')}</h2>
        ${options.intro ? `<p class="quiz-intro">${options.intro}</p>` : ''}
      </div>
      <span class="quiz-badge">${questions.length} question${questions.length > 1 ? 's' : ''}</span>
    </div>
    <div class="quiz-track" aria-hidden="true"><span data-quiz-track></span></div>
    <div class="quiz-content" data-quiz-content></div>
  </section>`;
}

export function setupQuiz(root: ParentNode, questions: QuizQuestion[], id: string): void {
  const quiz = root.querySelector<HTMLElement>('[data-quiz]');
  if (!quiz || questions.length === 0) return;

  const content = quiz.querySelector<HTMLElement>('[data-quiz-content]');
  const track = quiz.querySelector<HTMLElement>('[data-quiz-track]');
  if (!content || !track) return;

  const state: QuizState = {
    index: 0,
    selected: null,
    locked: false,
    answers: [],
    finished: false,
  };

  const score = (): number =>
    questions.reduce((total, question, index) => total + (state.answers[index] === question.correct ? 1 : 0), 0);

  const renderResult = (): void => {
    const result = score();
    const percent = Math.round((result / questions.length) * 100);
    const message =
      percent === 100
        ? 'Sans faute. Tu peux passer au chapitre suivant.'
        : percent >= 70
          ? 'Bien joué. Relis les explications des questions manquées, puis continue.'
          : 'Retourne voir les passages correspondants et retente le quiz : c’est comme ça qu’on apprend.';

    track.style.width = '100%';

    content.innerHTML = `<div class="quiz-result">
      <div class="score-ring" style="--score:${percent}"><span>${percent}<small>%</small></span></div>
      <div class="quiz-result-copy">
        <p class="quiz-meta">Résultat</p>
        <h3>${result} / ${questions.length} bonnes réponses</h3>
        <p>${message}</p>
        <div class="quiz-result-actions">
          <button class="btn btn-secondary btn-sm" type="button" data-quiz-retry>Recommencer</button>
        </div>
      </div>
    </div>
    <details class="quiz-review">
      <summary>Revoir les réponses</summary>
      <ol>${questions
        .map((question, index) => {
          const correct = state.answers[index] === question.correct;
          return `<li class="${correct ? 'is-correct' : 'is-wrong'}">
            <p class="review-question">${escapeHtml(question.question)}</p>
            <p class="review-answer"><strong>Bonne réponse :</strong> ${escapeHtml(
              question.options[question.correct] ?? '',
            )}</p>
            <p class="review-explain">${question.explanation}</p>
          </li>`;
        })
        .join('')}</ol>
    </details>`;
  };

  const renderQuestion = (): void => {
    const question = questions[state.index];
    if (!question) return;

    const progress = (state.index / questions.length) * 100;
    track.style.width = `${progress}%`;

    content.innerHTML = `<div class="quiz-question-wrap">
      <p class="quiz-meta">Question ${state.index + 1} sur ${questions.length}</p>
      <h3 class="quiz-question">${escapeHtml(question.question)}</h3>
      ${question.code ? renderCode({ code: question.code, compact: true }) : ''}
      <div class="quiz-options" role="group" aria-label="Choisis une réponse">
        ${question.options
          .map((option, index) => {
            const isCorrect = state.locked && index === question.correct;
            const isWrong = state.locked && index === state.selected && index !== question.correct;
            const isSelected = !state.locked && index === state.selected;
            return `<button class="quiz-option${isSelected ? ' is-selected' : ''}${isCorrect ? ' is-correct' : ''}${
              isWrong ? ' is-wrong' : ''
            }" type="button" data-quiz-option="${index}" aria-pressed="${isSelected}" ${
              state.locked ? 'disabled' : ''
            }>
              <span class="option-key">${letters[index] ?? index + 1}</span>
              <span class="option-text">${escapeHtml(option)}</span>
              <span class="option-mark" aria-hidden="true"></span>
            </button>`;
          })
          .join('')}
      </div>
      <div class="quiz-feedback" data-quiz-feedback role="status" ${state.locked ? '' : 'hidden'}>
        ${
          state.locked
            ? `<p class="feedback-title ${
                state.selected === question.correct ? 'is-success' : 'is-error'
              }">${
                state.selected === question.correct ? 'Bonne réponse.' : 'Pas tout à fait.'
              }</p>
              <p class="feedback-text">${question.explanation}</p>`
            : ''
        }
      </div>
      <div class="quiz-actions">
        <button class="btn btn-primary" type="button" data-quiz-action ${
          state.locked || state.selected !== null ? '' : 'disabled'
        }>
          ${
            state.locked
              ? state.index === questions.length - 1
                ? 'Voir mon score'
                : 'Question suivante'
              : 'Valider ma réponse'
          }
        </button>
      </div>
    </div>`;
  };

  content.addEventListener('click', (event) => {
    const target = event.target as Element;

    const option = target.closest<HTMLElement>('[data-quiz-option]');
    if (option && !state.locked) {
      const index = Number(option.dataset.quizOption);
      if (!Number.isNaN(index)) {
        state.selected = index;
        renderQuestion();
      }
      return;
    }

    const action = target.closest<HTMLElement>('[data-quiz-action]');
    if (action) {
      if (state.finished) return;

      if (!state.locked) {
        if (state.selected === null) return;
        state.locked = true;
        state.answers[state.index] = state.selected;
        renderQuestion();
        return;
      }

      if (state.index < questions.length - 1) {
        state.index += 1;
        state.selected = null;
        state.locked = false;
        renderQuestion();
      } else {
        state.finished = true;
        const result = score();
        recordQuiz(id, result, questions.length);
        renderResult();
      }
      return;
    }

    if (target.closest('[data-quiz-retry]')) {
      state.index = 0;
      state.selected = null;
      state.locked = false;
      state.answers = [];
      state.finished = false;
      renderQuestion();
    }
  });

  renderQuestion();
}
