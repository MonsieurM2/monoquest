import { code } from '../../content/code';
import type { Lesson } from '../types';

export const fondationsLessons: Lesson[] = [
  {
    slug: 'content-pipeline',
    chapter: 5,
    module: 'fondations',
    title: 'Le Content Pipeline',
    navTitle: 'Le Content Pipeline',
    description:
      'Une image PNG n’est pas une texture. Découvre comment MonoGame compile tes assets en formats optimisés, puis charge ton premier logo.',
    duration: 25,
    objectives: [
      'Expliquer la différence entre un asset brut et un asset compilé',
      'Ouvrir l’éditeur MGCB et ajouter une image',
      'Charger une texture avec ContentManager',
      'Diagnostiquer les erreurs de chemin de contenu',
    ],
    blocks: [
      {
        t: 'p',
        html: "Ton jeu a besoin d’images, de sons et de polices. Ces fichiers sont livrés dans des formats pensés pour le stockage (PNG, OGG, TTF), pas pour le GPU. Le <strong>Content Pipeline</strong> fait la traduction : il compile chaque asset en un format que la plateforme cible comprend, puis le copie dans le dossier de sortie du jeu.",
      },
      {
        t: 'table',
        head: ['Approche', 'Ce que tu fais', 'Ce que tu obtiens'],
        rows: [
          ['Chargement direct', 'Copier le PNG et appeler <code>Texture2D.FromFile</code>', 'Simple, mais décodage à l’exécution et formats variables selon la plateforme'],
          ['Content Pipeline', 'Déclarer l’asset dans <code>Content.mgcb</code>, compiler', 'Asset optimisé, compressé, prêt pour le GPU et la plateforme'],
        ],
      },
      {
        t: 'callout',
        tone: 'key',
        title: 'Pourquoi compiler les assets ?',
        html: "Une texture compressée en PNG doit être décompressée en mémoire avant d’être envoyée au GPU. Le pipeline peut la convertir en DXT ou en d’autres formats directement lisibles par la carte graphique, ce qui réduit la mémoire et le temps de chargement. Il applique aussi les bons réglages pour la plateforme cible.",
      },
      { t: 'h2', text: 'Ouvrir l’éditeur MGCB' },
      {
        t: 'p',
        html: "L’éditeur MGCB est l’interface graphique du pipeline. Selon ton environnement, ouvre-le depuis l’extension MonoGame for VSCode (icône en haut à droite d’un fichier C#), depuis Visual Studio en double-cliquant sur <code>Content.mgcb</code>, ou en ligne de commande :",
      },
      {
        t: 'code',
        lang: 'bash',
        title: 'Terminal, à la racine du projet',
        code: `dotnet tool restore
dotnet mgcb-editor ./Content/Content.mgcb`,
      },
      {
        t: 'callout',
        tone: 'warn',
        title: 'Si l’éditeur ne s’ouvre pas',
        html: "L’outil est déclaré dans <code>.config/dotnet-tools.json</code>. <code>dotnet tool restore</code> l’installe localement. Vérifie ensuite que le fichier <code>Content.mgcb</code> existe bien dans le dossier <code>Content</code> du projet de jeu.",
      },
      {
        t: 'image',
        src: '/images/content-pipeline-workflow-full.svg',
        alt: 'Schéma du workflow du Content Pipeline : fichier brut, MGCB, fichier xnb, jeu',
        caption: 'Le pipeline transforme les fichiers bruts en assets compilés. Image : tutoriel officiel.',
        wide: true,
        light: true,
      },
      { t: 'h2', text: 'Ajouter le logo MonoGame' },
      {
        t: 'steps',
        items: [
          {
            title: 'Créer un dossier images',
            html: "Dans le panneau de gauche, fais un clic droit sur le nœud <code>Content</code>, puis <em>Add → New Folder…</em> et nomme-le <code>images</code>.",
          },
          {
            title: 'Ajouter le fichier PNG',
            html: "Télécharge le logo MonoGame (ou n’importe quelle image PNG), puis fais <em>Add → Existing File…</em> et sélectionne l’image. Elle apparaît sous <code>images/</code>.",
          },
          {
            title: 'Compiler',
            html: "Enregistre, puis lance le jeu ou construis le projet. Le fichier <code>.xnb</code> généré est copié dans <code>bin/Debug/net9.0/Content/images/</code>. C’est cet asset compilé que ton jeu chargera.",
          },
        ],
      },
      { t: 'h2', text: 'Charger l’asset dans le jeu' },
      {
        t: 'p',
        html: "Le <code>ContentManager</code> expose une méthode générique <code>Load&lt;T&gt;</code>. Le chemin est relatif au dossier <code>Content</code>, <strong>sans extension</strong>, et utilise des barres obliques vers l’avant.",
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'DungeonSlime/Game1.cs — extrait',
        code: `private Texture2D _logo;

protected override void LoadContent()
{
    _logo = Content.Load<Texture2D>("images/logo");
}

protected override void Draw(GameTime gameTime)
{
    GraphicsDevice.Clear(Color.CornflowerBlue);

    SpriteBatch.Begin();
    SpriteBatch.Draw(_logo, new Vector2(100, 100), Color.White);
    SpriteBatch.End();

    base.Draw(gameTime);
}`,
      },
      {
        t: 'p',
        html: "Trois choses à retenir sur ce code : <code>LoadContent</code> est appelé une seule fois, <code>Content.Load</code> renvoie un objet typé, et <code>SpriteBatch</code> doit être encadré par <code>Begin()</code> / <code>End()</code>. Sans <code>End()</code>, aucun sprite n’est envoyé au GPU.",
      },
      { t: 'h2', text: 'Comprendre les chemins de contenu' },
      {
        t: 'table',
        head: ['Fichier', 'Chemin à passer à Content.Load'],
        rows: [
          ['<code>Content/images/logo.png</code>', '<code>"images/logo"</code>'],
          ['<code>Content/audio/bounce.wav</code>', '<code>"audio/bounce"</code>'],
          ['<code>Content/fonts/04B_30.spritefont</code>', '<code>"fonts/04B_30"</code>'],
        ],
      },
      {
        t: 'callout',
        tone: 'warn',
        title: 'Les erreurs classiques',
        html: "« <em>Content file not found</em> » : le chemin ou le nom est faux, ou l’asset n’a pas été ajouté au <code>.mgcb</code>. « <em>Could not load asset</em> » : le fichier compilé est absent du dossier de sortie ; nettoie et reconstruis. Ne mets jamais l’extension <code>.png</code> dans <code>Content.Load</code>.",
      },
      { t: 'h2', text: 'Et le nouveau Content Builder de 3.8.6 ?' },
      {
        t: 'p',
        html: "MonoGame 3.8.6 recommande le <strong>Content Builder</strong> pour les nouveaux projets : une approche code-first où tu décris la compilation dans un projet C# dédié, sans éditeur graphique. Le tutoriel officiel conserve l’éditeur MGCB, qui reste supporté et plus simple pour apprendre. Retiens surtout le principe : les assets sont compilés avant l’exécution, pas chargés à l’aveugle depuis le disque.",
      },
      {
        t: 'p',
        html: "Dans le prochain chapitre, tu utilises ce logo pour explorer tous les paramètres de <code>SpriteBatch.Draw</code> : rotation, échelle, origine, teinte et découpe.",
      },
    ],
    quiz: [
      {
        question: 'Que fait le Content Pipeline ?',
        options: [
          'Il dessine les sprites à l’écran',
          'Il compile les assets bruts en fichiers optimisés pour la plateforme',
          'Il crée les niveaux du jeu',
          'Il gère les entrées clavier',
        ],
        correct: 1,
        explanation:
          'Le pipeline transforme PNG, WAV, TTF et autres fichiers en assets compilés (.xnb), adaptés au GPU et à la plateforme cible.',
      },
      {
        question: 'Quel chemin faut-il passer pour charger Content/images/logo.png ?',
        options: ['"Content/images/logo.png"', '"images/logo.png"', '"images/logo"', '"logo"'],
        correct: 2,
        explanation:
          'Le chemin est relatif à Content, sans extension. Le ContentManager ajoute lui-même le .xnb compilé.',
      },
      {
        question: 'Quand LoadContent est-il appelé ?',
        options: [
          'À chaque frame',
          'Une fois, pendant base.Initialize()',
          'À chaque changement de scène',
          'Uniquement quand on appelle Content.Load',
        ],
        correct: 1,
        explanation:
          'LoadContent est appelé une seule fois au démarrage, via base.Initialize(). Toute logique dépendante d’un asset doit venir après cet appel.',
      },
      {
        question: 'Que se passe-t-il si on oublie SpriteBatch.End() ?',
        options: [
          'Le jeu plante au démarrage',
          'Les sprites ne sont pas envoyés au GPU',
          'Les textures sont floues',
          'Le Content Pipeline échoue',
        ],
        correct: 1,
        explanation:
          'SpriteBatch accumule les draw calls entre Begin et End. Sans End, le lot n’est jamais soumis et rien n’apparaît.',
      },
    ],
    exercises: [
      {
        title: 'Ajouter une deuxième image',
        level: 'Facile',
        prompt:
          "Ajoute une seconde image PNG dans le dossier <code>images</code> du Content, charge-la dans une nouvelle variable et dessine-la à côté du logo.",
        hint: 'Deux appels Content.Load, deux appels SpriteBatch.Draw avec des positions différentes.',
        solution: `private Texture2D _logo;
private Texture2D _icon;

protected override void LoadContent()
{
    _logo = Content.Load<Texture2D>("images/logo");
    _icon = Content.Load<Texture2D>("images/icon");
}

protected override void Draw(GameTime gameTime)
{
    GraphicsDevice.Clear(Color.CornflowerBlue);
    SpriteBatch.Begin();
    SpriteBatch.Draw(_logo, new Vector2(100, 100), Color.White);
    SpriteBatch.Draw(_icon, new Vector2(100, 300), Color.White);
    SpriteBatch.End();
    base.Draw(gameTime);
}`,
        solutionLang: 'csharp',
      },
      {
        title: 'Provoquer une erreur de chemin',
        level: 'Intermédiaire',
        prompt:
          "Remplace volontairement le chemin par <code>\"images/logo.png\"</code>, lance le jeu et lis le message d’erreur. Que t’apprend-il ? Remets ensuite le bon chemin.",
        hint: 'L’exception indique le nom de l’asset recherché et le dossier de contenu.',
        solution:
          "MonoGame cherche un fichier compilé nommé « logo.png.xnb » ; il ne le trouve pas car le pipeline a produit « logo.xnb ». Le message ContentLoadException t’indique l’asset et la plateforme. C’est le premier réflexe à avoir devant une erreur de contenu : vérifier le chemin relatif et l’absence d’extension.",
      },
    ],
    sources: [
      {
        label: 'Chapitre 05 officiel — Content Pipeline',
        url: 'https://docs.monogame.net/articles/tutorials/building_2d_games/05_content_pipeline/index.html',
      },
      {
        label: 'Documentation du Content Pipeline',
        url: 'https://docs.monogame.net/articles/getting_started/content_pipeline/index.html',
      },
    ],
  },
  {
    slug: 'textures',
    chapter: 6,
    module: 'fondations',
    title: 'Afficher et transformer des textures',
    navTitle: 'Afficher des textures',
    description:
      'Position, rotation, origine, échelle, miroir, teinte, transparence et découpe : maîtrise les neuf paramètres de SpriteBatch.Draw.',
    duration: 30,
    objectives: [
      'Dessiner une texture avec SpriteBatch',
      'Comprendre l’origine et la rotation en radians',
      'Appliquer une échelle, une teinte et un effet miroir',
      'Découper une zone avec sourceRectangle',
    ],
    blocks: [
      {
        t: 'p',
        html: "Dans le chapitre précédent, tu as affiché un logo à une position fixe. <code>SpriteBatch.Draw</code> accepte bien plus de paramètres : de quoi faire pivoter, redimensionner, retourner, teinter ou découper un sprite sans modifier l’image source.",
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'La surcharge complète de SpriteBatch.Draw',
        code: `SpriteBatch.Draw(
    texture,             // Texture2D
    position,            // Vector2 : position à l'écran
    sourceRectangle,     // Rectangle? : zone de la texture (null = tout)
    color,               // Color : teinte et transparence
    rotation,            // float : angle en radians
    origin,              // Vector2 : pivot local
    scale,               // Vector2 ou float
    effects,             // SpriteEffects.None / FlipHorizontally / FlipVertically
    layerDepth           // float : 0 (devant) à 1 (derrière)
);`,
      },
      { t: 'h2', text: 'La rotation et l’origine' },
      {
        t: 'p',
        html: "La rotation est exprimée en <strong>radians</strong>, pas en degrés. Utilise <code>MathHelper.ToRadians(45)</code> pour rester lisible. L’<code>origin</code> est le point autour duquel le sprite tourne et se redimensionne ; il est exprimé dans les coordonnées locales de la texture.",
      },
      {
        t: 'code',
        lang: 'csharp',
        code: `// Tourner autour du centre du sprite.
Vector2 origin = new Vector2(_logo.Width / 2f, _logo.Height / 2f);

SpriteBatch.Draw(
    _logo,
    new Vector2(640, 360),
    null,
    Color.White,
    MathHelper.ToRadians(45),
    origin,
    1f,
    SpriteEffects.None,
    0f
);`,
      },
      {
        t: 'p',
        html: "Avec <code>origin = Vector2.Zero</code>, la rotation se fait autour du coin supérieur gauche et le sprite semble se déplacer. Avec l’origine au centre, il tourne sur lui-même. C’est l’erreur numéro un des débutants en 2D.",
      },
      {
        t: 'gallery',
        items: [
          {
            src: '/images/logo-rotated-centered.png',
            alt: 'Logo MonoGame tourné autour de son centre',
            caption: 'Origine au centre : rotation propre.',
          },
          {
            src: '/images/logo-texture-regions.png',
            alt: 'Découpage du logo MonoGame en régions',
            caption: 'Découpage avec sourceRectangle.',
          },
        ],
      },
      { t: 'h2', text: 'Échelle, miroir et profondeur' },
      {
        t: 'list',
        items: [
          "<strong>Échelle</strong> : <code>1f</code> = taille originale, <code>2f</code> = deux fois plus grand. Un <code>Vector2</code> permet d’étirer horizontalement et verticalement différemment.",
          "<strong>Miroir</strong> : <code>SpriteEffects.FlipHorizontally</code> ou <code>FlipVertically</code>. Les deux se combinent avec l’opérateur <code>|</code>.",
          "<strong>Profondeur</strong> : <code>layerDepth</code> n’a d’effet qu’avec <code>SpriteSortMode.FrontToBack</code> (ou <code>BackToFront</code>) dans <code>Begin</code>. Sinon, l’ordre des appels décide.",
        ],
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'Combiner les transformations',
        code: `SpriteBatch.Begin(
    sortMode: SpriteSortMode.FrontToBack,
    samplerState: SamplerState.PointClamp
);

// Grand, retourné horizontalement, teinté en vert, au premier plan.
SpriteBatch.Draw(
    _logo,
    new Vector2(200, 300),
    null,
    Color.LightGreen,
    0f,
    Vector2.Zero,
    new Vector2(2f, 2f),
    SpriteEffects.FlipHorizontally,
    0.1f
);

SpriteBatch.End();`,
      },
      { t: 'h2', text: 'Teinte et transparence' },
      {
        t: 'p',
        html: "Le paramètre <code>color</code> multiplie chaque canal de la texture. <code>Color.White</code> ne change rien ; <code>Color.Red</code> ne garde que le canal rouge ; <code>Color.White * 0.5f</code> rend le sprite à moitié transparent. Attention : la multiplication assombrit aussi les zones déjà sombres.",
      },
      {
        t: 'code',
        lang: 'csharp',
        code: `// 50 % de transparence
Color halfTransparent = Color.White * 0.5f;

// Teinte verte
SpriteBatch.Draw(_logo, new Vector2(100, 100), Color.LightGreen);

// Dégradé de rouge vers transparent (fade out)
float alpha = 1.0f - (float)gameTime.TotalGameTime.TotalSeconds % 1.0f;
SpriteBatch.Draw(_logo, new Vector2(100, 300), Color.White * alpha);`,
      },
      { t: 'h2', text: 'Découper une zone de la texture' },
      {
        t: 'p',
        html: "Le <code>sourceRectangle</code> sélectionne une sous-zone de la texture. C’est la base des atlas et des animations : une seule image contient plusieurs sprites, et on dessine la région voulue. Le code ci-dessous reproduit l’exemple du tutoriel avec l’icône et le texte du logo, dessinés séparément depuis le même fichier.",
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'Deux régions d’une même texture',
        code: `Rectangle iconRegion = new Rectangle(0, 0, 128, 128);
Rectangle wordmarkRegion = new Rectangle(150, 34, 458, 58);

SpriteBatch.Begin(samplerState: SamplerState.PointClamp);

SpriteBatch.Draw(
    _logo,
    new Vector2(640, 280),
    iconRegion,
    Color.White,
    0f,
    new Vector2(iconRegion.Width / 2f, iconRegion.Height / 2f),
    1f,
    SpriteEffects.None,
    0f
);

SpriteBatch.Draw(
    _logo,
    new Vector2(640, 400),
    wordmarkRegion,
    Color.White,
    0f,
    new Vector2(wordmarkRegion.Width / 2f, wordmarkRegion.Height / 2f),
    1f,
    SpriteEffects.None,
    0f
);

SpriteBatch.End();`,
      },
      {
        t: 'callout',
        tone: 'tip',
        title: 'Pixel art : PointClamp',
        html: "Avec <code>SamplerState.LinearClamp</code>, les pixels sont interpolés et le pixel art devient flou. Utilise <code>SamplerState.PointClamp</code> pour un rendu net quand tu agrandis une texture.",
      },
      {
        t: 'p',
        html: "Tu sais maintenant dessiner et transformer une texture. Mais gérer des dizaines de fichiers séparés provoque des changements de texture coûteux. Le prochain chapitre introduit l’atlas de textures.",
      },
    ],
    quiz: [
      {
        question: 'En quelles unités la rotation est-elle exprimée dans SpriteBatch.Draw ?',
        options: ['En degrés', 'En radians', 'En pixels', 'En pourcentage'],
        correct: 1,
        explanation:
          'MonoGame attend des radians. MathHelper.ToRadians(degrees) effectue la conversion.',
      },
      {
        question: 'À quoi sert le paramètre origin ?',
        options: [
          'À positionner le sprite à l’écran',
          'À définir le point de pivot pour la rotation et l’échelle',
          'À choisir la zone de texture',
          'À définir la transparence',
        ],
        correct: 1,
        explanation:
          'Origin est le pivot local. Le placer au centre fait tourner le sprite sur lui-même ; le laisser à zéro fait tourner autour du coin supérieur gauche.',
      },
      {
        question: 'Quel effet produit Color.White * 0.5f ?',
        options: ['Un sprite deux fois plus grand', 'Un sprite à moitié transparent', 'Un sprite noir', 'Un sprite retourné'],
        correct: 1,
        explanation:
          'La composante alpha est réduite à 50 %. La texture est dessinée à demi-transparence.',
      },
      {
        question: 'Quand layerDepth influence-t-il l’ordre de dessin ?',
        options: [
          'Toujours',
          'Avec SpriteSortMode.FrontToBack ou BackToFront',
          'Uniquement avec PointClamp',
          'Uniquement pour les textures supérieures à 128 px',
        ],
        correct: 1,
        explanation:
          'Sans mode de tri, les sprites sont dessinés dans l’ordre des appels. Le layerDepth n’est pris en compte qu’avec un SpriteSortMode adapté.',
      },
      {
        question: 'Que fait sourceRectangle ?',
        options: [
          'Il déplace le sprite',
          'Il sélectionne une sous-zone de la texture à dessiner',
          'Il applique une rotation',
          'Il crée une copie de la texture',
        ],
        correct: 1,
        explanation:
          'SourceRectangle limite le dessin à un rectangle de la texture. C’est le mécanisme utilisé par les atlas et les animations.',
      },
    ],
    exercises: [
      {
        title: 'Faire tourner le logo',
        level: 'Facile',
        prompt:
          "Fais tourner le logo de 30° autour de son centre, puis de 90°. Compare avec une origine à <code>Vector2.Zero</code>.",
        hint: 'MathHelper.ToRadians convertit les degrés. L’origine se calcule à partir de la taille de la texture.',
        solution: `Vector2 origin = new Vector2(_logo.Width / 2f, _logo.Height / 2f);

SpriteBatch.Draw(
    _logo,
    new Vector2(640, 360),
    null,
    Color.White,
    MathHelper.ToRadians(30),
    origin,
    1f,
    SpriteEffects.None,
    0f
);`,
        solutionLang: 'csharp',
      },
      {
        title: 'Un miroir qui pulse',
        level: 'Intermédiaire',
        prompt:
          "Dessine le logo retourné horizontalement, avec une échelle qui oscille entre 0,8 et 1,2 en utilisant le temps de jeu.",
        hint: 'Math.Sin(gameTime.TotalGameTime.TotalSeconds) oscille entre -1 et 1. Pense à ajouter 1 puis à diviser par 2 pour obtenir 0..1.',
        solution: `float pulse = 1.0f + 0.2f * (float)Math.Sin(gameTime.TotalGameTime.TotalSeconds);

SpriteBatch.Draw(
    _logo,
    new Vector2(640, 360),
    null,
    Color.White,
    0f,
    new Vector2(_logo.Width / 2f, _logo.Height / 2f),
    pulse,
    SpriteEffects.FlipHorizontally,
    0f
);`,
        solutionLang: 'csharp',
      },
      {
        title: 'Un fondu au démarrage',
        level: 'Défi',
        prompt:
          "Fais apparaître le logo progressivement pendant les deux premières secondes du jeu, puis maintiens-le opaque.",
        hint: 'TotalGameTime.TotalSeconds divisé par 2, limité à 1 avec MathHelper.Clamp.',
        solution: `float alpha = MathHelper.Clamp((float)gameTime.TotalGameTime.TotalSeconds / 2f, 0f, 1f);
SpriteBatch.Draw(_logo, new Vector2(100, 100), Color.White * alpha);`,
        solutionLang: 'csharp',
      },
    ],
    sources: [
      {
        label: 'Chapitre 06 officiel — Working with Textures',
        url: 'https://docs.monogame.net/articles/tutorials/building_2d_games/06_working_with_textures/index.html',
      },
      {
        label: 'Référence SpriteBatch.Draw',
        url: 'https://docs.monogame.net/api/Microsoft.Xna.Framework.Graphics.SpriteBatch.html',
      },
    ],
  },
  {
    slug: 'atlas',
    chapter: 7,
    module: 'fondations',
    title: 'Atlas de textures et TextureRegion',
    navTitle: 'Atlas de textures',
    description:
      'Réduis les changements de texture et organise tes images : construis un atlas, une classe TextureRegion et un chargeur XML réutilisable.',
    duration: 35,
    objectives: [
      'Expliquer ce qu’est un texture swap et pourquoi il coûte cher',
      'Décrire un atlas de textures et ses régions',
      'Lire une définition d’atlas depuis un fichier XML',
      'Dessiner une région avec TextureRegion',
    ],
    blocks: [
      {
        t: 'p',
        html: "Chaque fois que <code>SpriteBatch.Draw</code> change de texture, le GPU doit délier la texture courante et en lier une nouvelle : c’est un <strong>texture swap</strong>. Un swap isolé est négligeable ; des centaines par frame deviennent un vrai problème.",
      },
      {
        t: 'p',
        html: "La solution classique est l’<strong>atlas de textures</strong> : une seule grande image qui contient plusieurs sprites. On dessine une sous-zone grâce à <code>sourceRectangle</code>. Plus de swap entre le slime et la chauve-souris, moins de mémoire, un seul asset à gérer.",
      },
      {
        t: 'image',
        src: '/images/atlas.png',
        alt: 'Atlas de textures contenant les sprites du slime et de la chauve-souris',
        caption: 'L’atlas du tutoriel : slime et chauve-souris dans une seule texture de 60 × 40 pixels.',
        wide: false,
      },
      {
        t: 'image',
        src: '/images/pong-atlas.png',
        alt: 'Exemple d’atlas Pong avec la raquette et la balle',
        caption: 'Un atlas Pong : deux sprites, une seule texture. Image : tutoriel officiel.',
      },
      { t: 'h2', text: 'Décrire les régions en XML' },
      {
        t: 'p',
        html: "Le tutoriel stocke la description de l’atlas dans un fichier XML, chargé au démarrage. Chaque région a un nom et un rectangle source. Les animations seront ajoutées dans le chapitre suivant.",
      },
      {
        t: 'code',
        lang: 'xml',
        title: 'Content/images/atlas-definition.xml',
        code: `<?xml version="1.0" encoding="utf-8"?>
<TextureAtlas>
    <Texture>images/atlas</Texture>
    <Regions>
        <Region name="slime" x="0" y="0" width="20" height="20" />
        <Region name="bat" x="20" y="0" width="20" height="20" />
    </Regions>
</TextureAtlas>`,
      },
      {
        t: 'callout',
        tone: 'info',
        title: 'Pourquoi du XML ?',
        html: "Ce format est lisible, éditable à la main et facile à parser avec <code>System.Xml.Linq</code>. Il sépare les données de niveau de la logique du jeu. Pour un gros projet, un éditeur d’atlas génère ce fichier automatiquement.",
      },
      { t: 'h2', text: 'La classe TextureRegion' },
      {
        t: 'p',
        html: "Une région, c’est une texture + un rectangle source + des méthodes de dessin pratiques. Ajoute <code>TextureRegion.cs</code> dans le dossier <code>Graphics</code> de <code>MonoGameLibrary</code>.",
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'MonoGameLibrary/Graphics/TextureRegion.cs',
        code: code.textureRegion,
      },
      {
        t: 'p',
        html: "Les propriétés <code>Width</code> et <code>Height</code> sont calculées depuis <code>SourceRectangle</code>. Les trois surcharges de <code>Draw</code> fournissent des valeurs par défaut, puis délèguent toutes à l’appel complet de <code>SpriteBatch.Draw</code>. C’est un bon exemple de surcharge utilitaire : simple par défaut, précis si besoin.",
      },
      { t: 'h2', text: 'La classe TextureAtlas' },
      {
        t: 'p',
        html: "Le chargeur lit le XML, charge la texture une seule fois, puis construit les régions et les animations. Il expose <code>GetRegion(name)</code>, <code>CreateSprite(name)</code> et <code>CreateAnimatedSprite(name)</code>.",
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'Extrait de TextureAtlas.cs',
        code: `public static TextureAtlas FromFile(ContentManager content, string fileName)
{
    // Charge le XML et la texture référencée.
    // Construit un dictionnaire de TextureRegion.
    // Construit un dictionnaire d'Animation.
}

public TextureRegion GetRegion(string name)
{
    return _regions[name];
}`,
      },
      {
        t: 'p',
        html: "Dans le jeu, l’utilisation devient très courte :",
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'DungeonSlime/Game1.cs — extrait',
        code: `private TextureRegion _slime;
private TextureRegion _bat;

protected override void LoadContent()
{
    TextureAtlas atlas = TextureAtlas.FromFile(Content, "images/atlas-definition.xml");
    _slime = atlas.GetRegion("slime");
    _bat = atlas.GetRegion("bat");
}

protected override void Draw(GameTime gameTime)
{
    GraphicsDevice.Clear(Color.CornflowerBlue);
    SpriteBatch.Begin(samplerState: SamplerState.PointClamp);

    _slime.Draw(SpriteBatch, Vector2.Zero, Color.White, 0.0f, Vector2.One, 4.0f, SpriteEffects.None, 0.0f);
    _bat.Draw(SpriteBatch, new Vector2(_slime.Width * 4.0f + 10, 0), Color.White, 0.0f, Vector2.One, 4.0f, SpriteEffects.None, 1.0f);

    SpriteBatch.End();
    base.Draw(gameTime);
}`,
      },
      {
        t: 'callout',
        tone: 'tip',
        title: 'L’atlas ne fait pas tout',
        html: "Un atlas réduit les swaps, mais si tes sprites viennent de plusieurs atlas, tu retrouveras le problème. Regroupe les éléments dessinés ensemble (personnage, ennemis, tuiles) dans une même texture.",
      },
    ],
    quiz: [
      {
        question: 'Qu’est-ce qu’un texture swap ?',
        options: [
          'Un échange de fichiers entre deux dossiers',
          'Le remplacement de la texture liée au GPU lors d’un draw',
          'Une compression de texture',
          'Un changement de résolution',
        ],
        correct: 1,
        explanation:
          'Le GPU doit délier une texture et en lier une autre. Répété des centaines de fois par frame, cela coûte cher.',
      },
      {
        question: 'Quel est l’avantage principal d’un atlas ?',
        options: [
          'Il augmente la résolution',
          'Il réduit les swaps et simplifie la gestion des assets',
          'Il remplace le Content Pipeline',
          'Il supprime le besoin de SpriteBatch',
        ],
        correct: 1,
        explanation:
          'Une seule texture est liée pour plusieurs sprites, ce qui réduit les changements d’état et la mémoire.',
      },
      {
        question: 'Que contient une TextureRegion ?',
        options: [
          'Une texture et un rectangle source',
          'Uniquement une position',
          'Une animation complète',
          'Un fichier XML',
        ],
        correct: 0,
        explanation:
          'TextureRegion encapsule la texture et la zone à dessiner, plus des méthodes de dessin.',
      },
      {
        question: 'Pourquoi le chemin de texture dans le XML est-il « images/atlas » ?',
        options: [
          'Parce que c’est un chemin relatif au dossier Content, sans extension',
          'Parce que le XML ne supporte pas les extensions',
          'Parce que le fichier est dans le dossier du projet',
          'Parce que MonoGame ajoute automatiquement .png',
        ],
        correct: 0,
        explanation:
          'Le ContentManager résout les chemins relativement à Content et ajoute l’extension compilée .xnb.',
      },
    ],
    exercises: [
      {
        title: 'Ajouter une région',
        level: 'Facile',
        prompt:
          "Ajoute une région <code>slime-alt</code> dans le XML qui pointe vers la seconde frame du slime (x=0, y=20, 20×20), puis dessine-la à côté de la première.",
        hint: 'Une ligne XML suffit ; récupère ensuite la région avec GetRegion.',
        solution: `<Region name="slime-alt" x="0" y="20" width="20" height="20" />

// C# :
TextureRegion slimeAlt = atlas.GetRegion("slime-alt");
slimeAlt.Draw(SpriteBatch, new Vector2(100, 0), Color.White);`,
        solutionLang: 'csharp',
      },
      {
        title: 'Calculer une région',
        level: 'Intermédiaire',
        prompt:
          "Tu as une grille de 4 colonnes et 3 lignes de tuiles de 32 × 32 pixels. Écris une fonction qui retourne le rectangle source de la tuile (colonne, ligne).",
        hint: 'x = colonne × largeur, y = ligne × hauteur.',
        solution: `public static Rectangle GetTileRegion(int column, int row, int tileSize = 32)
{
    return new Rectangle(column * tileSize, row * tileSize, tileSize, tileSize);
}`,
        solutionLang: 'csharp',
      },
      {
        title: 'Mesurer l’intérêt',
        level: 'Défi',
        prompt:
          "Tu dessines 1 000 sprites alternant entre 5 textures séparées. Combien de texture swaps au maximum ? Combien avec un atlas unique ? Explique la différence.",
        hint: 'Un swap a lieu quand la texture change par rapport au draw précédent.',
        solution:
          "Sans atlas, l’alternance peut provoquer jusqu’à 999 swaps (presque un par draw). Avec un atlas unique, il y a un seul liage de texture pour tout le lot, donc zéro swap entre les sprites. C’est pour cela que l’ordre de dessin et le regroupement des assets comptent.",
      },
    ],
    sources: [
      {
        label: 'Chapitre 07 officiel — Optimizing Texture Rendering',
        url: 'https://docs.monogame.net/articles/tutorials/building_2d_games/07_optimizing_texture_rendering/index.html',
      },
    ],
  },
  {
    slug: 'sprite-animation',
    chapter: 8,
    module: 'fondations',
    title: 'Sprite et AnimatedSprite',
    navTitle: 'Sprite et animation',
    description:
      'Encapsule texture, position, rotation et échelle dans une classe Sprite, puis ajoute des animations image par image avec AnimatedSprite.',
    duration: 40,
    objectives: [
      'Créer une classe Sprite réutilisable',
      'Comprendre les propriétés de rendu propres à chaque sprite',
      'Animer une suite de frames avec un délai',
      'Créer des sprites et animations depuis un atlas',
    ],
    blocks: [
      {
        t: 'p',
        html: "Jusqu’ici, tu dessinais des régions avec des paramètres éparpillés. Un sprite, c’est la même idée, mais regroupée : une région + une position + une couleur + une rotation + une origine + une échelle + des effets + une profondeur. Une seule classe, des dizaines d’instances.",
      },
      { t: 'h2', text: 'La classe Sprite' },
      {
        t: 'code',
        lang: 'csharp',
        title: 'MonoGameLibrary/Graphics/Sprite.cs',
        code: code.sprite,
      },
      {
        t: 'p',
        html: "Les propriétés reprennent les paramètres de <code>SpriteBatch.Draw</code> avec les mêmes valeurs par défaut : <code>Color.White</code>, rotation 0, origine <code>Vector2.Zero</code>, échelle <code>Vector2.One</code>, aucun effet, profondeur 0. <code>Width</code> et <code>Height</code> tiennent compte de l’échelle, ce qui évite de recalculer à la main.",
      },
      {
        t: 'callout',
        tone: 'tip',
        title: 'Pourquoi Width tient compte de l’échelle ?',
        html: "Parce que <code>_region.Width * Scale.X</code> donne la taille réelle à l’écran. Cela simplifie le positionnement, les collisions et le centrage : on manipule une seule valeur, déjà mise à l’échelle.",
      },
      { t: 'h2', text: 'Animation : frames et délai' },
      {
        t: 'p',
        html: "Une animation est une liste ordonnée de régions et un délai entre chaque frame. Le délai est un <code>TimeSpan</code>, ce qui permet de l’exprimer en millisecondes.",
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'MonoGameLibrary/Graphics/Animation.cs',
        code: code.animation,
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'MonoGameLibrary/Graphics/AnimatedSprite.cs',
        code: code.animatedSprite,
      },
      {
        t: 'p',
        html: "<code>AnimatedSprite</code> dérive de <code>Sprite</code> et remplace sa région à chaque frame. Le minuteur accumule le temps écoulé ; quand il dépasse le délai, on avance d’une frame et on reboucle à zéro. C’est une animation indépendante du framerate : elle utilise le <code>GameTime</code>, pas un compteur de frames.",
      },
      { t: 'h2', text: 'Définir les animations dans l’atlas' },
      {
        t: 'code',
        lang: 'xml',
        title: 'atlas-definition.xml — régions et animations',
        code: `<TextureAtlas>
    <Texture>images/atlas</Texture>
    <Regions>
        <Region name="slime-1" x="0"  y="0"  width="20" height="20" />
        <Region name="slime-2" x="0"  y="20" width="20" height="20" />
        <Region name="bat-1"   x="20" y="0"  width="20" height="20" />
        <Region name="bat-2"   x="20" y="20" width="20" height="20" />
        <Region name="bat-3"   x="40" y="0"  width="20" height="20" />
    </Regions>
    <Animations>
        <Animation name="slime-animation" delay="200">
            <Frame region="slime-1" />
            <Frame region="slime-2" />
        </Animation>
        <Animation name="bat-animation" delay="200">
            <Frame region="bat-1" />
            <Frame region="bat-2" />
            <Frame region="bat-1" />
            <Frame region="bat-3" />
        </Animation>
    </Animations>
</TextureAtlas>`,
      },
      {
        t: 'image',
        src: '/images/bat-animation-example.gif',
        alt: 'Animation de la chauve-souris du tutoriel MonoGame',
        caption: 'La chauve-souris : quatre frames, un délai de 200 ms. Image : tutoriel officiel.',
      },
      { t: 'h2', text: 'Utiliser les classes dans le jeu' },
      {
        t: 'code',
        lang: 'csharp',
        title: 'DungeonSlime/Game1.cs — extrait',
        code: code.game1_09,
      },
      {
        t: 'callout',
        tone: 'info',
        title: 'Un seul sprite, plusieurs instances',
        html: "Une <code>AnimatedSprite</code> décrit comment dessiner <em>un</em> objet. Pour dix slimes, crée dix instances et partage la même <code>Animation</code> et les mêmes <code>TextureRegion</code> : les données de texture restent communes, l’état d’animation est propre à chaque instance.",
      },
      {
        t: 'p',
        html: "Le slime et la chauve-souris s’animent maintenant. Dans le prochain chapitre, tu prends le contrôle : clavier, souris et manette.",
      },
    ],
    quiz: [
      {
        question: 'Que contient une Animation ?',
        options: [
          'Une liste de frames et un délai',
          'Une texture et une position',
          'Un SpriteBatch et un GraphicsDevice',
          'Un fichier XML uniquement',
        ],
        correct: 0,
        explanation:
          'Animation.Frames est la liste ordonnée des TextureRegion, Animation.Delay le temps entre deux frames.',
      },
      {
        question: 'Pourquoi AnimatedSprite utilise-t-il gameTime.ElapsedGameTime ?',
        options: [
          'Pour connaître la position de la souris',
          'Pour que l’animation avance en temps réel, indépendamment du framerate',
          'Pour limiter le jeu à 60 FPS',
          'Pour charger les textures',
        ],
        correct: 1,
        explanation:
          'Le temps écoulé permet de déclencher les frames à intervalle régulier, même si le nombre de frames par seconde varie.',
      },
      {
        question: 'Que fait la propriété Width d’un Sprite ?',
        options: [
          'Elle retourne la largeur de la région sans échelle',
          'Elle retourne la largeur de la région multipliée par l’échelle',
          'Elle retourne la largeur de la fenêtre',
          'Elle dessine le sprite',
        ],
        correct: 1,
        explanation:
          'Width vaut _region.Width * Scale.X. C’est la largeur réelle à l’écran, utile pour le positionnement et les collisions.',
      },
      {
        question: 'Comment partager une animation entre plusieurs ennemis ?',
        options: [
          'Créer une animation différente pour chaque ennemi',
          'Partager la même Animation et créer plusieurs AnimatedSprite',
          'Utiliser un seul sprite pour tous les ennemis',
          'Recharger l’atlas pour chaque ennemi',
        ],
        correct: 1,
        explanation:
          'L’Animation et les régions sont des données immuables partageables. Chaque AnimatedSprite conserve sa propre frame courante et son propre minuteur.',
      },
    ],
    exercises: [
      {
        title: 'Créer un sprite statique',
        level: 'Facile',
        prompt:
          "Charge la région <code>slime-1</code> depuis l’atlas, crée un <code>Sprite</code>, place-le au centre de l’écran et dessine-le à l’échelle 4.",
        hint: 'TextureAtlas.CreateSprite("slime-1") ou new Sprite(atlas.GetRegion("slime-1")).',
        solution: `Sprite slime = atlas.CreateSprite("slime-1");
slime.Scale = new Vector2(4f, 4f);
slime.Position = new Vector2(
    (GraphicsDevice.PresentationParameters.BackBufferWidth - slime.Width) / 2f,
    (GraphicsDevice.PresentationParameters.BackBufferHeight - slime.Height) / 2f
);

// Dans Draw :
SpriteBatch.Begin(samplerState: SamplerState.PointClamp);
slime.Draw(SpriteBatch);
SpriteBatch.End();`,
        solutionLang: 'csharp',
      },
      {
        title: 'Accélérer une animation',
        level: 'Intermédiaire',
        prompt:
          "Modifie le délai de l’animation du slime pour qu’elle tourne deux fois plus vite, sans changer le XML.",
        hint: 'Animation.Delay est une propriété publique en lecture/écriture.',
        solution: `AnimatedSprite slime = atlas.CreateAnimatedSprite("slime-animation");
slime.Animation.Delay = TimeSpan.FromMilliseconds(100);`,
        solutionLang: 'csharp',
      },
      {
        title: 'Animation en ping-pong',
        level: 'Défi',
        prompt:
          "Modifie AnimatedSprite pour que l’animation fasse l’aller-retour (1, 2, 3, 2, 1…) au lieu de reboucler brutalement.",
        hint: 'Ajoute une variable de direction (_direction = 1 ou -1) et inverse-la aux extrémités.',
        solution: `private int _direction = 1;

public void Update(GameTime gameTime)
{
    _elapsed += gameTime.ElapsedGameTime;
    if (_elapsed < _animation.Delay) return;

    _elapsed -= _animation.Delay;
    _currentFrame += _direction;

    if (_currentFrame >= _animation.Frames.Count - 1)
    {
        _currentFrame = _animation.Frames.Count - 1;
        _direction = -1;
    }
    else if (_currentFrame <= 0)
    {
        _currentFrame = 0;
        _direction = 1;
    }

    Region = _animation.Frames[_currentFrame];
}`,
        solutionLang: 'csharp',
      },
    ],
    sources: [
      {
        label: 'Chapitre 08 officiel — The Sprite Class',
        url: 'https://docs.monogame.net/articles/tutorials/building_2d_games/08_the_sprite_class/index.html',
      },
      {
        label: 'Chapitre 09 officiel — The AnimatedSprite Class',
        url: 'https://docs.monogame.net/articles/tutorials/building_2d_games/09_the_animatedsprite_class/index.html',
      },
    ],
  },
  {
    slug: 'entrees',
    chapter: 9,
    module: 'fondations',
    title: 'Clavier, souris et manette',
    navTitle: 'Clavier, souris et manette',
    description:
      'Lire l’état des périphériques, distinguer un appui maintenu d’une impulsion, et concevoir un petit buffer pour ne rien rater.',
    duration: 35,
    objectives: [
      'Lire KeyboardState, MouseState et GamePadState',
      'Détecter un appui, un maintien et un relâchement',
      'Normaliser un déplacement diagonal',
      'Comprendre l’intérêt d’un buffer d’entrées',
    ],
    blocks: [
      {
        t: 'p',
        html: "MonoGame n’envoie pas d’événements « touche pressée » à ton jeu. Tu interroges l’état des périphériques à chaque frame. Cette approche est simple et prévisible, mais elle a une conséquence : si tu ne compares pas l’état courant au précédent, tu ne peux pas distinguer un appui unique d’une touche maintenue.",
      },
      { t: 'h2', text: 'Clavier' },
      {
        t: 'code',
        lang: 'csharp',
        code: `KeyboardState keyboard = Keyboard.GetState();

if (keyboard.IsKeyDown(Keys.Space))
{
    // Vrai à chaque frame tant que la touche est enfoncée.
}

if (keyboard.IsKeyUp(Keys.Escape))
{
    // Vrai quand la touche n'est pas enfoncée.
}

Keys[] pressed = keyboard.GetPressedKeys();`,
      },
      {
        t: 'p',
        html: "Pour détecter une impulsion, conserve l’état de la frame précédente :",
      },
      {
        t: 'code',
        lang: 'csharp',
        code: `private KeyboardState _previousKeyboard;

protected override void Update(GameTime gameTime)
{
    KeyboardState current = Keyboard.GetState();

    bool jumpPressed = current.IsKeyDown(Keys.Space)
                    && _previousKeyboard.IsKeyUp(Keys.Space);

    if (jumpPressed)
    {
        Jump();
    }

    _previousKeyboard = current;
    base.Update(gameTime);
}`,
      },
      {
        t: 'callout',
        tone: 'warn',
        title: 'L’ordre compte',
        html: "Mets à jour <code>_previousKeyboard</code> à la fin de <code>Update</code>, après toutes tes vérifications. Si tu le fais au début, tu écrases l’état précédent avant de pouvoir le comparer.",
      },
      { t: 'h2', text: 'Souris' },
      {
        t: 'code',
        lang: 'csharp',
        code: `MouseState mouse = Mouse.GetState();

Point position = mouse.Position;
bool leftDown = mouse.LeftButton == ButtonState.Pressed;
bool rightClicked = mouse.RightButton == ButtonState.Pressed
                    && _previousMouse.RightButton == ButtonState.Released;
int wheel = mouse.ScrollWheelValue; // delta cumulé

_previousMouse = mouse;`,
      },
      {
        t: 'p',
        html: "Pour dessiner un curseur personnalisé, masque celui du système avec <code>IsMouseVisible = false</code> dans le constructeur, puis dessine un sprite à <code>mouse.Position</code>. Pense à rétablir le curseur dans les menus si nécessaire.",
      },
      { t: 'h2', text: 'Manette' },
      {
        t: 'code',
        lang: 'csharp',
        code: `GamePadState gamePad = GamePad.GetState(PlayerIndex.One);

if (!gamePad.IsConnected)
{
    return;
}

if (gamePad.IsButtonDown(Buttons.A))
{
    // Bouton A maintenu.
}

Vector2 stick = gamePad.ThumbSticks.Left;
float trigger = gamePad.Triggers.Right;

// Retour haptique : moteur gauche et droit, de 0 à 1.
GamePad.SetVibration(PlayerIndex.One, 0.6f, 0.6f);`,
      },
      {
        t: 'p',
        html: "Le stick gauche renvoie un <code>Vector2</code> analogique entre -1 et 1. Pour un déplacement, inverse l’axe Y si ton repère écran descend : <code>position.Y -= stick.Y * speed</code>. Applique un <strong>deadzone</strong> pour ignorer les petites valeurs parasites :",
      },
      {
        t: 'code',
        lang: 'csharp',
        code: `Vector2 stick = gamePad.ThumbSticks.Left;

if (stick.Length() < 0.2f)
{
    stick = Vector2.Zero;
}

if (stick != Vector2.Zero)
{
    stick.Normalize();
    _position += stick * speed * deltaTime;
}`,
      },
      {
        t: 'callout',
        tone: 'key',
        title: 'Normaliser le diagonal',
        html: "Si tu ajoutes séparément X et Y pour les touches gauche/droite et haut/bas, un déplacement diagonal sera environ 1,41 fois plus rapide. Normalise le vecteur de direction avant de le multiplier par la vitesse.",
      },
      { t: 'h2', text: 'Le buffer d’entrées' },
      {
        t: 'p',
        html: "Un buffer stocke les actions pressées récemment, avec une durée de vie. Il rend le jeu plus tolérant : si le joueur appuie sur « sauter » quelques millisecondes avant d’atterrir, l’action est mémorisée et déclenchée au bon moment. C’est un détail qui transforme le ressenti d’un jeu de plateforme.",
      },
      {
        t: 'code',
        lang: 'csharp',
        code: `private readonly Queue<(Keys Key, TimeSpan Expires)> _buffer = new();

// Quand une touche vient d'être pressée :
_buffer.Enqueue((key, gameTime.TotalGameTime + TimeSpan.FromMilliseconds(120)));

// À chaque frame, retire les entrées expirées.
while (_buffer.Count > 0 && _buffer.Peek().Expires < gameTime.TotalGameTime)
{
    _buffer.Dequeue();
}

// Plus tard, au moment opportun :
if (_buffer.Count > 0 && canJump)
{
    _buffer.Dequeue();
    Jump();
}`,
      },
      {
        t: 'p',
        html: "Le prochain chapitre transforme ces lectures dispersées en un <strong>InputManager</strong> réutilisable, avec un suivi propre des états précédents pour le clavier, la souris et quatre manettes.",
      },
    ],
    quiz: [
      {
        question: 'Pourquoi Keyboard.GetState() ne suffit-il pas pour détecter un appui unique ?',
        options: [
          'Il ne fonctionne pas avec les lettres',
          'Il ne renvoie que l’état instantané, sans historique',
          'Il est trop lent',
          'Il ne marche qu’en plein écran',
        ],
        correct: 1,
        explanation:
          'GetState donne l’état à l’instant présent. Pour savoir si une touche vient d’être enfoncée, il faut comparer avec l’état de la frame précédente.',
      },
      {
        question: 'Comment éviter un déplacement diagonal trop rapide ?',
        options: [
          'Diviser la vitesse par 2',
          'Normaliser le vecteur de direction',
          'Utiliser uniquement le clavier',
          'Désactiver les diagonales',
        ],
        correct: 1,
        explanation:
          'Un vecteur diagonal (1,1) a une longueur de √2. Normaliser ramène sa longueur à 1 avant de multiplier par la vitesse.',
      },
      {
        question: 'Que renvoie ThumbSticks.Left ?',
        options: [
          'Un booléen',
          'Un Vector2 analogique entre -1 et 1 par axe',
          'Une touche du clavier',
          'Une position en pixels',
        ],
        correct: 1,
        explanation:
          'Le stick analogique fournit une direction et une amplitude. La deadzone élimine les petites valeurs involontaires.',
      },
      {
        question: 'À quoi sert un buffer d’entrées ?',
        options: [
          'À stocker les textures',
          'À mémoriser brièvement une action pour ne pas la rater',
          'À accélérer le rendu',
          'À remplacer le clavier',
        ],
        correct: 1,
        explanation:
          'Le buffer garde une action pressée quelques dizaines de millisecondes et la consomme quand le contexte le permet. C’est très utilisé pour le saut et les combos.',
      },
    ],
    exercises: [
      {
        title: 'Déplacer le slime au clavier',
        level: 'Facile',
        prompt:
          "Ajoute un déplacement du slime avec les flèches et WASD, à une vitesse de 5 pixels par frame. Bloque-le aux bords de l’écran.",
        hint: 'Vérifie les quatre directions, puis borne _slimePosition.X et .Y entre 0 et la taille de la fenêtre moins la taille du sprite.',
        solution: `KeyboardState keyboard = Keyboard.GetState();
float speed = 5f;

if (keyboard.IsKeyDown(Keys.Left) || keyboard.IsKeyDown(Keys.A))
    _slimePosition.X -= speed;
if (keyboard.IsKeyDown(Keys.Right) || keyboard.IsKeyDown(Keys.D))
    _slimePosition.X += speed;
if (keyboard.IsKeyDown(Keys.Up) || keyboard.IsKeyDown(Keys.W))
    _slimePosition.Y -= speed;
if (keyboard.IsKeyDown(Keys.Down) || keyboard.IsKeyDown(Keys.S))
    _slimePosition.Y += speed;

_slimePosition.X = MathHelper.Clamp(_slimePosition.X, 0, GraphicsDevice.PresentationParameters.BackBufferWidth - _slime.Width);
_slimePosition.Y = MathHelper.Clamp(_slimePosition.Y, 0, GraphicsDevice.PresentationParameters.BackBufferHeight - _slime.Height);`,
        solutionLang: 'csharp',
      },
      {
        title: 'Détecter un appui unique',
        level: 'Intermédiaire',
        prompt:
          "Fais en sorte qu’appuyer sur Espace change la couleur du slime une seule fois, pas à chaque frame.",
        hint: 'Ajoute un champ KeyboardState _previousKeyboard et compare Current/Previous.',
        solution: `private KeyboardState _previousKeyboard;
private Color _slimeColor = Color.White;

// Dans Update :
KeyboardState keyboard = Keyboard.GetState();
if (keyboard.IsKeyDown(Keys.Space) && _previousKeyboard.IsKeyUp(Keys.Space))
{
    _slimeColor = _slimeColor == Color.White ? Color.LightGreen : Color.White;
}
_previousKeyboard = keyboard;

// Dans Draw :
_slime.Color = _slimeColor;`,
        solutionLang: 'csharp',
      },
      {
        title: 'Deadzone configurable',
        level: 'Défi',
        prompt:
          "Écris une méthode qui prend un Vector2 de stick et un seuil, et retourne un vecteur normalisé ou Vector2.Zero si le stick est sous le seuil.",
        hint: 'Compare LengthSquared() au seuil au carré pour éviter une racine carrée.',
        solution: `public static Vector2 ApplyDeadzone(Vector2 stick, float deadzone)
{
    if (stick.LengthSquared() < deadzone * deadzone)
    {
        return Vector2.Zero;
    }

    stick.Normalize();
    return stick;
}`,
        solutionLang: 'csharp',
      },
    ],
    sources: [
      {
        label: 'Chapitre 10 officiel — Handling Input',
        url: 'https://docs.monogame.net/articles/tutorials/building_2d_games/10_handling_input/index.html',
      },
      {
        label: 'Référence KeyboardState',
        url: 'https://docs.monogame.net/api/Microsoft.Xna.Framework.Input.KeyboardState.html',
      },
    ],
  },
  {
    slug: 'input-manager',
    chapter: 10,
    module: 'fondations',
    title: 'Un InputManager robuste',
    navTitle: 'Le système d’entrées',
    description:
      'Centralise clavier, souris et quatre manettes dans une bibliothèque réutilisable, avec états précédents, impulsions et abstraction des actions.',
    duration: 40,
    objectives: [
      'Concevoir une classe InputManager réutilisable',
      'Suivre les états courant et précédent de chaque périphérique',
      'Exposer des actions de jeu plutôt que des touches',
      'Brancher le système dans la classe Core',
    ],
    blocks: [
      {
        t: 'p',
        html: "Répéter <code>Keyboard.GetState()</code> et comparer des états précédents dans chaque scène devient vite ingérable. L’<strong>InputManager</strong> centralise cette logique une bonne fois pour toutes, puis expose des méthodes simples : <code>IsKeyDown</code>, <code>WasKeyJustPressed</code>, <code>LeftThumbStick</code>…",
      },
      { t: 'h2', text: 'L’architecture' },
      {
        t: 'list',
        items: [
          "<code>KeyboardInfo</code> : états courant/précédent, méthodes <code>IsKeyDown</code>, <code>WasKeyJustPressed</code>, <code>WasKeyJustReleased</code>.",
          "<code>MouseInfo</code> : position, boutons, molette, avec le même suivi d’état.",
          "<code>GamePadInfo</code> : boutons, sticks, gâchettes, vibration, avec une deadzone.",
          "<code>InputManager</code> : un keyboard, un mouse, un tableau de quatre gamepads, et une méthode <code>Update</code>.",
          "<code>GameController</code> (chapitre 22) : traduit les entrées en actions du jeu (<code>MoveUp</code>, <code>Pause</code>…).",
        ],
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'MonoGameLibrary/Input/InputManager.cs',
        code: code.inputManager,
      },
      { t: 'h2', text: 'Le suivi des états' },
      {
        t: 'p',
        html: "Le cœur du système tient dans deux lignes de <code>KeyboardInfo.Update</code> : l’état courant devient l’état précédent, puis on lit le nouvel état. Toutes les détections d’impulsion en découlent.",
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'Extrait de KeyboardInfo.cs',
        code: `public KeyboardState PreviousState { get; private set; }
public KeyboardState CurrentState { get; private set; }

public void Update()
{
    PreviousState = CurrentState;
    CurrentState = Keyboard.GetState();
}

public bool IsKeyDown(Keys key)
{
    return CurrentState.IsKeyDown(key);
}

public bool WasKeyJustPressed(Keys key)
{
    return CurrentState.IsKeyDown(key) && PreviousState.IsKeyUp(key);
}

public bool WasKeyJustReleased(Keys key)
{
    return CurrentState.IsKeyUp(key) && PreviousState.IsKeyDown(key);
}`,
      },
      {
        t: 'callout',
        tone: 'warn',
        title: 'Mettre à jour avant de lire',
        html: "Core doit appeler <code>Input.Update(gameTime)</code> au début de son <code>Update</code>, avant les scènes. Sinon, une scène lit l’état de la frame précédente et les impulsions sont décalées d’une frame.",
      },
      { t: 'h2', text: 'Brancher l’InputManager dans Core' },
      {
        t: 'p',
        html: "Ajoute une propriété statique <code>Input</code>, instancie-la dans <code>Initialize</code>, puis mets-la à jour et transmets la logique aux scènes.",
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'Extraits de Core.cs',
        code: `public static InputManager Input { get; private set; }

protected override void Initialize()
{
    base.Initialize();
    GraphicsDevice = base.GraphicsDevice;
    SpriteBatch = new SpriteBatch(GraphicsDevice);
    Input = new InputManager();
}

protected override void Update(GameTime gameTime)
{
    Input.Update(gameTime);
    base.Update(gameTime);
}`,
      },
      {
        t: 'p',
        html: "Dans le jeu, tu peux maintenant écrire <code>Core.Input.Keyboard.WasKeyJustPressed(Keys.Space)</code>. C’est déjà mieux, mais les scènes ne devraient pas connaître les touches : elles devraient connaître les <strong>actions</strong>. C’est le rôle de <code>GameController</code> :",
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'DungeonSlime/GameController.cs — extrait',
        code: `public static bool MoveUp()
{
    return s_keyboard.WasKeyJustPressed(Keys.Up) ||
           s_keyboard.WasKeyJustPressed(Keys.W) ||
           s_gamePad.WasButtonJustPressed(Buttons.DPadUp) ||
           s_gamePad.WasButtonJustPressed(Buttons.LeftThumbstickUp);
}`,
      },
      {
        t: 'callout',
        tone: 'key',
        title: 'Une couche d’abstraction, pas une usine',
        html: "Pour un petit jeu, un <code>GameController</code> statique suffit. Pour un jeu avec plusieurs joueurs ou des remappages de touches, tu voudras une table d’actions configurable. L’important est la séparation : les scènes demandent « avancer », pas « touche W ».",
      },
      {
        t: 'p',
        html: "Tu as maintenant une base solide : assets, sprites, animations et entrées. Le module suivant s’attaque au monde du jeu : collisions, tilemaps, audio, texte et scènes.",
      },
    ],
    quiz: [
      {
        question: 'Quel est le rôle d’InputManager ?',
        options: [
          'Dessiner les sprites',
          'Centraliser et mettre à jour l’état des périphériques',
          'Charger les textures',
          'Gérer les scènes',
        ],
        correct: 1,
        explanation:
          'Il possède les objets KeyboardInfo, MouseInfo et GamePadInfo, et met à jour leurs états une fois par frame.',
      },
      {
        question: 'Comment KeyboardInfo détecte-t-il un appui unique ?',
        options: [
          'En appelant Keyboard.GetState() deux fois dans la même frame',
          'En comparant CurrentState et PreviousState',
          'En utilisant un timer de 1 seconde',
          'En écoutant un événement système',
        ],
        correct: 1,
        explanation:
          'WasKeyJustPressed vérifie que la touche est enfoncée maintenant et ne l’était pas avant.',
      },
      {
        question: 'Pourquoi éviter que les scènes comparent directement des touches ?',
        options: [
          'Parce que le clavier est obsolète',
          'Pour découpler les actions du jeu des périphériques et faciliter les remappages',
          'Parce que cela ralentit le rendu',
          'Parce que MonoGame l’interdit',
        ],
        correct: 1,
        explanation:
          'Une couche d’actions (GameController) permet de changer les touches, d’ajouter une manette ou de gérer plusieurs joueurs sans toucher aux scènes.',
      },
      {
        question: 'Combien de manettes l’InputManager du tutoriel suit-il ?',
        options: ['Une', 'Deux', 'Quatre', 'Huit'],
        correct: 2,
        explanation:
          'GamePads est un tableau de quatre GamePadInfo, un par PlayerIndex.',
      },
    ],
    exercises: [
      {
        title: 'Ajouter le mouvement souris',
        level: 'Facile',
        prompt:
          "Ajoute à InputManager un accès direct à la position de la souris et utilise-la pour placer le slime au centre du curseur.",
        hint: 'Input.Mouse.Position renvoie déjà un Point.',
        solution: `// Dans la scène :
Point mouse = Core.Input.Mouse.Position;
_slimePosition = new Vector2(mouse.X, mouse.Y);`,
        solutionLang: 'csharp',
      },
      {
        title: 'Créer l’action Pause',
        level: 'Intermédiaire',
        prompt:
          "Ajoute une méthode <code>Pause()</code> dans GameController qui réagit à Échap et au bouton Start de la manette.",
        hint: 'GamePadInfo possède WasButtonJustPressed(Buttons.Start).',
        solution: `public static bool Pause()
{
    return s_keyboard.WasKeyJustPressed(Keys.Escape) ||
           s_gamePad.WasButtonJustPressed(Buttons.Start);
}`,
        solutionLang: 'csharp',
      },
      {
        title: 'Support de deux joueurs',
        level: 'Défi',
        prompt:
          "Décris les changements nécessaires pour que deux joueurs utilisent chacun une manette. Quelles parties du système doivent changer, et lesquelles peuvent rester identiques ?",
        hint: 'Pense à PlayerIndex, à GameController et à l’état du jeu.',
        solution:
          "InputManager suit déjà quatre manettes : il n’a pas besoin de changer. GameController doit devenir une instance par joueur (ou prendre un PlayerIndex en paramètre). Le Slime et la scène doivent stocker un joueur associé et interroger la bonne instance. Les classes de sprite, de tilemap et d’audio restent inchangées : la séparation des responsabilités paie.",
      },
    ],
    sources: [
      {
        label: 'Chapitre 11 officiel — Input Management',
        url: 'https://docs.monogame.net/articles/tutorials/building_2d_games/11_input_management/index.html',
      },
    ],
  },
];
