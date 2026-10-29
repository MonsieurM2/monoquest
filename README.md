# MonoQuest

Site d'apprentissage du **C#** et de **MonoGame** pour débutant total, en français.
Le fil rouge est la construction de *Dungeon Slime*, le jeu 2D du tutoriel officiel
MonoGame, revisité en 20 chapitres avec quiz et exercices.

**Version vérifiée :** MonoGame 3.8.6 (26 octobre 2026), .NET 9 / 10.

## Contenu

- **20 chapitres** répartis en 4 modules : Démarrer, Fondations, Un jeu vivant, Vers la production.
- **82 questions de quiz** avec explication après chaque réponse.
- **Des exercices optionnels** avec solutions repliables à chaque chapitre.
- **Un guide C#** pour les prérequis du langage.
- **Un quiz final de 20 questions** et une page de ressources.
- Progression, scores et chapitre en cours sauvegardés dans le navigateur.
- Recherche plein cours (`Ctrl`/`Cmd` + `K`), thème sombre, responsive.

Le code C# des chapitres reprend celui du dépôt officiel
[`MonoGame/MonoGame-Samples`](https://github.com/MonoGame/MonoGame-Samples)
(`Tutorials/learn-monogame-2d`), sans modification, avec les commentaires et
explications traduits.

## Stack

Vite 8 + TypeScript strict, sans framework UI. Le HTML est généré par des
fonctions de rendu, les styles sont écrits à la main (thème sombre), la
coloration syntaxique vient de `highlight.js`.

## Développement

```bash
npm install
npm run dev        # http://127.0.0.1:5173
npm run typecheck  # vérification TypeScript
npm run build      # build de production dans dist/
npm run preview    # prévisualiser le build
```

## Structure

```
src/
  components/   rendu des pages (accueil, parcours, leçon, quiz, ressources…)
  content/code/ extraits de code C# du tutoriel officiel
  data/         contenu pédagogique : modules, chapitres, quiz, exercices
  lib/          utilitaires (DOM, progression locale)
  styles/       design system et styles des pages
  main.ts       point d'entrée et routeur
public/images/  captures et schémas du tutoriel
```

## Déploiement

Le site est publié sur GitHub Pages par GitHub Actions
([`deploy.yml`](.github/workflows/deploy.yml)). Chaque push sur `main` construit
le site et le déploie.

Le build détecte automatiquement le sous-dossier du dépôt à partir de
`GITHUB_REPOSITORY` et génère un `404.html` qui sert la coquille de
l'application, afin que les URLs propres (`/cours/...`) fonctionnent aussi au
rechargement direct.

Pour un build manuel destiné à un sous-dossier :

```bash
GITHUB_REPOSITORY=utilisateur/monogame npm run build
```

## Sources

- [Tutoriel officiel MonoGame — Building 2D games](https://docs.monogame.net/articles/tutorials/building_2d_games/index.html)
- [Notes de version MonoGame 3.8.6](https://monogame.net/blog/2026-10-26-3.8.6-release-2026/)
- [Documentation MonoGame](https://docs.monogame.net/)
