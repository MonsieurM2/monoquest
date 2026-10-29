import { icon } from '../lib/dom';

interface Resource {
  title: string;
  description: string;
  url: string;
  tag: string;
}

const official: Resource[] = [
  {
    title: 'Building 2D Games with MonoGame',
    description: 'Le tutoriel officiel dont ce parcours est l’adaptation française. Chapitres, vidéos et code source.',
    url: 'https://docs.monogame.net/articles/tutorials/building_2d_games/index.html',
    tag: 'Tutoriel',
  },
  {
    title: 'Documentation MonoGame',
    description: 'Guides, tutoriels et référence de l’API. La première source à consulter en cas de doute.',
    url: 'https://docs.monogame.net/',
    tag: 'Docs',
  },
  {
    title: 'Référence API',
    description: 'La liste exhaustive des classes, méthodes et propriétés de MonoGame.',
    url: 'https://docs.monogame.net/api/index.html',
    tag: 'API',
  },
  {
    title: 'MonoGame.Samples',
    description: 'Des projets complets et commentés, dont le code source de Dungeon Slime chapitre par chapitre.',
    url: 'https://github.com/MonoGame/MonoGame.Samples/tree/3.8.4/Tutorials/learn-monogame-2d',
    tag: 'Code',
  },
  {
    title: 'Content Builder (3.8.6)',
    description: 'La nouvelle approche code-first du pipeline de contenu, recommandée pour les nouveaux projets.',
    url: 'https://docs.monogame.net/articles/getting_started/content_pipeline/index.html',
    tag: 'Pipeline',
  },
  {
    title: 'Gum UI',
    description: 'La bibliothèque d’interface utilisée dans les derniers chapitres, avec sa documentation complète.',
    url: 'https://docs.flatredball.com/gum/code/about',
    tag: 'UI',
  },
];

const tools: Resource[] = [
  {
    title: 'Visual Studio Code',
    description: 'Éditeur léger et multiplateforme, avec C# Dev Kit pour la compilation et le débogage.',
    url: 'https://code.visualstudio.com/',
    tag: 'Éditeur',
  },
  {
    title: 'JetBrains Rider',
    description: 'IDE C# complet et très performant, gratuit pour les projets non commerciaux.',
    url: 'https://www.jetbrains.com/rider/',
    tag: 'IDE',
  },
  {
    title: 'LibreSprite',
    description: 'Éditeur de pixel art libre, idéal pour les sprites et les atlas de textures.',
    url: 'https://libresprite.github.io/',
    tag: 'Pixel art',
  },
  {
    title: 'Tiled',
    description: 'Éditeur de cartes en tuiles, parfait pour préparer les tilemaps du donjon.',
    url: 'https://www.mapeditor.org/',
    tag: 'Niveaux',
  },
  {
    title: 'jsfxr / BFXR',
    description: 'Générateurs d’effets sonores rétro pour tes sauts, collisions et collectes.',
    url: 'https://sfxr.me/',
    tag: 'Audio',
  },
  {
    title: 'Audacity',
    description: 'Édition et conversion audio libre : utile pour préparer les fichiers WAV et OGG.',
    url: 'https://www.audacityteam.org/',
    tag: 'Audio',
  },
];

const assets: Resource[] = [
  {
    title: 'Kenney Assets',
    description: 'Des milliers de sprites, tuiles, sons et interfaces libres de droits, gratuits.',
    url: 'https://kenney.nl/assets',
    tag: 'Gratuit',
  },
  {
    title: 'OpenGameArt',
    description: 'Une immense bibliothèque d’assets sous licences libres, à vérifier au cas par cas.',
    url: 'https://opengameart.org/',
    tag: 'Libre',
  },
  {
    title: 'Freesound',
    description: 'Banque de sons sous licences Creative Commons, idéale pour prototyper.',
    url: 'https://freesound.org/',
    tag: 'Sons',
  },
  {
    title: 'Google Fonts',
    description: 'Des polices libres pour créer tes SpriteFonts et ton interface.',
    url: 'https://fonts.google.com/',
    tag: 'Polices',
  },
  {
    title: 'Coolors',
    description: 'Générateur de palettes pour garder une direction artistique cohérente.',
    url: 'https://coolors.co/',
    tag: 'Couleurs',
  },
  {
    title: 'itch.io Game Assets',
    description: 'Assets gratuits et payants, souvent vendus avec une licence commerciale claire.',
    url: 'https://itch.io/game-assets/free',
    tag: 'Marketplace',
  },
];

const community: Resource[] = [
  {
    title: 'Discord MonoGame',
    description: 'Le canal le plus actif : entraide, retours et annonces de la Fondation.',
    url: 'https://discord.gg/monogame',
    tag: 'Communauté',
  },
  {
    title: 'GitHub Discussions',
    description: 'Questions techniques et discussions de fond avec les mainteneurs.',
    url: 'https://github.com/MonoGame/MonoGame/discussions',
    tag: 'Support',
  },
  {
    title: 'r/monogame',
    description: 'Partage de projets, questions de débutants et retours d’expérience.',
    url: 'https://www.reddit.com/r/monogame/',
    tag: 'Reddit',
  },
  {
    title: 'Showcase MonoGame',
    description: 'Des jeux commerciaux et amateurs réalisés avec le framework. Une bonne dose de motivation.',
    url: 'https://monogame.net/showcase/',
    tag: 'Inspiration',
  },
  {
    title: 'Apprendre C#',
    description: 'Les tutoriels officiels Microsoft pour consolider le langage.',
    url: 'https://learn.microsoft.com/fr-fr/dotnet/csharp/',
    tag: 'C#',
  },
  {
    title: 'MonoGame University',
    description: 'Les sessions live et rediffusions de la communauté MonoGame.',
    url: 'https://www.youtube.com/@MonoGameFoundation',
    tag: 'Vidéo',
  },
];

function resourceCard(resource: Resource): string {
  return `<a class="resource-card" href="${resource.url}" target="_blank" rel="noreferrer">
    <span class="resource-tag">${resource.tag}</span>
    <strong>${resource.title}</strong>
    <span class="resource-description">${resource.description}</span>
    <span class="resource-link">Ouvrir ${icon('external')}</span>
  </a>`;
}

function resourceGroup(title: string, intro: string, items: Resource[], id: string): string {
  return `<section class="resource-group" id="${id}">
    <div class="resource-group-head">
      <div>
        <p class="eyebrow">${title}</p>
        <h2>${intro}</h2>
      </div>
      <span class="resource-count">${items.length} liens</span>
    </div>
    <div class="resource-grid">${items.map(resourceCard).join('')}</div>
  </section>`;
}

export function renderResources(): string {
  return `<div class="page resources-page">
    <header class="page-hero resources-hero">
      <div class="container">
        <nav class="breadcrumb" aria-label="Fil d’Ariane">
          <a href="/" data-link>Accueil</a><span>/</span><span>Ressources</span>
        </nav>
        <p class="eyebrow">Boîte à outils</p>
        <h1>Tout ce qu’il faut pour continuer.</h1>
        <p class="page-lead">
          Documentation, outils, assets libres et communautés : une sélection courte et vérifiée
          pour apprendre, prototyper et publier tes propres jeux.
        </p>
        <div class="resource-nav">
          <a href="#officiel" class="resource-nav-link">Documentation</a>
          <a href="#outils" class="resource-nav-link">Outils</a>
          <a href="#assets" class="resource-nav-link">Assets</a>
          <a href="#communaute" class="resource-nav-link">Communauté</a>
        </div>
      </div>
    </header>

    <div class="container resources-body">
      ${resourceGroup('Officiel', 'La source de vérité.', official, 'officiel')}
      ${resourceGroup('Outils', 'Un environnement qui ne te ralentit pas.', tools, 'outils')}
      ${resourceGroup('Assets', 'De quoi habiller ton prochain jeu.', assets, 'assets')}
      ${resourceGroup('Communauté', 'Personne ne code un jeu seul.', community, 'communaute')}

      <section class="resources-next">
        <div>
          <p class="eyebrow">Après le parcours</p>
          <h2>Trois idées pour ton premier projet personnel.</h2>
        </div>
        <div class="next-ideas">
          <article>
            <span>01</span>
            <h3>Un micro-jeu en 48 h</h3>
            <p>Reprends le donjon, change les règles et publie une démo jouable. La contrainte force les décisions.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Un prototype de genre</h3>
            <p>Roguelike, plateforme, puzzle : réutilise <code>Core</code>, les scènes et l’InputManager comme base.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Un outil pour ta communauté</h3>
            <p>Un éditeur de niveaux, un visualiseur d’atlas, un générateur de tilemaps. Les outils aussi sont des jeux.</p>
          </article>
        </div>
      </section>

      <div class="resources-credit">
        <p>${icon('info')} Les liens externes s’ouvrent dans un nouvel onglet. MonoQuest n’est pas affilié aux sites listés.</p>
      </div>
    </div>
  </div>`;
}
