export type Tone = 'info' | 'tip' | 'warn' | 'key';

export type Block =
  | { t: 'p'; html: string }
  | { t: 'h2'; text: string }
  | { t: 'h3'; text: string }
  | { t: 'code'; code: string; lang?: string; title?: string }
  | { t: 'callout'; tone: Tone; title?: string; html: string }
  | { t: 'list'; ordered?: boolean; items: string[] }
  | { t: 'steps'; items: { title: string; html: string }[] }
  | { t: 'table'; head: string[]; rows: string[][] }
  | { t: 'image'; src: string; alt: string; caption?: string; wide?: boolean; light?: boolean }
  | { t: 'gallery'; items: { src: string; alt: string; caption?: string }[] }
  | { t: 'quote'; html: string; author?: string };

export interface QuizQuestion {
  question: string;
  code?: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface Exercise {
  title: string;
  level: 'Facile' | 'Intermédiaire' | 'Défi';
  prompt: string;
  hint?: string;
  solution?: string;
  solutionLang?: string;
}

export interface SourceLink {
  label: string;
  url: string;
}

export interface Lesson {
  slug: string;
  chapter: number;
  module: ModuleId;
  title: string;
  navTitle: string;
  description: string;
  duration: number;
  objectives: string[];
  blocks: Block[];
  quiz: QuizQuestion[];
  exercises: Exercise[];
  sources?: SourceLink[];
  bonus?: boolean;
}

export type ModuleId = 'demarrer' | 'fondations' | 'gameplay' | 'pro';

export interface CourseModule {
  id: ModuleId;
  number: string;
  title: string;
  description: string;
  accent: string;
}

export const MODULES: CourseModule[] = [
  {
    id: 'demarrer',
    number: '01',
    title: 'Démarrer',
    description: 'Comprendre MonoGame, installer les bons outils et faire tourner ta première boucle de jeu.',
    accent: 'orange',
  },
  {
    id: 'fondations',
    number: '02',
    title: 'Les fondations',
    description: 'Charger des assets, afficher des textures, construire des sprites et les animer.',
    accent: 'lime',
  },
  {
    id: 'gameplay',
    number: '03',
    title: 'Un jeu vivant',
    description: 'Entrées, collisions, tilemaps, audio, texte et scènes : ton jeu prend forme.',
    accent: 'violet',
  },
  {
    id: 'pro',
    number: '04',
    title: 'Le jeu complet',
    description: 'Interface, mécaniques du serpent, finition, shaders et publication.',
    accent: 'rose',
  },
];
