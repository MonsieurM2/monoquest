import { code } from '../../content/code';
import type { Lesson } from '../types';

export const demarrerLessons: Lesson[] = [
  {
    slug: 'monogame',
    chapter: 1,
    module: 'demarrer',
    title: 'Qu’est-ce que MonoGame ?',
    navTitle: 'Qu’est-ce que MonoGame ?',
    description:
      'Un framework de jeu libre et multiplateforme, héritier de XNA. Comprends ce qu’il fait, ce qu’il ne fait pas, et pourquoi il est un excellent terrain d’apprentissage.',
    duration: 15,
    objectives: [
      'Distinguer un framework d’un moteur de jeu',
      'Situer MonoGame dans l’histoire de XNA et du jeu indépendant',
      'Identifier les systèmes fournis par MonoGame',
      'Savoir à quoi ressemblera le jeu construit dans ce parcours',
    ],
    blocks: [
      {
        t: 'p',
        html: "Avant d’écrire la moindre ligne de code, une question utile : à quoi joue-t-on exactement quand on choisit MonoGame ? La réponse tient en une phrase : <strong>MonoGame te fournit les briques, pas la maison.</strong>",
      },
      {
        t: 'p',
        html: "C’est un <em>framework</em> : une bibliothèque C# qui gère la boucle de jeu, l’affichage, le son et les entrées. Tu gardes la main sur l’architecture, les outils et le rendu. À l’inverse, un moteur comme Unity ou Godot t’impose un éditeur, une scène et un ensemble de systèmes déjà assemblés.",
      },
      {
        t: 'callout',
        tone: 'key',
        title: 'La différence en une image',
        html: "Un moteur de jeu est une cuisine équipée : tu arrives, tu ouvres les placards et tu cuisines. MonoGame est une cuisine vide avec un excellent four : tu choisis les casseroles, la disposition et la recette. Plus de travail au départ, beaucoup plus de contrôle ensuite.",
      },
      { t: 'h2', text: 'Un héritier de XNA' },
      {
        t: 'p',
        html: "MonoGame descend de <strong>XNA Game Studio</strong>, l’outil que Microsoft a publié en 2006 pour créer des jeux sur Windows et Xbox 360. XNA a rendu le développement de jeux accessible à toute une génération d’indépendants. Des jeux comme <em>Bastion</em> ou <em>Terraria</em> en sont issus.",
      },
      {
        t: 'p',
        html: "Quand Microsoft abandonne XNA en 2013, la communauté continue avec MonoGame, un projet open source qui reprend l’API familière et l’ouvre à Windows, macOS, Linux, iOS, Android et aux consoles. La <a href=\"https://monogame.net/about/\" target=\"_blank\" rel=\"noreferrer\">MonoGame Foundation</a> voit le jour le 29 septembre 2023 pour pérenniser le projet.",
      },
      {
        t: 'gallery',
        items: [
          { src: '/images/celeste.png', alt: 'Celeste, jeu indépendant réalisé avec MonoGame' },
          { src: '/images/stardew-valley.png', alt: 'Stardew Valley, jeu indépendant réalisé avec MonoGame' },
        ],
      },
      {
        t: 'p',
        html: "Parmi les jeux connus construits avec MonoGame : <em>Celeste</em>, <em>Stardew Valley</em>, <em>Streets of Rage 4</em>, <em>Bastion</em>… et des milliers de projets plus modestes. C’est un framework éprouvé, pas un jouet pédagogique.",
      },
      { t: 'h2', text: 'Ce que MonoGame fournit (et ce qu’il ne fournit pas)' },
      {
        t: 'table',
        head: ['Fourni par MonoGame', 'À construire toi-même'],
        rows: [
          ['La boucle de jeu et le timing (<code>GameTime</code>)', 'L’architecture de ton jeu : scènes, entités, états'],
          ['Le rendu 2D et 3D, les shaders', 'Un éditeur de niveaux ou de scènes'],
          ['Le clavier, la souris, les manettes, le tactile', 'La physique, les collisions avancées'],
          ['Le son et la musique', 'Un système d’interface complet'],
          ['Le Content Pipeline pour compiler les assets', 'Un moteur de sauvegarde clé en main'],
          ['Les mathématiques et les types de base', 'Un exporteur de jeu : tu choisis ton packaging'],
        ],
      },
      {
        t: 'p',
        html: "Cette liste n’est pas une faiblesse : c’est le programme. Chaque système que tu écris t’apprend quelque chose de réutilisable. Et pour ce qui est vraiment coûteux à refaire — une interface, un moteur de tuiles — la communauté fournit des bibliothèques comme <strong>Gum</strong>, que nous utiliserons en fin de parcours.",
      },
      { t: 'h2', text: 'Ce que tu vas construire : Dungeon Slime' },
      {
        t: 'p',
        html: "Le fil rouge du parcours est un jeu complet : <strong>Dungeon Slime</strong>, un serpent dans un donjon. Tu diriges une chaîne de slimes, tu collectes des chauves-souris pour marquer des points, et tu évites de te mordre la queue. Le projet est volontairement simple à comprendre et suffisamment riche pour aborder tous les fondamentaux.",
      },
      {
        t: 'image',
        src: '/images/dungeon-slime-game.png',
        alt: 'Capture du jeu Dungeon Slime : un slime bleu poursuivi par des chauves-souris dans un donjon',
        caption: 'Dungeon Slime, le jeu que tu vas réaliser. Image : tutoriel officiel MonoGame.',
        wide: true,
      },
      {
        t: 'list',
        items: [
          'Des sprites animés et un rendu 2D maîtrisé',
          'Des contrôles clavier, souris et manette',
          'Un donjon en tilemaps et des collisions fiables',
          'Des effets sonores, une musique et un contrôleur audio',
          'Des menus, un écran-titre et une interface avec Gum',
          'Un score, des états de jeu et une publication sur itch.io',
        ],
      },
      { t: 'h2', text: 'Comment suivre ce parcours' },
      {
        t: 'steps',
        items: [
          {
            title: 'Crée un seul projet, garde-le ouvert',
            html: "Chaque chapitre s’appuie sur le précédent. Le projet s’appelle <code>DungeonSlime</code> et la bibliothèque <code>MonoGameLibrary</code>. Ne recrée pas un projet à chaque leçon.",
          },
          {
            title: 'Tape le code, ne le colle pas',
            html: "La mémoire musculaire compte plus que la vitesse. Lis chaque bloc, essaie de prédire ce qu’il fait, puis lance le jeu. Les erreurs font partie du cours ; la section « En cas de blocage » de chaque chapitre t’aide à les lire.",
          },
          {
            title: 'Réponds aux quiz et fais les exercices',
            html: "Les quiz vérifient les concepts, les exercices vérifient ta capacité à les réutiliser. Ils sont optionnels, mais ce sont eux qui transforment une lecture en compétence.",
          },
          {
            title: 'Note tes progrès',
            html: "Le bouton <strong>Marquer comme terminé</strong> en bas de chaque chapitre sauvegarde ta progression dans ton navigateur. Tu peux reprendre à tout moment depuis l’accueil.",
          },
        ],
      },
      {
        t: 'callout',
        tone: 'info',
        title: 'Aucun prérequis en jeu vidéo',
        html: "En revanche, une base de C# aide beaucoup. Si les classes, les propriétés ou les génériques te sont étrangers, commence par <a href=\"/bases-csharp\" data-link>le guide C# express</a> : il couvre juste ce qu’il faut pour ce parcours.",
      },
      {
        t: 'p',
        html: "Dans le prochain chapitre, tu installes les outils et tu fais apparaître ta première fenêtre MonoGame. C’est le moment où le cours devient concret.",
      },
    ],
    quiz: [
      {
        question: 'Quelle affirmation décrit le mieux MonoGame ?',
        options: [
          'Un moteur de jeu avec un éditeur visuel intégré',
          'Un framework C# qui fournit les briques de base du jeu',
          'Un langage de programmation spécialisé pour les jeux',
          'Un format de fichier pour stocker des niveaux',
        ],
        correct: 1,
        explanation:
          'MonoGame est un framework : il fournit le rendu, les entrées, l’audio, la boucle de jeu et le pipeline de contenu, mais pas d’éditeur ni d’architecture de jeu toute faite.',
      },
      {
        question: 'De quel projet Microsoft MonoGame est-il l’héritier direct ?',
        options: ['DirectX', 'XNA Game Studio', 'Silverlight', 'WPF'],
        correct: 1,
        explanation:
          'MonoGame reprend l’API de XNA Game Studio, abandonné par Microsoft en 2013, et la fait vivre sur de nouvelles plateformes.',
      },
      {
        question: 'Lequel de ces jeux n’a pas été réalisé avec MonoGame ?',
        options: ['Celeste', 'Stardew Valley', 'Streets of Rage 4', 'Hades'],
        correct: 3,
        explanation:
          'Hades est développé avec le moteur maison de Supergiant Games. Celeste, Stardew Valley et Streets of Rage 4 sont des jeux MonoGame célèbres.',
      },
      {
        question: 'Pourquoi MonoGame ne fournit-il pas d’éditeur de scènes ?',
        options: [
          'Parce que la fonctionnalité est payante',
          'Parce que le rendu 3D est prioritaire',
          'Parce que son approche est « code-first » : tu choisis et construis tes outils',
          'Parce que les scènes sont gérées par le Content Pipeline',
        ],
        correct: 2,
        explanation:
          'MonoGame assume une approche code-first. Tu construis ton propre éditeur, ton propre système de scènes et tes propres outils, ce qui offre un contrôle total sur l’architecture.',
      },
    ],
    exercises: [
      {
        title: 'Explorer les jeux réalisés avec MonoGame',
        level: 'Facile',
        prompt:
          "Parcours la page <a href=\"https://monogame.net/showcase/\" target=\"_blank\" rel=\"noreferrer\">Showcase de MonoGame</a> et choisis trois jeux. Pour chacun, note en une phrase ce qui, selon toi, aurait été difficile à reproduire sans contrôle direct sur le rendu ou la boucle de jeu.",
        hint: 'Pense aux effets visuels, au style graphique, au réseau, aux animations très précises.',
        solution:
          "Il n’y a pas de réponse unique. L’objectif est de relier une contrainte technique à un choix de framework. Par exemple : Celeste utilise des mouvements très précis et des effets de particules sur mesure ; un moteur généraliste imposerait ses propres composants. Streets of Rage 4 a besoin d’un rendu 2D et d’un contrôle fin du timing des combos. Un petit jeu de puzzle peut, lui, très bien se contenter d’un moteur plus lourd.",
      },
      {
        title: 'Framework ou moteur : ton premier choix',
        level: 'Intermédiaire',
        prompt:
          "Tu veux prototyper en un week-end un jeu de cartes 2D sans animation complexe. Choisirais-tu MonoGame ou un moteur comme Godot ? Rédige trois arguments, puis un contre-argument honnête.",
        hint: 'Pense au temps d’installation, à l’interface utilisateur, à ton envie d’apprendre.',
        solution:
          "Pour un prototype très court, un moteur avec éditeur et UI intégrée est souvent plus rapide. MonoGame devient intéressant si tu veux apprendre les rouages, réutiliser ton code C#, ou si le jeu repose sur un rendu et un timing très contrôlés. Le contre-argument : avec MonoGame, tu devras écrire toi-même le glisser-déposer des cartes et la gestion des menus — un vrai coût au départ.",
      },
    ],
    sources: [
      {
        label: 'Chapitre 01 officiel — What Is MonoGame',
        url: 'https://docs.monogame.net/articles/tutorials/building_2d_games/01_what_is_monogame/index.html',
      },
      { label: 'À propos de MonoGame', url: 'https://monogame.net/about/' },
    ],
  },
  {
    slug: 'installation',
    chapter: 2,
    module: 'demarrer',
    title: 'Installer son environnement et créer le projet',
    navTitle: 'Installer son environnement',
    description:
      'Le SDK .NET, VS Code, les modèles MonoGame 3.8.6 : installe un environnement propre et fais tourner ta première fenêtre de jeu.',
    duration: 25,
    objectives: [
      'Installer le SDK .NET 9 ou 10 et VS Code',
      'Installer les modèles de projet MonoGame 3.8.6',
      'Créer et lancer le projet DungeonSlime',
      'Comprendre le rôle des fichiers générés',
    ],
    blocks: [
      {
        t: 'p',
        html: "MonoGame n’est pas un logiciel autonome : c’est une bibliothèque .NET. Pour l’utiliser, il te faut donc le <strong>SDK .NET</strong>, un éditeur de code et les modèles de projet MonoGame. Compte vingt minutes la première fois, cinq ensuite.",
      },
      {
        t: 'callout',
        tone: 'warn',
        title: 'Version vérifiée',
        html: "Ce parcours est à jour pour <strong>MonoGame 3.8.6</strong> (sortie le 26 octobre 2026). Le tutoriel officiel utilise encore les paquets 3.8.4.x, mais le code de ce cours fonctionne tel quel avec 3.8.6. Le SDK .NET minimum recommandé est <strong>.NET 9</strong> ; .NET 10 est également pris en charge.",
      },
      { t: 'h2', text: '1. Installer le SDK .NET' },
      {
        t: 'p',
        html: "Télécharge le SDK depuis <a href=\"https://dotnet.microsoft.com/download\" target=\"_blank\" rel=\"noreferrer\">dotnet.microsoft.com/download</a>. Prends la version <strong>x64</strong> pour Windows, même sur une machine ARM. Sur macOS Apple Silicon, MonoGame demande pour l’instant l’installation Intel et Rosetta. Sur Linux, passe par le paquet de ta distribution ou le script officiel.",
      },
      {
        t: 'code',
        lang: 'bash',
        title: 'Vérifier l’installation',
        code: `dotnet --version
# 9.0.x ou 10.0.x

dotnet --list-sdks`,
      },
      {
        t: 'callout',
        tone: 'tip',
        title: 'Pourquoi .NET 9 et pas .NET 8 ?',
        html: "Le tutoriel officiel a été rédigé avec des projets <code>net8.0</code>, mais depuis MonoGame 3.8.4 la documentation recommande .NET 9 minimum. Les modèles 3.8.6 créent d’ailleurs des projets <code>net9.0</code> avec <code>RollForward</code>, ce qui permet de les exécuter sur .NET 10.",
      },
      { t: 'h2', text: '2. Installer VS Code et les extensions' },
      {
        t: 'p',
        html: "Visual Studio Code est gratuit, léger et multiplateforme. Installe-le depuis <a href=\"https://code.visualstudio.com/\" target=\"_blank\" rel=\"noreferrer\">code.visualstudio.com</a>, puis ajoute deux extensions :",
      },
      {
        t: 'list',
        ordered: true,
        items: [
          "<strong>C# Dev Kit</strong> (Microsoft) — compilation, débogage, navigation, gestion des projets. L’extension C# de base sera installée automatiquement.",
          "<strong>MonoGame for VSCode</strong> (r88) — ouvre l’éditeur de contenu MGCB depuis VS Code et facilite le lancement des projets MonoGame.",
          "<em>Optionnel :</em> <strong>.NET MAUI</strong> si tu veux cibler Android ou iOS plus tard. Inutile pour ce parcours desktop.",
        ],
      },
      { t: 'h2', text: '3. Installer les modèles MonoGame' },
      {
        t: 'code',
        lang: 'bash',
        title: 'Terminal',
        code: `dotnet new install MonoGame.Templates.CSharp`,
      },
      {
        t: 'p',
        html: "Cette commande installe les modèles de projet (dont <code>mgdesktopgl</code>) dans leur version la plus récente, soit 3.8.6 au moment de la rédaction. Pour vérifier ce qui est installé :",
      },
      {
        t: 'code',
        lang: 'bash',
        code: `dotnet new list monogame`,
      },
      {
        t: 'callout',
        tone: 'info',
        title: 'Pas de .NET 9 ?',
        html: "Les modèles 3.8.6 ciblent <code>net9.0</code>. Si tu ne peux installer que .NET 8, tu peux modifier le <code>TargetFramework</code> du fichier <code>.csproj</code> en <code>net8.0</code> : le tutoriel officiel fonctionne ainsi. Mais .NET 9 ou 10 est désormais la voie recommandée.",
      },
      { t: 'h2', text: '4. Créer le projet DungeonSlime' },
      {
        t: 'p',
        html: "Ouvre un terminal dans le dossier où tu ranges tes projets, puis crée le jeu avec le modèle <strong>Cross-Platform Desktop Application</strong> :",
      },
      {
        t: 'code',
        lang: 'bash',
        title: 'Créer le projet',
        code: `dotnet new mgdesktopgl -o DungeonSlime
cd DungeonSlime
dotnet run`,
      },
      {
        t: 'p',
        html: "Une fenêtre bleu corail de 800 × 480 pixels doit apparaître. C’est le clear color par défaut de MonoGame. Appuie sur <kbd>Échap</kbd> pour quitter. Si tu vois cette fenêtre, ton environnement est correct : le reste n’est plus qu’une question de code.",
      },
      {
        t: 'image',
        src: '/images/monogame-lifecycle.svg',
        alt: 'Schéma du cycle de vie d’un jeu MonoGame',
        caption: 'La boucle de jeu que tu viens de lancer : Update puis Draw, encore et encore.',
        wide: true,
        light: true,
      },
      {
        t: 'callout',
        tone: 'tip',
        title: 'Depuis VS Code',
        html: "Tu peux aussi utiliser la palette de commandes (<kbd>Ctrl</kbd>+<kbd>Maj</kbd>+<kbd>P</kbd>), taper <code>.NET New Project</code>, chercher <em>MonoGame Cross-Platform Desktop Application</em> et nommer le projet <code>DungeonSlime</code>. Le résultat est identique.",
      },
      { t: 'h2', text: 'Ce que contient le projet' },
      {
        t: 'table',
        head: ['Fichier / dossier', 'Rôle'],
        rows: [
          ['<code>Program.cs</code>', 'Point d’entrée : crée et lance la classe Game1'],
          ['<code>Game1.cs</code>', 'La classe principale du jeu, dérivée de Game'],
          ['<code>Content/Content.mgcb</code>', 'Le projet de contenu : textures, sons, polices'],
          ['<code>.config/dotnet-tools.json</code>', 'Les outils MGCB (éditeur et compilateur de contenu)'],
          ['<code>DungeonSlime.csproj</code>', 'La configuration .NET et les paquets MonoGame'],
          ['<code>Icon.ico</code>, <code>app.manifest</code>', 'Icône et manifeste Windows'],
        ],
      },
      {
        t: 'code',
        lang: 'xml',
        title: 'DungeonSlime.csproj (extrait du modèle 3.8.6)',
        code: `<PropertyGroup>
  <OutputType>WinExe</OutputType>
  <TargetFramework>net9.0</TargetFramework>
  <RollForward>Major</RollForward>
  <PublishReadyToRun>false</PublishReadyToRun>
  <TieredCompilation>false</TieredCompilation>
</PropertyGroup>

<ItemGroup>
  <PackageReference Include="MonoGame.Framework.DesktopGL" Version="3.8.*" />
  <PackageReference Include="MonoGame.Content.Builder.Task" Version="3.8.*" />
</ItemGroup>`,
      },
      {
        t: 'callout',
        tone: 'warn',
        title: 'Erreur « MGCB » ou « dotnet tool » au premier build',
        html: "Le projet embarque un manifeste d’outils locaux. S’il n’a pas été restauré, exécute <code>dotnet tool restore</code> à la racine du projet, puis relance <code>dotnet run</code>. Si tu mets à jour MonoGame, relance cette commande : le manifeste pointe vers une version précise.",
      },
      { t: 'h2', text: 'Et le nouveau Content Builder de 3.8.6 ?' },
      {
        t: 'p',
        html: "MonoGame 3.8.6 considère le nouveau <strong>Content Builder</strong> (approche code-first) comme la méthode recommandée pour les nouveaux projets. Le tutoriel officiel et ce parcours utilisent encore l’éditeur MGCB et le fichier <code>Content.mgcb</code>, qui restent pleinement supportés et beaucoup plus simples pour débuter. Tu peux suivre tout le cours avec cette méthode ; nous signalons le Content Builder dans le chapitre dédié, pour que tu saches vers quoi migrer ensuite.",
      },
      { t: 'h2', text: 'En cas de blocage' },
      {
        t: 'list',
        items: [
          "« <em>No templates found</em> » : relance <code>dotnet new install MonoGame.Templates.CSharp</code>.",
          "« <em>The current .NET SDK does not support targeting .NET 9.0</em> » : installe .NET 9 (ou passe le projet en <code>net8.0</code>).",
          "L’éditeur MGCB ne s’ouvre pas : exécute <code>dotnet tool restore</code>, puis <code>dotnet mgcb-editor ./Content/Content.mgcb</code>.",
          "Le jeu ne se lance pas depuis VS Code : sélectionne le projet <code>DungeonSlime</code> comme projet de démarrage, pas la bibliothèque.",
        ],
      },
    ],
    quiz: [
      {
        question: 'Quel est le rôle du SDK .NET ?',
        options: [
          'Compilateur et outils pour construire et exécuter du code C#',
          'Un éditeur graphique pour dessiner les sprites',
          'Le moteur de rendu de MonoGame',
          'Un serveur web pour publier le jeu',
        ],
        correct: 0,
        explanation:
          'Le SDK .NET contient le compilateur, le runtime et les outils CLI (dotnet new, dotnet run, dotnet publish) nécessaires pour créer et exécuter un projet C#.',
      },
      {
        question: 'Quelle commande crée un projet MonoGame desktop ?',
        options: ['dotnet new monogame', 'dotnet new mgdesktopgl -o DungeonSlime', 'monogame init', 'dotnet run DungeonSlime'],
        correct: 1,
        explanation:
          'mgdesktopgl est le nom court du modèle « MonoGame Cross-Platform Desktop Application ». -o DungeonSlime crée le projet dans un dossier du même nom.',
      },
      {
        question: 'À quoi sert le fichier Content.mgcb ?',
        options: [
          'À configurer la résolution de la fenêtre',
          'À lister les assets à compiler avec le Content Pipeline',
          'À stocker la sauvegarde du joueur',
          'À définir les contrôles clavier',
        ],
        correct: 1,
        explanation:
          'Content.mgcb est le projet de contenu : il décrit les textures, sons et polices à traiter, ainsi que leurs options de compilation.',
      },
      {
        question: 'Que signifie l’erreur « MGCB editor not found » au premier lancement ?',
        options: [
          'Le jeu est mal codé',
          'Les outils locaux n’ont pas été restaurés',
          'MonoGame n’est pas installé',
          'Le fichier Program.cs est manquant',
        ],
        correct: 1,
        explanation:
          'Les outils MGCB sont déclarés dans .config/dotnet-tools.json. Il faut exécuter dotnet tool restore pour les installer localement.',
      },
    ],
    exercises: [
      {
        title: 'Vérifier sa toolchain',
        level: 'Facile',
        prompt:
          "Exécute <code>dotnet --info</code>, <code>dotnet new list monogame</code> et <code>dotnet tool list</code> à la racine du projet. Note la version du SDK, la version du modèle MonoGame et celle de l’outil MGCB.",
        hint: 'La version du modèle apparaît dans dotnet new list ; celle de l’outil dans dotnet tool list.',
        solution:
          "Exemple de sortie attendue en octobre 2026 : SDK 9.0.x (ou 10.0.x), modèle MonoGame.Application.DesktopGL.CSharp en 3.8.6, dotnet-mgcb en 3.8.6. Si le modèle affiche 3.8.4, exécute dotnet new install MonoGame.Templates.CSharp pour mettre à jour.",
      },
      {
        title: 'Personnaliser la fenêtre',
        level: 'Intermédiaire',
        prompt:
          "Dans <code>Game1</code>, change la couleur d’effacement en <code>Color.MonoGameOrange</code>. Lance le jeu. Change ensuite la résolution en 1280 × 720 et le titre de la fenêtre en « Dungeon Slime ».",
        hint: 'La largeur et la hauteur se règlent via GraphicsDeviceManager, dans le constructeur, avant ApplyChanges().',
        solution: `protected override void Draw(GameTime gameTime)
{
    GraphicsDevice.Clear(Color.MonoGameOrange);
    base.Draw(gameTime);
}

// Dans le constructeur, avant base.Initialize() / ApplyChanges :
_graphics.PreferredBackBufferWidth = 1280;
_graphics.PreferredBackBufferHeight = 720;
_graphics.ApplyChanges();
Window.Title = "Dungeon Slime";`,
      },
    ],
    sources: [
      {
        label: 'Chapitre 02 officiel — Getting Started',
        url: 'https://docs.monogame.net/articles/tutorials/building_2d_games/02_getting_started/index.html',
      },
      {
        label: 'Notes de version MonoGame 3.8.6',
        url: 'https://monogame.net/blog/2026-10-26-3.8.6-release-2026/',
      },
      { label: 'Télécharger .NET', url: 'https://dotnet.microsoft.com/download' },
    ],
  },
  {
    slug: 'game1',
    chapter: 3,
    module: 'demarrer',
    title: 'La classe Game1 et la boucle de jeu',
    navTitle: 'La classe Game1',
    description:
      'Constructeur, Initialize, LoadContent, Update, Draw : comprends l’ordre exact dans lequel MonoGame appelle ton code, et pourquoi le delta time change tout.',
    duration: 20,
    objectives: [
      'Décrire le cycle de vie d’une classe Game',
      'Expliquer le rôle de GraphicsDeviceManager et de SpriteBatch',
      'Comprendre la boucle Update / Draw et le delta time',
      'Modifier le code généré sans casser l’initialisation',
    ],
    blocks: [
      {
        t: 'p',
        html: "Ouvre <code>Game1.cs</code>. Ce fichier généré contient une classe qui dérive de <code>Game</code>, la classe centrale de MonoGame. Elle gère l’initialisation, le chargement des assets, la mise à jour et le rendu. Tout jeu MonoGame commence ici.",
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'Game1.cs — généré par le modèle',
        code: code.game1_03,
      },
      {
        t: 'callout',
        tone: 'info',
        title: 'Game1 est-il un nom obligatoire ?',
        html: "Non. Tu peux renommer la classe, le fichier et la référence dans <code>Program.cs</code>. En revanche, la classe de base <code>Game</code> appartient à MonoGame : impossible de la renommer. Le tutoriel garde <code>Game1</code> par convention.",
      },
      { t: 'h2', text: 'L’ordre d’exécution' },
      {
        t: 'image',
        src: '/images/monogame-lifecycle.svg',
        alt: 'Diagramme du cycle de vie : constructeur, Initialize, LoadContent, Update, Draw',
        caption: 'Le cycle de vie d’un jeu MonoGame. Image : tutoriel officiel.',
        wide: true,
        light: true,
      },
      {
        t: 'steps',
        items: [
          {
            title: 'Le constructeur',
            html: "Il crée le <code>GraphicsDeviceManager</code>, définit le dossier de contenu et rend la souris visible. Il doit rester léger : la fenêtre et le périphérique graphique ne sont pas encore complètement initialisés.",
          },
          {
            title: 'Initialize()',
            html: "MonoGame appelle ensuite <code>Initialize()</code>. Tu y configures la résolution, le plein écran, et les systèmes qui n’ont pas besoin d’assets. <strong>Appelle toujours <code>base.Initialize()</code></strong> : c’est lui qui initialise le périphérique graphique et déclenche <code>LoadContent()</code>.",
          },
          {
            title: 'LoadContent()',
            html: "Appelé une seule fois, pendant <code>base.Initialize()</code>. C’est ici que tu crées le <code>SpriteBatch</code> et charges textures, sons et polices via <code>Content.Load&lt;T&gt;</code>. Toute initialisation dépendante d’un asset doit venir après <code>base.Initialize()</code>, pas avant.",
          },
          {
            title: 'Update(GameTime) puis Draw(GameTime)',
            html: "La boucle de jeu appelle <code>Update</code> (logique, entrées, physique) puis <code>Draw</code> (rendu), environ 60 fois par seconde. Elle tourne jusqu’à <code>Exit()</code>.",
          },
        ],
      },
      { t: 'h2', text: 'Les deux objets graphiques' },
      {
        t: 'p',
        html: "<code>GraphicsDeviceManager</code> négocie la connexion au GPU, la résolution, le plein écran et le <code>GraphicsDevice</code>. <code>SpriteBatch</code> regroupe les appels de dessin 2D pour limiter les changements d’état du GPU : au lieu de dessiner chaque sprite séparément, il prépare un lot et l’envoie d’un coup.",
      },
      {
        t: 'callout',
        tone: 'tip',
        title: 'Pourquoi SpriteBatch est-il créé dans LoadContent ?',
        html: "Parce qu’il a besoin du <code>GraphicsDevice</code>, qui n’existe qu’après l’initialisation de la plateforme. Le créer dans le constructeur fonctionnerait parfois, mais pas de façon fiable selon les plateformes.",
      },
      { t: 'h2', text: 'Effacer l’écran, dessiner une frame' },
      {
        t: 'p',
        html: "Chaque appel à <code>Draw</code> commence par <code>GraphicsDevice.Clear(...)</code>. Sans cet effacement, la nouvelle image serait dessinée par-dessus l’ancienne et l’écran se remplirait de traînées. Une image complète s’appelle une <strong>frame</strong>.",
      },
      {
        t: 'p',
        html: "À 60 images par seconde, une frame dure environ 16,67 ms. Mais ce n’est jamais parfait : un chargement, un pic du système ou une machine lente peut allonger une frame. C’est pour cela que <code>Update</code> et <code>Draw</code> reçoivent un <code>GameTime</code>.",
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'Utiliser le delta time',
        code: `protected override void Update(GameTime gameTime)
{
    // Nombre de secondes écoulées depuis la frame précédente.
    float deltaTime = (float)gameTime.ElapsedGameTime.TotalSeconds;

    // Avancer de 120 pixels par seconde, quel que soit le framerate.
    _position.X += 120f * deltaTime;

    base.Update(gameTime);
}`,
      },
      {
        t: 'callout',
        tone: 'key',
        title: 'La règle d’or du mouvement',
        html: "Ne multiplie jamais une vitesse par un nombre de frames supposé constant. Multiplie-la par le delta time. Sinon, ton jeu ira deux fois plus vite sur une machine à 120 Hz.",
      },
      {
        t: 'p',
        html: "Le <code>Draw</code> généré ne fait qu’effacer l’écran. Dans les chapitres suivants, nous y ajouterons un <code>SpriteBatch.Begin()</code>, des appels <code>Draw</code>, puis <code>End()</code>. Pour l’instant, expérimente : remplace <code>Color.CornflowerBlue</code> par <code>Color.MonoGameOrange</code>, relance, puis remets ta couleur préférée.",
      },
      {
        t: 'callout',
        tone: 'warn',
        title: 'L’erreur classique',
        html: "Supprimer <code>base.Initialize()</code> ou <code>base.Update(gameTime)</code> « pour voir ». Le premier cas empêche le chargement du contenu et du périphérique graphique ; le second empêche MonoGame de mettre à jour ses systèmes internes. Garde toujours les appels à <code>base</code>.",
      },
    ],
    quiz: [
      {
        question: 'Dans quel ordre MonoGame appelle-t-il ces méthodes au démarrage ?',
        options: [
          'LoadContent → Initialize → Constructeur → Update',
          'Constructeur → Initialize → LoadContent → Update',
          'Initialize → Constructeur → Update → LoadContent',
          'Constructeur → LoadContent → Initialize → Draw',
        ],
        correct: 1,
        explanation:
          'Le constructeur s’exécute à la création de l’objet, puis Initialize est appelé. C’est base.Initialize() qui déclenche LoadContent, avant la première frame Update/Draw.',
      },
      {
        question: 'À quoi sert le GraphicsDeviceManager ?',
        options: [
          'À dessiner les sprites rapidement',
          'À gérer la fenêtre, la résolution et le périphérique graphique',
          'À charger les textures depuis le disque',
          'À détecter les collisions',
        ],
        correct: 1,
        explanation:
          'GraphicsDeviceManager gère la présentation (taille, plein écran) et crée le GraphicsDevice, l’interface avec le GPU.',
      },
      {
        question: 'Pourquoi utiliser gameTime.ElapsedGameTime ?',
        options: [
          'Pour connaître l’heure système',
          'Pour que les mouvements dépendent du temps réel et non du framerate',
          'Pour limiter le jeu à 60 images par seconde',
          'Pour mesurer la mémoire utilisée',
        ],
        correct: 1,
        explanation:
          'Le delta time permet de rendre les animations et déplacements indépendants de la vitesse de la machine. Une vitesse en pixels par seconde est multipliée par le temps écoulé.',
      },
      {
        question: 'Que se passe-t-il si on oublie GraphicsDevice.Clear() dans Draw ?',
        options: [
          'Le jeu plante immédiatement',
          'Les images s’accumulent et laissent des traînées',
          'Le SpriteBatch ne peut pas démarrer',
          'La fenêtre devient noire',
        ],
        correct: 1,
        explanation:
          'Sans effacement, chaque frame est dessinée par-dessus la précédente. On obtient un effet de rémanence, comme l’écran de victoire du solitaire de Windows XP.',
      },
    ],
    exercises: [
      {
        title: 'Changer la couleur de fond',
        level: 'Facile',
        prompt:
          "Remplace la couleur d’effacement par <code>Color.MonoGameOrange</code>. Vérifie que le jeu compile et que la fenêtre change bien de couleur. Reviens ensuite à <code>Color.CornflowerBlue</code>.",
        hint: 'Une seule ligne dans Draw, à l’intérieur de GraphicsDevice.Clear(...).',
        solution: `protected override void Draw(GameTime gameTime)
{
    GraphicsDevice.Clear(Color.MonoGameOrange);
    base.Draw(gameTime);
}`,
      },
      {
        title: 'Prédire l’ordre des appels',
        level: 'Intermédiaire',
        prompt:
          "Sans lancer le jeu, écris l’ordre des messages affichés si tu ajoutes <code>Console.WriteLine</code> dans le constructeur, <code>Initialize</code>, <code>LoadContent</code>, <code>Update</code> et <code>Draw</code>. Vérifie ensuite dans le terminal.",
        hint: 'Update et Draw sont appelés en boucle : tu verras leurs messages alterner après le démarrage.',
        solution:
          "Constructeur → Initialize (début) → LoadContent (pendant base.Initialize) → Initialize (fin) → Update → Draw → Update → Draw… C’est une excellente façon de visualiser que LoadContent est imbriqué dans Initialize.",
      },
    ],
    sources: [
      {
        label: 'Chapitre 03 officiel — The Game1 File',
        url: 'https://docs.monogame.net/articles/tutorials/building_2d_games/03_the_game1_file/index.html',
      },
      {
        label: 'Documentation GameTime',
        url: 'https://docs.monogame.net/api/Microsoft.Xna.Framework.GameTime.html',
      },
    ],
  },
  {
    slug: 'bibliotheque',
    chapter: 4,
    module: 'demarrer',
    title: 'Une bibliothèque de jeu réutilisable',
    navTitle: 'La bibliothèque MonoGameLibrary',
    description:
      'Sépare ton moteur maison du jeu lui-même : crée une bibliothèque de classes, une classe Core et un point d’accès unique aux systèmes graphiques.',
    duration: 25,
    objectives: [
      'Créer un projet de bibliothèque de classes MonoGame',
      'Ajouter une référence de projet depuis le jeu',
      'Comprendre le patron singleton utilisé par Core',
      'Faire dériver Game1 de Core',
    ],
    blocks: [
      {
        t: 'p',
        html: "À ce stade, tout vit dans <code>Game1.cs</code>. Ça fonctionne, mais ton jeu et ton « moteur » sont mélangés. Dans ce chapitre, tu sépares les deux : <code>DungeonSlime</code> contiendra le jeu, <code>MonoGameLibrary</code> contiendra les briques réutilisables (graphismes, entrées, audio, scènes).",
      },
      {
        t: 'callout',
        tone: 'info',
        title: 'Pourquoi une bibliothèque de classes ?',
        html: "Pour réutiliser ton code dans un autre jeu, pour garder une séparation nette entre infrastructure et contenu, et pour tester plus facilement. C’est aussi la structure utilisée par les projets MonoGame professionnels.",
      },
      { t: 'h2', text: 'Créer la bibliothèque' },
      {
        t: 'p',
        html: "MonoGame fournit le modèle <strong>MonoGame Game Library</strong>, déjà configuré avec la bonne référence de framework. Depuis la racine de la solution :",
      },
      {
        t: 'code',
        lang: 'bash',
        title: 'Terminal, à la racine de DungeonSlime',
        code: `dotnet new mglib -n MonoGameLibrary
dotnet sln DungeonSlime.sln add ./MonoGameLibrary/MonoGameLibrary.csproj
dotnet add ./DungeonSlime.csproj reference ../MonoGameLibrary/MonoGameLibrary.csproj`,
      },
      {
        t: 'p',
        html: "Le modèle génère aussi un <code>Game1.cs</code>, un dossier <code>Content</code> et un dossier <code>.config</code> dans la bibliothèque. Supprime-les : une bibliothèque n’est pas un jeu exécutable. Elle n’a besoin ni de point d’entrée, ni de contenu propre.",
      },
      { t: 'h2', text: 'La classe Core' },
      {
        t: 'p',
        html: "Crée <code>Core.cs</code> à la racine de <code>MonoGameLibrary</code>. Cette classe dérive de <code>Game</code> et centralise ce que tous tes jeux auront besoin de partager : le périphérique graphique, le <code>SpriteBatch</code>, le <code>ContentManager</code>, et plus tard l’audio, les entrées et les scènes.",
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'MonoGameLibrary/Core.cs',
        code: code.core_04,
      },
      {
        t: 'p',
        html: "Trois détails méritent ton attention :",
      },
      {
        t: 'list',
        ordered: true,
        items: [
          "<strong>Le singleton.</strong> <code>s_instance</code> est statique et <code>Instance</code> l’expose. Le constructeur lève une exception si on tente de créer un deuxième <code>Core</code> : un jeu, un point d’entrée.",
          "<strong>Les propriétés statiques.</strong> <code>Core.SpriteBatch</code>, <code>Core.Content</code> et <code>Core.GraphicsDevice</code> sont accessibles partout sans passer une référence. C’est pratique pour un petit jeu ; pour un gros projet, on préférerait l’injection de dépendances.",
          "<strong>Le mot-clé <code>new</code>.</strong> Sur <code>GraphicsDevice</code> et <code>Content</code>, il masque volontairement les propriétés d’instance héritées de <code>Game</code> par des propriétés statiques. À l’intérieur de <code>Core</code>, <code>base.Content</code> continue de pointer vers l’original.",
        ],
      },
      { t: 'h2', text: 'Faire dériver Game1 de Core' },
      {
        t: 'p',
        html: "Dans <code>Game1.cs</code>, supprime les champs <code>_graphics</code> et <code>_spriteBatch</code>, ajoute <code>using MonoGameLibrary;</code>, puis fais dériver <code>Game1</code> de <code>Core</code>. Le constructeur appelle le constructeur de base avec le titre et la résolution.",
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'DungeonSlime/Game1.cs',
        code: code.game1_04,
      },
      {
        t: 'p',
        html: "Lance le jeu : la fenêtre s’appelle désormais « Dungeon Slime » et mesure 1280 × 720. Le rendu est identique, mais l’architecture a changé. <code>Game1</code> ne s’occupe plus que du jeu ; <code>Core</code> s’occupe de la plomberie.",
      },
      {
        t: 'callout',
        tone: 'warn',
        title: '« The type or namespace name Core could not be found »',
        html: "Deux causes possibles : le <code>using MonoGameLibrary;</code> manque, ou la référence de projet n’a pas été ajoutée. Vérifie que <code>dotnet add reference</code> a bien modifié le <code>.csproj</code> du jeu.",
      },
      {
        t: 'callout',
        tone: 'tip',
        title: 'Un singulier détail de conception',
        html: "Le singleton est simple et lisible, mais il crée un couplage global. C’est un choix assumé du tutoriel pour un jeu solo. Si tu réutilises <code>Core</code> dans plusieurs jeux en parallèle, il faudra le remettre en question.",
      },
    ],
    quiz: [
      {
        question: 'Quel modèle de projet crée la bibliothèque MonoGame ?',
        options: ['mglib', 'classlib', 'mgdesktopgl', 'mgtemplate'],
        correct: 0,
        explanation:
          'dotnet new mglib crée une bibliothèque de classes déjà configurée avec les références MonoGame. Un classlib standard demanderait d’ajouter les paquets à la main.',
      },
      {
        question: 'Pourquoi le constructeur de Core lève-t-il une exception si s_instance existe déjà ?',
        options: [
          'Pour empêcher deux jeux de tourner dans le même processus',
          'Parce que C# interdit deux instances de Game',
          'Pour libérer la mémoire du premier jeu',
          'Pour éviter un conflit de résolution',
        ],
        correct: 0,
        explanation:
          'Core applique le patron singleton : il ne doit exister qu’un seul point d’entrée de jeu. Cela garantit que Core.Instance, Core.SpriteBatch et Core.Content désignent toujours le même jeu.',
      },
      {
        question: 'Que fait le mot-clé new sur public static new GraphicsDevice GraphicsDevice ?',
        options: [
          'Il crée une nouvelle instance du GPU',
          'Il masque volontairement le membre hérité de Game par un membre statique',
          'Il rend la propriété accessible seulement dans Core',
          'Il initialise automatiquement le GraphicsDevice',
        ],
        correct: 1,
        explanation:
          'new indique au compilateur que l’on masque intentionnellement le membre hérité. Ici, il permet d’exposer une version statique de GraphicsDevice.',
      },
      {
        question: 'Pourquoi supprimer Content/ et .config/ de la bibliothèque ?',
        options: [
          'Parce qu’ils sont corrompus',
          'Parce qu’une bibliothèque n’a pas besoin de compiler ses propres assets ni de lancer un jeu',
          'Parce que MonoGame ne les supporte pas',
          'Parce qu’ils ralentissent le rendu',
        ],
        correct: 1,
        explanation:
          'Le modèle de bibliothèque reprend la structure d’un projet de jeu. Ici, les assets et les outils MGCB restent dans le projet de jeu ; la bibliothèque ne contient que du code réutilisable.',
      },
    ],
    exercises: [
      {
        title: 'Changer la configuration du jeu',
        level: 'Facile',
        prompt:
          "Modifie l’appel au constructeur de <code>Core</code> pour lancer le jeu en 1600 × 900 avec le titre « Dungeon Slime — Prototype ». Vérifie le résultat.",
        hint: 'Le constructeur de Core prend (title, width, height, fullScreen).',
        solution: `public Game1() : base("Dungeon Slime — Prototype", 1600, 900, false)
{
}`,
      },
      {
        title: 'Ajouter un accès pratique',
        level: 'Intermédiaire',
        prompt:
          "Ajoute à <code>Core</code> une propriété statique <code>public static Rectangle ScreenBounds</code> qui retourne un rectangle <code>(0, 0, width, height)</code> correspondant à la fenêtre. Initialise-la dans le constructeur.",
        hint: 'Graphics.PreferredBackBufferWidth et Height sont disponibles après avoir défini la résolution. Rectangle vient de Microsoft.Xna.Framework.',
        solution: `public static Rectangle ScreenBounds { get; private set; }

// Dans le constructeur, après avoir défini la taille :
ScreenBounds = new Rectangle(0, 0, width, height);`,
      },
      {
        title: 'Réfléchir au singleton',
        level: 'Défi',
        prompt:
          "Écris trois raisons pour lesquelles le singleton de Core peut poser problème dans un gros projet, puis propose une alternative simple.",
        hint: 'Pense aux tests, aux dépendances cachées et à l’ordre d’initialisation.',
        solution:
          "1) Les tests unitaires ne peuvent pas créer facilement un faux Core. 2) Les dépendances sont cachées : une méthode peut utiliser Core.SpriteBatch sans que sa signature l’indique. 3) L’ordre d’initialisation devient implicite et fragile. Alternative : passer les services nécessaires en paramètres de constructeur (injection de dépendances), ou créer un conteneur de services explicite.",
      },
    ],
    sources: [
      {
        label: 'Chapitre 04 officiel — Creating a Class Library',
        url: 'https://docs.monogame.net/articles/tutorials/building_2d_games/04_creating_a_class_library/index.html',
      },
    ],
  },
];
