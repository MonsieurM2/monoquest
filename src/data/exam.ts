import type { QuizQuestion } from './types';

export const examQuestions: QuizQuestion[] = [
  {
    question: 'Quelle affirmation décrit correctement MonoGame ?',
    options: [
      'Un moteur de jeu avec éditeur de scènes intégré',
      'Un framework C# qui fournit rendu, entrées, audio et boucle de jeu',
      'Un langage de script pour Unity',
      'Un format de compilation des textures',
    ],
    correct: 1,
    explanation:
      'MonoGame est un framework code-first. Il fournit les briques bas niveau, mais pas d’éditeur ni d’architecture de jeu prête à l’emploi.',
  },
  {
    question: 'Quelle commande crée un projet desktop MonoGame nommé DungeonSlime ?',
    options: ['dotnet new mgdesktopgl -o DungeonSlime', 'dotnet new monogame -n DungeonSlime', 'dotnet run DungeonSlime', 'mgcb new DungeonSlime'],
    correct: 0,
    explanation:
      'mgdesktopgl est le nom court du modèle Cross-Platform Desktop Application. -o crée le dossier du projet.',
  },
  {
    question: 'Quel est l’ordre de démarrage correct d’un jeu MonoGame ?',
    options: [
      'LoadContent → Initialize → constructeur → Update',
      'Constructeur → Initialize → LoadContent → Update',
      'Initialize → LoadContent → constructeur → Draw',
      'Constructeur → LoadContent → Initialize → Draw',
    ],
    correct: 1,
    explanation:
      'Le constructeur s’exécute à la création. Initialize est ensuite appelé, et base.Initialize() déclenche LoadContent avant la première boucle Update/Draw.',
  },
  {
    question: 'Pourquoi multiplier une vitesse par gameTime.ElapsedGameTime.TotalSeconds ?',
    options: [
      'Pour accélérer le jeu sur les machines rapides',
      'Pour rendre le mouvement indépendant du framerate',
      'Pour limiter le jeu à 30 FPS',
      'Pour synchroniser le son',
    ],
    correct: 1,
    explanation:
      'Le delta time convertit une vitesse en unités par seconde en un déplacement pour la frame courante. Le mouvement reste identique quel que soit le nombre d’images par seconde.',
  },
  {
    question: 'Quel est le rôle principal du Content Pipeline ?',
    options: [
      'Créer les niveaux du jeu',
      'Compiler les assets dans un format optimisé pour la plateforme',
      'Gérer les sauvegardes',
      'Dessiner l’interface',
    ],
    correct: 1,
    explanation:
      'Le Content Pipeline transforme les fichiers bruts (PNG, WAV, TTF…) en assets compilés (.xnb) adaptés à la plateforme cible, avec compression et prétraitement.',
  },
  {
    question: 'Que doit-on toujours faire autour des appels SpriteBatch.Draw ?',
    options: [
      'Appeler Clear deux fois',
      'Encadrer les Draw par Begin() et End()',
      'Créer un nouveau SpriteBatch à chaque frame',
      'Appeler base.Draw avant Begin',
    ],
    correct: 1,
    explanation:
      'SpriteBatch regroupe les draws entre Begin et End, puis envoie le lot au GPU. Sans End, rien n’est rendu.',
  },
  {
    question: 'Quel est l’avantage principal d’un atlas de textures ?',
    options: [
      'Il réduit le nombre de texture swaps et la mémoire utilisée',
      'Il augmente la résolution des sprites',
      'Il remplace le Content Pipeline',
      'Il anime automatiquement les sprites',
    ],
    correct: 0,
    explanation:
      'En dessinant plusieurs sprites depuis une seule texture, on évite de rebinder le GPU à chaque draw. L’atlas simplifie aussi la gestion des assets.',
  },
  {
    question: 'Que fait le paramètre sourceRectangle de SpriteBatch.Draw ?',
    options: [
      'Il définit la position à l’écran',
      'Il sélectionne une zone de la texture à dessiner',
      'Il applique une rotation',
      'Il change la couleur du sprite',
    ],
    correct: 1,
    explanation:
      'sourceRectangle sélectionne la région de la texture (par exemple une frame dans un atlas). TextureRegion encapsule cette information.',
  },
  {
    question: 'À quoi sert l’Origin d’un sprite ?',
    options: [
      'À définir le point de pivot pour la rotation et l’échelle',
      'À positionner le sprite dans le monde',
      'À choisir la frame d’animation',
      'À définir la couleur de fond',
    ],
    correct: 0,
    explanation:
      'Origin est exprimé dans les coordonnées locales de la texture. Le placer au centre permet de tourner autour du centre ; à (0,0), la rotation se fait autour du coin supérieur gauche.',
  },
  {
    question: 'Comment sait-on qu’une touche vient d’être enfoncée (et non maintenue) ?',
    options: [
      'Keyboard.GetState().IsKeyDown(Keys.Space)',
      'Comparer l’état actuel et l’état précédent',
      'Utiliser Keys.Space == true',
      'Appeler Keyboard.Reset()',
    ],
    correct: 1,
    explanation:
      'Keyboard.GetState() ne donne que l’état instantané. Pour détecter un front montant, il faut mémoriser l’état de la frame précédente et comparer.',
  },
  {
    question: 'Dans l’InputManager, à quoi sert le dictionnaire de touches précédentes ?',
    options: [
      'À configurer les touches',
      'À détecter les transitions (pressed/released) entre deux frames',
      'À afficher les contrôles à l’écran',
      'À gérer les manettes',
    ],
    correct: 1,
    explanation:
      'En comparant l’état courant à l’état précédent, on distingue une touche maintenue d’un appui ou d’un relâchement survenu pendant la frame.',
  },
  {
    question: 'Pourquoi compare-t-on souvent le carré de la distance pour une collision de cercles ?',
    options: [
      'Parce que le carré est plus joli',
      'Pour éviter un calcul de racine carrée inutile',
      'Parce que Math.Sqrt est interdit en jeu',
      'Pour obtenir une collision pixel-perfect',
    ],
    correct: 1,
    explanation:
      'La condition distance < rayon1 + rayon2 est équivalente à distance² < (rayon1 + rayon2)². Comparer les carrés évite une racine carrée coûteuse à chaque vérification.',
  },
  {
    question: 'Quelle est la différence entre un tileset et une tilemap ?',
    options: [
      'Un tileset est une image de tuiles, une tilemap est un agencement de ces tuiles',
      'Un tileset est un niveau, une tilemap est une animation',
      'Un tileset contient les collisions, une tilemap les sons',
      'Les deux termes sont strictement identiques',
    ],
    correct: 0,
    explanation:
      'Le tileset décrit les tuiles disponibles (souvent dans un atlas). La tilemap place des indices de tuiles sur une grille pour former le niveau.',
  },
  {
    question: 'Quel type MonoGame utilise-t-on pour un effet sonore court et répétable ?',
    options: ['Song', 'SoundEffect', 'MediaPlayer', 'AudioListener'],
    correct: 1,
    explanation:
      'SoundEffect est conçu pour les effets courts (saut, collision, collecte). Song, joué via MediaPlayer, est destiné à la musique de fond.',
  },
  {
    question: 'Pourquoi utiliser un AudioController plutôt que SoundEffect.Play() partout ?',
    options: [
      'Pour centraliser le volume, le mute et la gestion des ressources',
      'Parce que SoundEffect.Play() est obsolète',
      'Pour accélérer le rendu',
      'Pour éviter le Content Pipeline',
    ],
    correct: 0,
    explanation:
      'Un contrôleur centralise le volume, coupe ou rétablit le son, et libère les ressources. Cela évite de dupliquer la logique dans chaque scène.',
  },
  {
    question: 'Que permet un SpriteFont ?',
    options: [
      'Dessiner du texte avec SpriteBatch',
      'Créer des animations de sprites',
      'Compiler des shaders',
      'Charger des cartes de niveau',
    ],
    correct: 0,
    explanation:
      'Un SpriteFont décrit une police bitmap générée par le Content Pipeline. SpriteBatch.DrawString permet ensuite de dessiner du texte.',
  },
  {
    question: 'Pourquoi les scènes implémentent-elles souvent IDisposable ?',
    options: [
      'Pour libérer les ressources et désabonner les événements quand on change de scène',
      'Pour accélérer le chargement',
      'Pour permettre plusieurs scènes simultanées',
      'Parce que Game l’exige',
    ],
    correct: 0,
    explanation:
      'Une scène peut contenir des ressources, des écouteurs d’événements ou des abonnements. Dispose permet de les libérer proprement lors d’une transition.',
  },
  {
    question: 'Quel SamplerState privilégier pour un pixel art net ?',
    options: ['SamplerState.LinearClamp', 'SamplerState.PointClamp', 'SamplerState.AnisotropicClamp', 'SamplerState.LinearWrap'],
    correct: 1,
    explanation:
      'PointClamp utilise le texel le plus proche sans interpolation, ce qui conserve des bords nets. Linear adoucirait le pixel art.',
  },
  {
    question: 'Quel type de shader calcule la couleur finale d’un pixel ?',
    options: ['Vertex shader', 'Pixel shader (fragment shader)', 'Geometry shader', 'Compute shader'],
    correct: 1,
    explanation:
      'Le pixel shader s’exécute pour chaque fragment et détermine sa couleur. Le vertex shader transforme les sommets avant la rasterisation.',
  },
  {
    question: 'Que produit dotnet publish avec --self-contained ?',
    options: [
      'Un projet Visual Studio',
      'Un dossier contenant le jeu et le runtime .NET nécessaire',
      'Un fichier .mgcb',
      'Un paquet NuGet',
    ],
    correct: 1,
    explanation:
      'Une publication self-contained inclut le runtime .NET avec le jeu. Le joueur n’a pas besoin d’installer .NET séparément.',
  },
];
