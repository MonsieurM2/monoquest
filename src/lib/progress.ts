const STORAGE_KEY = 'monoquest.progress.v1';

export interface QuizResult {
  score: number;
  total: number;
  date: string;
}

export interface Progress {
  completed: string[];
  quizzes: Record<string, QuizResult>;
  lastLesson: string | null;
}

const empty = (): Progress => ({ completed: [], quizzes: {}, lastLesson: null });

export function getProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      completed: Array.isArray(parsed.completed) ? parsed.completed.filter((item) => typeof item === 'string') : [],
      quizzes: parsed.quizzes && typeof parsed.quizzes === 'object' ? parsed.quizzes : {},
      lastLesson: typeof parsed.lastLesson === 'string' ? parsed.lastLesson : null,
    };
  } catch {
    return empty();
  }
}

function save(progress: Progress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  window.dispatchEvent(new CustomEvent('progress:change'));
}

export function isComplete(slug: string): boolean {
  return getProgress().completed.includes(slug);
}

export function markComplete(slug: string, complete = true): void {
  const progress = getProgress();
  const set = new Set(progress.completed);
  if (complete) set.add(slug);
  else set.delete(slug);
  progress.completed = [...set];
  progress.lastLesson = slug;
  save(progress);
}

export function setLastLesson(slug: string): void {
  const progress = getProgress();
  if (progress.lastLesson === slug) return;
  progress.lastLesson = slug;
  save(progress);
}

export function recordQuiz(id: string, score: number, total: number): void {
  const progress = getProgress();
  const previous = progress.quizzes[id];
  if (!previous || score > previous.score) {
    progress.quizzes[id] = { score, total, date: new Date().toISOString() };
    save(progress);
  }
}

export function completedCount(slugs: string[]): number {
  const completed = new Set(getProgress().completed);
  return slugs.filter((slug) => completed.has(slug)).length;
}

export function resetProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage may be unavailable (private mode); the UI stays functional.
  }
  window.dispatchEvent(new CustomEvent('progress:change'));
}

export function nextLesson(slugs: string[]): string | null {
  const progress = getProgress();
  return slugs.find((slug) => !progress.completed.includes(slug)) ?? slugs[slugs.length - 1] ?? null;
}
