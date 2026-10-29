import { MODULES, type Lesson, type ModuleId } from './types';
import { demarrerLessons } from './modules/demarrer';
import { fondationsLessons } from './modules/fondations';
import { gameplayLessons } from './modules/gameplay';
import { proLessons } from './modules/pro';

export { MODULES };
export type { Lesson, ModuleId };

export const lessons: Lesson[] = [
  ...demarrerLessons,
  ...fondationsLessons,
  ...gameplayLessons,
  ...proLessons,
].sort((a, b) => a.chapter - b.chapter);

export const lessonSlugs = lessons.map((lesson) => lesson.slug);

export function getLesson(slug: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.slug === slug);
}

export function lessonsByModule(moduleId: ModuleId): Lesson[] {
  return lessons.filter((lesson) => lesson.module === moduleId);
}

export function getModule(id: ModuleId) {
  return MODULES.find((module) => module.id === id)!;
}

export function lessonNeighbours(slug: string): { previous: Lesson | null; next: Lesson | null } {
  const index = lessons.findIndex((lesson) => lesson.slug === slug);
  return {
    previous: index > 0 ? lessons[index - 1] : null,
    next: index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null,
  };
}

export const totalQuizQuestions = lessons.reduce((sum, lesson) => sum + lesson.quiz.length, 0);
export const totalExercises = lessons.reduce((sum, lesson) => sum + lesson.exercises.length, 0);
export const totalMinutes = lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
