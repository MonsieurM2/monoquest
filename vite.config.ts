import { defineConfig } from 'vite';
import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

// GitHub Pages sert un dépôt à l'adresse /<nom-du-depot>/ ; en local, le site
// reste à la racine. GitHub Actions expose GITHUB_REPOSITORY (owner/repo), dont
// on déduit le sous-dossier. Un dépôt <utilisateur>.github.io reste à la racine.
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const base = repoName && !repoName.endsWith('.github.io') ? `/${repoName}/` : '/';

export default defineConfig({
  base,
  server: {
    host: '127.0.0.1',
  },
  build: {
    target: 'es2022',
    cssMinify: true,
  },
  plugins: [
    {
      name: 'spa-404-fallback',
      // GitHub Pages répond 404 sur les routes profondes (/cours/...). On sert
      // la coquille de l'application à la place pour laisser le routeur décider.
      closeBundle() {
        const dist = resolve(process.cwd(), 'dist');
        const index = resolve(dist, 'index.html');
        if (existsSync(index)) copyFileSync(index, resolve(dist, '404.html'));
      },
    },
  ],
});
