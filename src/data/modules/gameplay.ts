import { code } from '../../content/code';
import type { Lesson } from '../types';

export const gameplayLessons: Lesson[] = [
  {
    slug: 'collisions',
    chapter: 11,
    module: 'gameplay',
    title: 'Détecter et résoudre les collisions',
    navTitle: 'Les collisions',
    description:
      'Cercles, rectangles, distance au carré et réponse aux collisions : fais interagir le slime, la chauve-souris et les bords du donjon.',
    duration: 35,
    objectives: [
      'Choisir une forme de collision adaptée',
      'Utiliser la distance au carré pour les cercles',
      'Distinguer détection et réponse',
      'Empêcher un sprite de sortir de l’écran',
    ],
    blocks: [
      {
        t: 'p',
        html: "Détecter une collision, c’est répondre à une question géométrique : est-ce que deux formes se chevauchent ? La <strong>réponse</strong> est une autre question : que fait-on ensuite ? Repousser, rebondir, déclencher une collecte, terminer la partie. Le tutoriel sépare les deux, et c’est une bonne habitude.",
      },
      { t: 'h2', text: 'Cercles ou rectangles ?' },
      {
        t: 'table',
        head: ['Forme', 'Quand l’utiliser', 'Test'],
        rows: [
          ['Cercle', 'Personnages, projectiles, objets ronds', 'distance entre centres < somme des rayons'],
          ['Rectangle (AABB)', 'Tuiles, murs, interfaces, objets alignés', '<code>Rectangle.Intersects</code>'],
          ['Pixel-perfect', 'Jeux de tir ou de précision, rarement nécessaire', 'Coûteux, à réserver aux cas critiques'],
        ],
      },
      {
        t: 'p',
        html: "Le slime et la chauve-souris sont globalement ronds : un cercle suffit et reste très rapide. Un cercle épouse mieux leur silhouette qu’un rectangle, sans le coût du pixel-perfect.",
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'MonoGameLibrary/Circle.cs — extrait',
        code: `public readonly struct Circle : IEquatable<Circle>
{
    public readonly int X;
    public readonly int Y;
    public readonly int Radius;

    public Point Location => new Point(X, Y);
    public int Left => X - Radius;
    public int Right => X + Radius;
    public int Top => Y - Radius;
    public int Bottom => Y + Radius;

    public bool Intersects(Circle other)
    {
        int radiiSquared = (Radius + other.Radius) * (Radius + other.Radius);
        float distanceSquared = Vector2.DistanceSquared(
            Location.ToVector2(),
            other.Location.ToVector2()
        );
        return distanceSquared < radiiSquared;
    }
}`,
      },
      {
        t: 'callout',
        tone: 'key',
        title: 'Pourquoi distancer au carré ?',
        html: "La condition « distance < rayons additionnés » est équivalente à « distance² < (rayons additionnés)² ». Comparer les carrés évite une racine carrée par vérification. Sur des milliers de tests par frame, cela compte.",
      },
      { t: 'h2', text: 'Construire les bounds d’un sprite' },
      {
        t: 'p',
        html: "La position d’un sprite est son coin supérieur gauche. Le cercle de collision se calcule à partir du centre et de la moitié de la taille réelle (qui tient déjà compte de l’échelle).",
      },
      {
        t: 'code',
        lang: 'csharp',
        code: `Circle GetBounds(Vector2 position, Sprite sprite)
{
    return new Circle(
        (int)(position.X + sprite.Width * 0.5f),
        (int)(position.Y + sprite.Height * 0.5f),
        (int)(sprite.Width * 0.5f)
    );
}

Circle slimeBounds = GetBounds(_slimePosition, _slime);
Circle batBounds = GetBounds(_batPosition, _bat);

if (slimeBounds.Intersects(batBounds))
{
    _score += 100;
    PositionBatAwayFromSlime();
}`,
      },
      {
        t: 'callout',
        tone: 'warn',
        title: 'Utiliser la taille réelle',
        html: "Si tu utilises <code>_slime.Width / 2</code> sans tenir compte de l’échelle, ton cercle sera trop petit. La propriété <code>Width</code> de <code>Sprite</code> inclut déjà le facteur d’échelle ; c’est justement pour cela qu’elle existe.",
      },
      { t: 'h2', text: 'Contenir le slime dans l’arène' },
      {
        t: 'p',
        html: "Pas besoin d’un moteur physique pour empêcher un sprite de sortir de l’écran. On compare les bords du cercle à ceux de l’arène et on corrige la position. C’est une <strong>réponse par blocage</strong>.",
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'Rester dans les limites',
        code: `Rectangle room = new Rectangle(
    32, 32,
    GraphicsDevice.PresentationParameters.BackBufferWidth - 64,
    GraphicsDevice.PresentationParameters.BackBufferHeight - 64
);

Circle bounds = new Circle(
    (int)(_slimePosition.X + _slime.Width * 0.5f),
    (int)(_slimePosition.Y + _slime.Height * 0.5f),
    (int)(_slime.Width * 0.5f)
);

if (bounds.Left < room.Left)
    _slimePosition.X = room.Left;
else if (bounds.Right > room.Right)
    _slimePosition.X = room.Right - _slime.Width;

if (bounds.Top < room.Top)
    _slimePosition.Y = room.Top;
else if (bounds.Bottom > room.Bottom)
    _slimePosition.Y = room.Bottom - _slime.Height;`,
      },
      { t: 'h2', text: 'Répondre : bloquer, collecter ou rebondir' },
      {
        t: 'list',
        items: [
          "<strong>Bloquer</strong> : remettre l’objet à l’intérieur de la limite (murs, bords de l’écran).",
          "<strong>Collecter</strong> : supprimer l’objet, incrémenter le score, jouer un son, réapparaître ailleurs.",
          "<strong>Rebondir</strong> : inverser la vitesse selon la normale de la surface. C’est ce que fait la chauve-souris sur les bords du donjon.",
          "<strong>Terminer</strong> : collision entre la tête du serpent et son corps → game over.",
        ],
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'Rebondir sur un bord avec Vector2.Reflect',
        code: `Vector2 normal = Vector2.Zero;

if (batBounds.Left < room.Left)
{
    normal = Vector2.UnitX;
    newBatPosition.X = room.Left;
}
else if (batBounds.Right > room.Right)
{
    normal = -Vector2.UnitX;
    newBatPosition.X = room.Right - _bat.Width;
}

if (normal != Vector2.Zero)
{
    _batVelocity = Vector2.Reflect(_batVelocity, normal);
}`,
      },
      {
        t: 'callout',
        tone: 'tip',
        title: 'Le piège du tunneling',
        html: "Si un objet se déplace plus vite que sa taille, il peut traverser un mur entre deux frames. Pour un jeu rapide, découpe le déplacement en sous-étapes ou utilise un raycast. Pour Dungeon Slime, les vitesses restent modestes.",
      },
      { t: 'h2', text: 'Performance : ne teste pas tout' },
      {
        t: 'p',
        html: "Avec 10 000 objets, tester toutes les paires coûte 50 millions de vérifications. En pratique, on limite les tests aux objets proches grâce à une grille spatiale ou à un quad tree. Pour notre jeu, une poignée d’objets suffit : la simplicité prime.",
      },
      {
        t: 'p',
        html: "Tu sais détecter et répondre. Le prochain chapitre construit le décor : un donjon en tuiles, dessiné à partir d’un tileset et d’une carte.",
      },
    ],
    quiz: [
      {
        question: 'Pourquoi compare-t-on les distances au carré ?',
        options: [
          'Pour éviter une racine carrée coûteuse',
          'Parce que les cercles n’ont pas de rayon',
          'Pour obtenir une collision pixel-perfect',
          'Parce que Vector2.Distance n’existe pas',
        ],
        correct: 0,
        explanation:
          'Comparer d² < (r1+r2)² donne le même résultat que d < r1+r2, sans calculer la racine carrée.',
      },
      {
        question: 'Quelle est la différence entre détection et réponse ?',
        options: [
          'Aucune, ce sont des synonymes',
          'La détection constate le chevauchement ; la réponse décide de l’effet',
          'La réponse est plus rapide',
          'La détection ne concerne que les rectangles',
        ],
        correct: 1,
        explanation:
          'Détecter répond à « est-ce que ça touche ? ». Répondre choisit l’action : bloquer, collecter, rebondir, terminer.',
      },
      {
        question: 'Où se trouve le centre d’un cercle de collision calculé depuis un sprite ?',
        options: [
          'À la position du sprite',
          'À position + taille / 2',
          'À position + taille',
          'À l’origine de la texture',
        ],
        correct: 1,
        explanation:
          'La position est le coin supérieur gauche. Le centre est décalé de la moitié de la largeur et de la hauteur réelles.',
      },
      {
        question: 'Quel est le risque si un objet va très vite ?',
        options: [
          'Il change de couleur',
          'Il peut traverser un mur entre deux frames (tunneling)',
          'Il ne peut plus être dessiné',
          'Il perd son animation',
        ],
        correct: 1,
        explanation:
          'La collision n’est testée qu’à des instants discrets. Un déplacement trop grand peut sauter par-dessus l’obstacle. On découpe alors le mouvement ou on utilise un raycast.',
      },
    ],
    exercises: [
      {
        title: 'Tester deux cercles',
        level: 'Facile',
        prompt:
          "Écris une fonction qui prend deux cercles (x, y, rayon) et retourne vrai s’ils se touchent. Utilise les carrés des distances.",
        hint: 'dx = x1 - x2 ; dy = y1 - y2 ; compare dx² + dy² à (r1 + r2)².',
        solution: `public static bool CirclesIntersect(float x1, float y1, float r1, float x2, float y2, float r2)
{
    float dx = x1 - x2;
    float dy = y1 - y2;
    float radii = r1 + r2;
    return dx * dx + dy * dy < radii * radii;
}`,
        solutionLang: 'csharp',
      },
      {
        title: 'Collecter la chauve-souris',
        level: 'Intermédiaire',
        prompt:
          "Quand le slime touche la chauve-souris, augmente le score de 100 et replace la chauve-souris à une position aléatoire dans l’arène, sans qu’elle réapparaisse sur le slime.",
        hint: 'Utilise Random.Shared.Next pour choisir une colonne et une ligne, puis vérifie la distance avec le slime.',
        solution: `if (slimeBounds.Intersects(batBounds))
{
    _score += 100;

    do
    {
        int column = Random.Shared.Next(1, _tilemap.Columns - 1);
        int row = Random.Shared.Next(1, _tilemap.Rows - 1);
        _batPosition = new Vector2(column * _bat.Width, row * _bat.Height);
    }
    while (Vector2.Distance(_batPosition, _slimePosition) < 100f);
}`,
        solutionLang: 'csharp',
      },
      {
        title: 'AABB simple',
        level: 'Défi',
        prompt:
          "Écris une fonction <code>Intersects(Rectangle a, Rectangle b)</code> sans utiliser <code>Rectangle.Intersects</code>, puis compare avec l’implémentation de MonoGame.",
        hint: 'Deux rectangles se chevauchent si a.Left < b.Right, a.Right > b.Left, a.Top < b.Bottom et a.Bottom > b.Top.',
        solution: `public static bool Intersects(Rectangle a, Rectangle b)
{
    return a.Left < b.Right
        && a.Right > b.Left
        && a.Top < b.Bottom
        && a.Bottom > b.Top;
}`,
        solutionLang: 'csharp',
      },
    ],
    sources: [
      {
        label: 'Chapitre 12 officiel — Collision Detection',
        url: 'https://docs.monogame.net/articles/tutorials/building_2d_games/12_collision_detection/index.html',
      },
    ],
  },
  {
    slug: 'tilemaps',
    chapter: 12,
    module: 'gameplay',
    title: 'Construire un donjon en tilemaps',
    navTitle: 'Les tilemaps',
    description:
      'Assemble un niveau à partir d’un tileset et d’une grille d’indices, puis dessine-le en une seule passe.',
    duration: 40,
    objectives: [
      'Distinguer tileset et tilemap',
      'Découper un tileset en régions',
      'Charger une carte depuis un fichier XML',
      'Dessiner et faire évoluer une grille de tuiles',
    ],
    blocks: [
      {
        t: 'p',
        html: "Un donjon n’est pas une immense image : c’est une grille. Chaque case contient un indice qui pointe vers une tuile d’un <strong>tileset</strong>. La <strong>tilemap</strong> ne stocke que des entiers, ce qui rend les niveaux petits, modifiables et faciles à générer.",
      },
      {
        t: 'table',
        head: ['Élément', 'Rôle'],
        rows: [
          ['Tileset', 'Une image découpée en tuiles de taille fixe (sol, mur, coin…)'],
          ['Tilemap', 'Une grille d’indices qui dit quelle tuile afficher à chaque case'],
          ['Index 0', 'Souvent une tuile vide ou le coin supérieur gauche du tileset'],
        ],
      },
      {
        t: 'image',
        src: '/images/tileset-to-tilemap-example.png',
        alt: 'Passage d’un tileset à une tilemap dans MonoGame',
        caption: 'Le tileset fournit les tuiles, la tilemap les place. Image : tutoriel officiel.',
        wide: true,
      },
      { t: 'h2', text: 'La classe Tileset' },
      {
        t: 'p',
        html: "Le tileset prend une région de texture (par exemple une zone de l’atlas) et la découpe en une grille de tuiles. Il expose un index par colonne/ligne et des méthodes <code>GetTile</code>.",
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'MonoGameLibrary/Graphics/Tileset.cs',
        code: code.tileset,
      },
      { t: 'h2', text: 'La classe Tilemap' },
      {
        t: 'p',
        html: "La tilemap stocke un tableau d’entiers de taille <code>Columns × Rows</code>. <code>SetTile</code> écrit un indice, <code>GetTile</code> renvoie la région correspondante, et <code>Draw</code> parcourt la grille.",
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'Tilemap.cs — extraits essentiels',
        code: `public class Tilemap
{
    private readonly Tileset _tileset;
    private readonly int[] _tiles;

    public int Rows { get; }
    public int Columns { get; }
    public Vector2 Scale { get; set; } = Vector2.One;

    public float TileWidth => _tileset.TileWidth * Scale.X;
    public float TileHeight => _tileset.TileHeight * Scale.Y;

    public void SetTile(int column, int row, int tilesetID)
    {
        _tiles[ row * Columns + column ] = tilesetID;
    }

    public TextureRegion GetTile(int column, int row)
    {
        return _tileset.GetTile(_tiles[ row * Columns + column ]);
    }

    public void Draw(SpriteBatch spriteBatch)
    {
        for (int i = 0; i < _tiles.Length; i++)
        {
            int x = i % Columns;
            int y = i / Columns;
            Vector2 position = new Vector2(x * TileWidth, y * TileHeight);
            GetTile(x, y).Draw(spriteBatch, position, Color.White, 0f, Vector2.Zero, Scale, SpriteEffects.None, 1f);
        }
    }
}`,
      },
      {
        t: 'callout',
        tone: 'info',
        title: 'Index row-major',
        html: "L’indice d’une case vaut <code>row * Columns + column</code>. C’est la convention des tableaux 2D aplatis, utilisée par la carte XML et par le dessin. Une erreur d’un facteur <code>Columns</code> décale toute la carte : vérifie cette formule en premier.",
      },
      { t: 'h2', text: 'Décrire la carte en XML' },
      {
        t: 'code',
        lang: 'xml',
        title: 'Content/images/tilemap-definition.xml',
        code: `<Tilemap>
    <Tileset region="0 40 80 80" tileWidth="20" tileHeight="20">images/atlas</Tileset>
    <Tiles>
        00 01 02 01 02 01 02 01 02 01 02 01 02 01 02 03
        04 05 05 06 05 05 06 05 05 06 05 05 06 05 05 07
        08 09 09 09 09 09 09 09 09 09 09 09 09 09 09 11
        04 09 09 09 09 09 09 09 10 09 09 09 09 10 09 07
        08 09 10 09 09 09 09 09 09 09 09 09 09 09 09 11
        04 09 09 09 09 09 09 09 09 09 09 09 09 09 09 07
        08 10 09 09 09 09 09 09 09 09 10 09 09 09 09 11
        04 09 09 09 09 09 10 09 09 09 09 09 09 09 09 07
        12 13 14 13 14 13 14 13 14 13 14 13 14 13 14 15
    </Tiles>
</Tilemap>`,
      },
      {
        t: 'p',
        html: "La tuile 0 est le coin supérieur gauche du tileset, 1 la suivante sur la ligne, etc. Le nombre de lignes et de colonnes est déduit du contenu. Les valeurs sont en hexadécimal ou en décimal selon le parseur ; ici, les indices vont de 00 à 15, donc un tileset de 4 × 4 tuiles.",
      },
      { t: 'h2', text: 'Charger et dessiner la carte' },
      {
        t: 'code',
        lang: 'csharp',
        title: 'DungeonSlime/Game1.cs — extrait',
        code: `private Tilemap _tilemap;

protected override void LoadContent()
{
    _tilemap = Tilemap.FromFile(Content, "images/tilemap-definition.xml");
    _tilemap.Scale = new Vector2(4f, 4f);
}

protected override void Draw(GameTime gameTime)
{
    GraphicsDevice.Clear(Color.CornflowerBlue);
    SpriteBatch.Begin(samplerState: SamplerState.PointClamp);
    _tilemap.Draw(SpriteBatch);
    _slime.Draw(SpriteBatch, _slimePosition);
    _bat.Draw(SpriteBatch, _batPosition);
    SpriteBatch.End();
    base.Draw(gameTime);
}`,
      },
      {
        t: 'callout',
        tone: 'tip',
        title: 'Collisions avec les murs',
        html: "Le tutoriel garde la carte purement visuelle et utilise une arène rectangulaire. Pour des murs solides, tu peux tester la tuile sous le sprite avec <code>GetTile(column, row)</code> et bloquer le déplacement. Commence simple : un niveau rectangulaire suffit pour apprendre.",
      },
      {
        t: 'p',
        html: "Le donjon est en place. Il manque le son, le texte et l’organisation en scènes pour transformer cette démo en jeu.",
      },
    ],
    quiz: [
      {
        question: 'Quelle est la différence entre un tileset et une tilemap ?',
        options: [
          'Le tileset contient les tuiles, la tilemap les place sur une grille',
          'La tilemap contient les images, le tileset les indices',
          'Les deux sont identiques',
          'Le tileset gère les collisions, la tilemap les animations',
        ],
        correct: 0,
        explanation:
          'Le tileset est la planche de tuiles. La tilemap est la grille d’indices qui compose le niveau.',
      },
      {
        question: 'Comment calcule-t-on l’indice d’une case (column, row) ?',
        options: ['column + row', 'row * Columns + column', 'column * Rows + row', 'row + Columns'],
        correct: 1,
        explanation:
          'C’est la formule row-major d’un tableau 2D aplati : chaque ligne avance de Columns cases.',
      },
      {
        question: 'Que stocke principalement une tilemap ?',
        options: ['Des textures complètes', 'Des indices de tuiles', 'Des fichiers audio', 'Des collisions pixel-perfect'],
        correct: 1,
        explanation:
          'Un tableau d’entiers par case. Les textures restent dans le tileset, partagées par toutes les tuiles.',
      },
      {
        question: 'Pourquoi régler Tilemap.Scale plutôt que la taille de chaque tuile ?',
        options: [
          'Pour changer la résolution de la fenêtre',
          'Pour agrandir toute la carte d’un facteur sans dupliquer les assets',
          'Pour accélérer le chargement',
          'Pour activer les collisions',
        ],
        correct: 1,
        explanation:
          'Scale multiplie la taille de dessin et les distances entre cases. Le tileset source reste en petite résolution, ce qui économise de la mémoire.',
      },
    ],
    exercises: [
      {
        title: 'Changer une tuile',
        level: 'Facile',
        prompt:
          "Après avoir chargé la tilemap, remplace la tuile centrale par une autre tuile du tileset (par exemple l’indice 10).",
        hint: 'SetTile prend (column, row, tilesetID).',
        solution: `_tilemap.SetTile(_tilemap.Columns / 2, _tilemap.Rows / 2, 10);`,
        solutionLang: 'csharp',
      },
      {
        title: 'Générer un sol',
        level: 'Intermédiaire',
        prompt:
          "Écris une boucle qui remplit toute la carte avec la tuile 9, puis place des murs (tuile 4) sur la première et la dernière colonne.",
        hint: 'Deux boucles imbriquées, puis deux boucles pour les colonnes de bord.',
        solution: `for (int row = 0; row < _tilemap.Rows; row++)
{
    for (int column = 0; column < _tilemap.Columns; column++)
    {
        _tilemap.SetTile(column, row, 9);
    }
}

for (int row = 0; row < _tilemap.Rows; row++)
{
    _tilemap.SetTile(0, row, 4);
    _tilemap.SetTile(_tilemap.Columns - 1, row, 4);
}`,
        solutionLang: 'csharp',
      },
      {
        title: 'Collision avec les murs',
        level: 'Défi',
        prompt:
          "Décris un algorithme pour empêcher le slime de traverser une tuile solide, en utilisant GetTile et la position du sprite. Quelles cases faut-il tester ?",
        hint: 'Teste les quatre coins du rectangle du sprite, ou la case sous chaque coin après le déplacement.',
        solution:
          "On calcule la boîte du sprite après déplacement, puis on convertit ses quatre coins en coordonnées de tuiles : column = x / TileWidth, row = y / TileHeight. Si l’une des cases contient une tuile solide, on annule le déplacement sur l’axe concerné (ou on repousse le sprite au bord de la tuile). Tester les coins suffit pour des tuiles alignées sur la grille ; pour un sprite plus large qu’une tuile, il faut aussi tester les cases intermédiaires sur chaque bord.",
      },
    ],
    sources: [
      {
        label: 'Chapitre 13 officiel — Working with Tilemaps',
        url: 'https://docs.monogame.net/articles/tutorials/building_2d_games/13_working_with_tilemaps/index.html',
      },
    ],
  },
  {
    slug: 'audio',
    chapter: 13,
    module: 'gameplay',
    title: 'Sons, musique et AudioController',
    navTitle: 'Le son et la musique',
    description:
      'Charge des effets sonores et une musique, gère les instances, le volume, le mute et la libération des ressources.',
    duration: 40,
    objectives: [
      'Choisir entre SoundEffect et Song',
      'Ajouter et charger des fichiers audio',
      'Jouer plusieurs effets simultanément',
      'Centraliser le volume et le mute dans un contrôleur',
    ],
    blocks: [
      {
        t: 'p',
        html: "Le son est ce qui donne du poids à une action. Un saut sans « pop », une collecte sans « ding » : le jeu semble vide. MonoGame propose deux objets complémentaires : <code>SoundEffect</code> pour les effets courts, <code>Song</code> pour la musique de fond.",
      },
      {
        t: 'table',
        head: ['Classe', 'Usage', 'Lecture'],
        rows: [
          ['<code>SoundEffect</code>', 'Impacts, sauts, collectes, interface', '<code>CreateInstance().Play()</code> ou <code>SoundEffect.Play()</code>'],
          ['<code>Song</code>', 'Musique de fond, longue durée', '<code>MediaPlayer.Play(song)</code>'],
        ],
      },
      { t: 'h2', text: 'Ajouter les fichiers au Content' },
      {
        t: 'steps',
        items: [
          {
            title: 'Créer un dossier audio',
            html: "Dans le MGCB Editor, ajoute un dossier <code>audio</code> sous <code>Content</code>.",
          },
          {
            title: 'Ajouter les fichiers',
            html: "Ajoute <code>bounce.wav</code>, <code>collect.wav</code>, <code>ui.wav</code> et <code>theme.ogg</code>. Le pipeline les convertit au format de la plateforme.",
          },
          {
            title: 'Vérifier les propriétés',
            html: "Pour la musique, tu peux choisir le mode de chargement et le format de compression. Pour un effet court, garde les valeurs par défaut et teste le rendu.",
          },
        ],
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'Charger et jouer un effet',
        code: `private SoundEffect _collectSound;

protected override void LoadContent()
{
    _collectSound = Content.Load<SoundEffect>("audio/collect");
}

private void OnCollect()
{
    _collectSound.Play();
}`,
      },
      {
        t: 'callout',
        tone: 'info',
        title: 'Formats supportés',
        html: "Le pipeline gère notamment WAV, MP3 et OGG. Pour un effet court, privilégie le WAV non compressé : la latence est plus faible. Pour une musique longue, l’OGG ou le MP3 économise de la place.",
      },
      { t: 'h2', text: 'Musique et volume' },
      {
        t: 'code',
        lang: 'csharp',
        code: `private Song _theme;

protected override void LoadContent()
{
    _theme = Content.Load<Song>("audio/theme");
}

private void StartMusic()
{
    if (MediaPlayer.State == MediaState.Playing)
    {
        MediaPlayer.Stop();
    }

    MediaPlayer.Play(_theme);
    MediaPlayer.IsRepeating = true;
    MediaPlayer.Volume = 0.6f;
}`,
      },
      {
        t: 'p',
        html: "Attention : <code>MediaPlayer</code> est global. Une seule musique à la fois. Si tu changes de scène, tu peux la laisser tourner ou la remplacer explicitement. Pour les effets, crée une <strong>instance</strong> par lecture : cela permet de superposer plusieurs sons et de suivre leur état.",
      },
      { t: 'h2', text: 'Le contrôleur audio' },
      {
        t: 'p',
        html: "Un <code>AudioController</code> centralise les volumes, le mute, la pause et la libération des instances terminées. Sans lui, chaque scène répète la même logique et oublie de libérer les ressources.",
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'MonoGameLibrary/Audio/AudioController.cs — API principale',
        code: `public class AudioController : IDisposable
{
    public bool IsMuted { get; private set; }
    public float SongVolume { get; set; }
    public float SoundEffectVolume { get; set; }

    public SoundEffectInstance PlaySoundEffect(SoundEffect soundEffect);
    public SoundEffectInstance PlaySoundEffect(
        SoundEffect soundEffect,
        float volume,
        float pitch,
        float pan,
        bool isLooped
    );

    public void PlaySong(Song song, bool isRepeating = true);
    public void PauseAudio();
    public void ResumeAudio();
    public void MuteAudio();
    public void UnmuteAudio();
    public void ToggleMute();
    public void Update();
    public void Dispose();
}`,
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'Extrait : jouer une instance et nettoyer',
        code: `public SoundEffectInstance PlaySoundEffect(SoundEffect soundEffect)
{
    SoundEffectInstance instance = soundEffect.CreateInstance();
    instance.Volume = 1.0f;
    instance.Pitch = 1.0f;
    instance.Pan = 0.0f;
    instance.IsLooped = false;
    instance.Play();

    _activeSoundEffectInstances.Add(instance);
    return instance;
}

public void Update()
{
    for (int i = _activeSoundEffectInstances.Count - 1; i >= 0; i--)
    {
        SoundEffectInstance instance = _activeSoundEffectInstances[i];

        if (instance.State == SoundState.Stopped)
        {
            instance.Dispose();
            _activeSoundEffectInstances.RemoveAt(i);
        }
    }
}`,
      },
      {
        t: 'callout',
        tone: 'key',
        title: 'Toujours libérer',
        html: "Les instances audio consomment des ressources non managées. Si tu ne les libères pas quand elles sont arrêtées, la mémoire grimpe et certaines plateformes finissent par refuser de nouveaux sons. Le contrôleur s’en charge à chaque <code>Update</code>.",
      },
      { t: 'h2', text: 'Brancher dans Core' },
      {
        t: 'code',
        lang: 'csharp',
        title: 'Extraits de Core.cs',
        code: `public static AudioController Audio { get; private set; }

protected override void Initialize()
{
    base.Initialize();
    Audio = new AudioController();
}

protected override void Update(GameTime gameTime)
{
    Audio.Update();
    base.Update(gameTime);
}

protected override void UnloadContent()
{
    Audio.Dispose();
    base.UnloadContent();
}`,
      },
      {
        t: 'p',
        html: "Utilisation dans une scène : <code>Core.Audio.PlaySoundEffect(_collectSound);</code>, <code>Core.Audio.ToggleMute();</code>. Le reste du jeu n’a plus à connaître <code>MediaPlayer</code> ni les volumes.",
      },
    ],
    quiz: [
      {
        question: 'Quel objet privilégier pour un effet court et répétable ?',
        options: ['Song', 'SoundEffect', 'MediaPlayer', 'AudioListener'],
        correct: 1,
        explanation:
          'SoundEffect est conçu pour les effets courts et peut être joué plusieurs fois en parallèle via des instances.',
      },
      {
        question: 'Pourquoi créer une SoundEffectInstance plutôt que SoundEffect.Play() ?',
        options: [
          'Pour contrôler le volume, le pitch, le pan et suivre l’état de chaque lecture',
          'Parce que Play() est obsolète',
          'Pour accélérer le rendu',
          'Pour éviter le Content Pipeline',
        ],
        correct: 0,
        explanation:
          'Une instance permet de régler les paramètres et de gérer la durée de vie de chaque lecture indépendamment.',
      },
      {
        question: 'Que fait AudioController.Update() ?',
        options: [
          'Il change la musique',
          'Il libère les instances d’effets arrêtées',
          'Il augmente le volume',
          'Il recharge les sons',
        ],
        correct: 1,
        explanation:
          'Il parcourt les instances actives, supprime celles qui sont arrêtées et libère leurs ressources.',
      },
      {
        question: 'Combien de musiques MediaPlayer peut-il lire simultanément ?',
        options: ['Une seule', 'Deux', 'Quatre', 'Illimité'],
        correct: 0,
        explanation:
          'MediaPlayer est global et ne lit qu’une chanson à la fois. Les effets sonores, eux, peuvent se superposer.',
      },
    ],
    exercises: [
      {
        title: 'Jouer un son à la collecte',
        level: 'Facile',
        prompt:
          "Charge <code>audio/collect</code> et joue-le quand le slime touche la chauve-souris, sans le rejouer à chaque frame.",
        hint: 'La collision est détectée une fois par contact ; place l’appel dans le bloc if (slimeBounds.Intersects(batBounds)).',
        solution: `_collectSound.Play();

// ou, avec le contrôleur :
Core.Audio.PlaySoundEffect(_collectSound);`,
        solutionLang: 'csharp',
      },
      {
        title: 'Effet de rebond',
        level: 'Intermédiaire',
        prompt:
          "Ajoute un son de rebond quand la chauve-souris touche un bord, avec un pitch légèrement aléatoire pour éviter la répétition.",
        hint: 'SoundEffectInstance.Pitch est un float entre -1 et 1.',
        solution: `float pitch = (float)(Random.Shared.NextDouble() * 0.2 - 0.1);
Core.Audio.PlaySoundEffect(_bounceSound, 1.0f, pitch, 0.0f, false);`,
        solutionLang: 'csharp',
      },
      {
        title: 'Mute propre',
        level: 'Défi',
        prompt:
          "Implémente <code>MuteAudio</code> et <code>UnmuteAudio</code> de façon à restaurer les volumes précédents, sans les écraser si l’utilisateur change le volume pendant le mute.",
        hint: 'Sauvegarde les volumes avant de les mettre à zéro, puis restaure-les. Ignore les setters de volume pendant le mute.',
        solution: `public void MuteAudio()
{
    _previousSongVolume = MediaPlayer.Volume;
    _previousSoundEffectVolume = SoundEffect.MasterVolume;
    MediaPlayer.Volume = 0.0f;
    SoundEffect.MasterVolume = 0.0f;
    IsMuted = true;
}

public void UnmuteAudio()
{
    MediaPlayer.Volume = _previousSongVolume;
    SoundEffect.MasterVolume = _previousSoundEffectVolume;
    IsMuted = false;
}`,
        solutionLang: 'csharp',
      },
    ],
    sources: [
      {
        label: 'Chapitre 14 officiel — Sound Effects and Music',
        url: 'https://docs.monogame.net/articles/tutorials/building_2d_games/14_soundeffects_and_music/index.html',
      },
      {
        label: 'Chapitre 15 officiel — Audio Controller',
        url: 'https://docs.monogame.net/articles/tutorials/building_2d_games/15_audio_controller/index.html',
      },
    ],
  },
  {
    slug: 'texte',
    chapter: 14,
    module: 'gameplay',
    title: 'Afficher du texte avec SpriteFont',
    navTitle: 'Le texte et les polices',
    description:
      'Crée une police bitmap, charge-la et dessine un score, un titre et des instructions parfaitement alignés.',
    duration: 30,
    objectives: [
      'Créer et configurer un fichier .spritefont',
      'Charger une SpriteFont avec le Content Pipeline',
      'Dessiner et mesurer du texte',
      'Centrer et ombrer un texte',
    ],
    blocks: [
      {
        t: 'p',
        html: "Un <code>SpriteFont</code> n’est pas une police vectorielle lue à l’exécution : c’est un atlas de glyphes généré par le Content Pipeline. Chaque caractère est une petite texture, avec ses métriques. Le rendu est rapide et identique sur toutes les plateformes.",
      },
      { t: 'h2', text: 'Créer la description de police' },
      {
        t: 'p',
        html: "Dans le MGCB Editor, ajoute un dossier <code>fonts</code>, puis <em>Add → New File…</em> et choisis <strong>SpriteFont Description</strong>. Nomme-le <code>04B_30.spritefont</code> et place le fichier <code>04B_30.ttf</code> à côté.",
      },
      {
        t: 'code',
        lang: 'xml',
        title: 'Content/fonts/04B_30.spritefont',
        code: `<?xml version="1.0" encoding="utf-8"?>
<XnaContent xmlns:Graphics="Microsoft.Xna.Framework.Content.Pipeline.Graphics">
  <Asset Type="Graphics:FontDescription">
    <FontName>04B_30.ttf</FontName>
    <Size>17.5</Size>
    <Spacing>0</Spacing>
    <UseKerning>true</UseKerning>
    <Style>Regular</Style>
    <CharacterRegions>
      <CharacterRegion>
        <Start>&#32;</Start>
        <End>&#126;</End>
      </CharacterRegion>
    </CharacterRegions>
  </Asset>
</XnaContent>`,
      },
      {
        t: 'callout',
        tone: 'info',
        title: 'Les CharacterRegions',
        html: "La plage 32–126 couvre l’ASCII imprimable. Si tu affiches des accents français, ajoute les plages Unicode nécessaires (par exemple 160–255) ou une région par caractère. Sans cela, les lettres accentuées seront remplacées par un caractère manquant.",
      },
      {
        t: 'p',
        html: "Le pipeline génère une texture et un fichier <code>.xnb</code>. Pour un rendu pixel art net, désactive le lissage dans les propriétés de la police ou utilise <code>SamplerState.PointClamp</code> au dessin.",
      },
      { t: 'h2', text: 'Charger et dessiner' },
      {
        t: 'code',
        lang: 'csharp',
        code: `private SpriteFont _font;

protected override void LoadContent()
{
    _font = Content.Load<SpriteFont>("fonts/04B_30");
}

protected override void Draw(GameTime gameTime)
{
    GraphicsDevice.Clear(Color.CornflowerBlue);
    SpriteBatch.Begin(samplerState: SamplerState.PointClamp);

    SpriteBatch.DrawString(_font, "SCORE: 001500", new Vector2(20, 20), Color.White);

    SpriteBatch.End();
    base.Draw(gameTime);
}`,
      },
      { t: 'h2', text: 'Mesurer, centrer, ombrer' },
      {
        t: 'code',
        lang: 'csharp',
        code: `Vector2 size = _font.MeasureString("Dungeon Slime");
Vector2 position = new Vector2(
    (GraphicsDevice.PresentationParameters.BackBufferWidth - size.X) / 2f,
    (GraphicsDevice.PresentationParameters.BackBufferHeight - size.Y) / 2f
);

// Ombre portée : même texte, décalé, en noir semi-transparent.
SpriteBatch.DrawString(_font, "Dungeon Slime", position + new Vector2(4, 4), Color.Black * 0.5f);
SpriteBatch.DrawString(_font, "Dungeon Slime", position, Color.White);`,
      },
      {
        t: 'p',
        html: "Comme pour les textures, tu peux faire tourner, mettre à l’échelle et teinter un texte avec la surcharge complète de <code>DrawString</code>. L’origine fonctionne de la même façon : <code>size * 0.5f</code> pour tourner autour du centre.",
      },
      {
        t: 'callout',
        tone: 'tip',
        title: 'Un texte net en pixel art',
        html: "Utilise une taille de police alignée sur la grille de pixels (multiples de 8 ou de la taille native), et <code>PointClamp</code>. Un texte flou vient presque toujours d’un échantillonnage linéaire ou d’une taille non entière.",
      },
      { t: 'h2', text: 'Un titre en deux polices' },
      {
        t: 'p',
        html: "Le tutoriel crée deux descriptions : <code>04B_30.spritefont</code> pour le texte courant et <code>04B_30_5x.spritefont</code> pour le titre, avec une taille cinq fois plus grande. Deux assets, deux styles, un seul rendu SpriteBatch.",
      },
      {
        t: 'p',
        html: "Tu peux maintenant afficher le score, les instructions et les menus. Le prochain chapitre organise tout cela en scènes, pour passer d’un écran-titre au jeu sans mélanger le code.",
      },
    ],
    quiz: [
      {
        question: 'Qu’est-ce qu’un SpriteFont dans MonoGame ?',
        options: [
          'Une police vectorielle chargée à l’exécution',
          'Un atlas de glyphes compilé par le Content Pipeline',
          'Un fichier audio',
          'Un type de texture 3D',
        ],
        correct: 1,
        explanation:
          'Le pipeline transforme la police et ses métriques en texture + données de rendu, optimisées pour SpriteBatch.',
      },
      {
        question: 'Que fait MeasureString ?',
        options: [
          'Il dessine le texte',
          'Il retourne la taille du texte en pixels',
          'Il charge la police',
          'Il centre automatiquement le texte',
        ],
        correct: 1,
        explanation:
          'MeasureString renvoie un Vector2 (largeur, hauteur) utilisé pour centrer, aligner ou dimensionner un élément.',
      },
      {
        question: 'Pourquoi ajouter des CharacterRegions ?',
        options: [
          'Pour définir quels caractères sont inclus dans la police compilée',
          'Pour choisir la couleur du texte',
          'Pour accélérer le rendu',
          'Pour activer les collisions',
        ],
        correct: 0,
        explanation:
          'Seuls les caractères des régions déclarées sont générés. Sans la plage accentuée, les lettres comme é ou à manquent.',
      },
      {
        question: 'Comment obtenir un texte net en pixel art ?',
        options: [
          'Utiliser LinearClamp et une taille quelconque',
          'Utiliser PointClamp et une taille alignée sur la grille',
          'Désactiver SpriteBatch',
          'Dessiner le texte en 3D',
        ],
        correct: 1,
        explanation:
          'PointClamp évite l’interpolation ; une taille entière et cohérente avec le pixel art conserve des glyphes nets.',
      },
    ],
    exercises: [
      {
        title: 'Afficher le score',
        level: 'Facile',
        prompt:
          "Affiche le score courant en haut à gauche, avec un fond semi-transparent derrière le texte.",
        hint: 'Mesure le texte, dessine un Rectangle rempli avec une texture blanche 1×1 (ou un SpriteBatch.Draw d’une texture unie), puis le texte.',
        solution: `// Une texture blanche 1×1, créée une fois dans LoadContent.
_pixel = new Texture2D(GraphicsDevice, 1, 1);
_pixel.SetData(new[] { Color.White });

Vector2 textSize = _font.MeasureString($"SCORE: {_score:000000}");
Rectangle background = new Rectangle(12, 12, (int)textSize.X + 16, (int)textSize.Y + 8);

SpriteBatch.Draw(_pixel, background, Color.Black * 0.5f);
SpriteBatch.DrawString(_font, $"SCORE: {_score:000000}", new Vector2(20, 16), Color.White);`,
        solutionLang: 'csharp',
      },
      {
        title: 'Centrer le titre',
        level: 'Intermédiaire',
        prompt:
          "Centre le texte « DUNGEON SLIME » horizontalement et verticalement dans une fenêtre 1280 × 720, puis décale-le de 10 pixels vers le haut.",
        hint: 'MeasureString donne la taille ; la position est (largeur écran - taille) / 2.',
        solution: `Vector2 size = _font.MeasureString("DUNGEON SLIME");
Vector2 position = new Vector2((1280 - size.X) / 2f, (720 - size.Y) / 2f - 10f);
SpriteBatch.DrawString(_font, "DUNGEON SLIME", position, Color.White);`,
        solutionLang: 'csharp',
      },
      {
        title: 'Effet de machine à écrire',
        level: 'Défi',
        prompt:
          "Affiche le texte « PRESS ENTER » caractère par caractère, à raison d’un caractère toutes les 80 ms.",
        hint: 'Utilise une sous-chaîne dont la longueur dépend du temps écoulé.',
        solution: `string text = "PRESS ENTER";
int visible = Math.Min(text.Length, (int)(gameTime.TotalGameTime.TotalMilliseconds / 80));
SpriteBatch.DrawString(_font, text[..visible], position, Color.White);`,
        solutionLang: 'csharp',
      },
    ],
    sources: [
      {
        label: 'Chapitre 16 officiel — Working with SpriteFonts',
        url: 'https://docs.monogame.net/articles/tutorials/building_2d_games/16_working_with_spritefonts/index.html',
      },
      {
        label: 'Documentation SpriteFont',
        url: 'https://docs.monogame.net/api/Microsoft.Xna.Framework.Graphics.SpriteFont.html',
      },
    ],
  },
  {
    slug: 'scenes',
    chapter: 15,
    module: 'gameplay',
    title: 'Organiser le jeu en scènes',
    navTitle: 'Les scènes',
    description:
      'Sépare l’écran-titre, le jeu et les menus dans des scènes autonomes, avec leur propre contenu et leur propre cycle de vie.',
    duration: 40,
    objectives: [
      'Concevoir une classe Scene réutilisable',
      'Gérer le chargement et la libération du contenu par scène',
      'Changer de scène sans fuite de ressources',
      'Construire un écran-titre et une scène de jeu',
    ],
    blocks: [
      {
        t: 'p',
        html: "Un jeu n’est pas un seul écran. Il y a un titre, une partie, une pause, un game over. Si tout vit dans <code>Game1</code>, le code devient un labyrinthe de drapeaux. Une <strong>scène</strong> isole chaque écran avec son contenu, ses entrées et son rendu.",
      },
      { t: 'h2', text: 'Le cycle de vie d’une scène' },
      {
        t: 'list',
        ordered: true,
        items: [
          "<code>Initialize()</code> : initialise la scène et déclenche <code>LoadContent()</code>.",
          "<code>LoadContent()</code> : charge les assets spécifiques à la scène.",
          "<code>Update(gameTime)</code> : logique et entrées.",
          "<code>Draw(gameTime)</code> : rendu.",
          "<code>Dispose()</code> : libère le contenu et les abonnements.",
        ],
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'MonoGameLibrary/Scenes/Scene.cs',
        code: code.scene,
      },
      {
        t: 'p',
        html: "Chaque scène possède son propre <code>ContentManager</code>. Quand elle est détruite, <code>Content.Unload()</code> libère uniquement ses assets. C’est plus propre que de tout charger dans le Content global et de ne jamais rien décharger.",
      },
      { t: 'h2', text: 'Changer de scène' },
      {
        t: 'p',
        html: "Plutôt que de changer la scène immédiatement au milieu d’un <code>Update</code>, <code>Core</code> stocke la scène suivante et effectue la transition entre deux frames. Cela évite de détruire l’objet en cours d’utilisation.",
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'Core.cs — extraits',
        code: `private static Scene s_activeScene;
private static Scene s_nextScene;

protected override void Update(GameTime gameTime)
{
    Input.Update(gameTime);
    Audio.Update();

    if (s_nextScene != null)
    {
        TransitionScene();
    }

    s_activeScene?.Update(gameTime);
    base.Update(gameTime);
}

protected override void Draw(GameTime gameTime)
{
    s_activeScene?.Draw(gameTime);
    base.Draw(gameTime);
}

public static void ChangeScene(Scene next)
{
    if (s_activeScene != next)
    {
        s_nextScene = next;
    }
}

private static void TransitionScene()
{
    s_activeScene?.Dispose();
    GC.Collect();

    s_activeScene = s_nextScene;
    s_nextScene = null;
    s_activeScene?.Initialize();
}`,
      },
      {
        t: 'callout',
        tone: 'warn',
        title: 'GC.Collect explicite : un choix du tutoriel',
        html: "Le tutoriel force la collecte après la destruction d’une scène pour rendre la libération déterministe sur toutes les plateformes. En production, tu préféreras souvent laisser le GC travailler et t’assurer que <code>Dispose</code> libère bien les ressources non managées. Les deux approches se défendent ; comprends le compromis.",
      },
      { t: 'h2', text: 'Une scène de titre' },
      {
        t: 'code',
        lang: 'csharp',
        title: 'TitleScene.cs — extrait',
        code: `public class TitleScene : Scene
{
    private SpriteFont _font;
    private Texture2D _backgroundPattern;

    public override void Initialize()
    {
        base.Initialize();
        Core.ExitOnEscape = true;
    }

    public override void LoadContent()
    {
        _font = Content.Load<SpriteFont>("fonts/04B_30");
        _backgroundPattern = Content.Load<Texture2D>("images/background-pattern");
    }

    public override void Update(GameTime gameTime)
    {
        if (Core.Input.Keyboard.WasKeyJustPressed(Keys.Enter))
        {
            Core.ChangeScene(new GameScene());
        }
    }

    public override void Draw(GameTime gameTime)
    {
        Core.GraphicsDevice.Clear(new Color(32, 40, 78));
        Core.SpriteBatch.Begin(samplerState: SamplerState.PointClamp);
        Core.SpriteBatch.DrawString(_font, "PRESS ENTER", new Vector2(560, 600), Color.White);
        Core.SpriteBatch.End();
    }
}`,
      },
      {
        t: 'p',
        html: "Dans <code>Game1</code>, il ne reste presque plus rien : charger la musique, initialiser Gum (plus tard), puis démarrer la première scène.",
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'Game1.cs',
        code: code.game1_17,
      },
      {
        t: 'callout',
        tone: 'key',
        title: 'Une scène = un écran',
        html: "Ne crée pas une scène par entité. Les entités (slime, chauve-souris, UI) vivent dans une scène de jeu. La scène gère l’écran, pas chaque objet.",
      },
    ],
    quiz: [
      {
        question: 'Pourquoi chaque scène a-t-elle son propre ContentManager ?',
        options: [
          'Pour charger plus vite les textures globales',
          'Pour décharger uniquement les assets de la scène quand elle se termine',
          'Parce que MonoGame l’impose',
          'Pour éviter d’utiliser SpriteBatch',
        ],
        correct: 1,
        explanation:
          'Un ContentManager par scène permet un Unload ciblé, sans toucher aux assets globaux comme la musique ou les polices communes.',
      },
      {
        question: 'Pourquoi ChangeScene ne bascule-t-il pas immédiatement ?',
        options: [
          'Pour attendre le chargement du GPU',
          'Pour éviter de détruire la scène active au milieu de son Update',
          'Pour synchroniser le son',
          'Pour empêcher les collisions',
        ],
        correct: 1,
        explanation:
          'Core stocke la scène suivante et effectue la transition entre deux frames, quand l’ancienne scène n’est plus en cours d’exécution.',
      },
      {
        question: 'Que doit faire une scène dans Dispose ?',
        options: [
          'Rien du tout',
          'Libérer son contenu et se désabonner des événements',
          'Changer de scène',
          'Réinitialiser le score',
        ],
        correct: 1,
        explanation:
          'Scene.UnloadContent appelle Content.Unload. Si la scène s’est abonnée à des événements, elle doit aussi s’en désabonner pour éviter les fuites.',
      },
      {
        question: 'Où doivent vivre les entités du jeu (slime, chauve-souris) ?',
        options: [
          'Dans une scène par entité',
          'Dans la scène de jeu',
          'Dans Game1 directement',
          'Dans le Content Pipeline',
        ],
        correct: 1,
        explanation:
          'Une scène représente un écran. Les entités sont des objets internes à la scène de jeu, pas des scènes.',
      },
    ],
    exercises: [
      {
        title: 'Écran de game over',
        level: 'Facile',
        prompt:
          "Crée une scène GameOverScene qui affiche « GAME OVER » et revient au titre quand on appuie sur Entrée.",
        hint: 'Dérive de Scene, charge une SpriteFont, détecte WasKeyJustPressed(Keys.Enter) et appelle Core.ChangeScene(new TitleScene()).',
        solution: `public class GameOverScene : Scene
{
    private SpriteFont _font;

    public override void LoadContent()
    {
        _font = Content.Load<SpriteFont>("fonts/04B_30");
    }

    public override void Update(GameTime gameTime)
    {
        if (Core.Input.Keyboard.WasKeyJustPressed(Keys.Enter))
        {
            Core.ChangeScene(new TitleScene());
        }
    }

    public override void Draw(GameTime gameTime)
    {
        Core.GraphicsDevice.Clear(Color.Black);
        Core.SpriteBatch.Begin();
        Core.SpriteBatch.DrawString(_font, "GAME OVER", new Vector2(560, 340), Color.White);
        Core.SpriteBatch.End();
    }
}`,
        solutionLang: 'csharp',
      },
      {
        title: 'Transition en fondu',
        level: 'Intermédiaire',
        prompt:
          "Ajoute un fondu au noir de 0,5 seconde lors du changement de scène. Où placerais-tu l’état de transition ?",
        hint: 'Core peut dessiner un rectangle noir par-dessus la scène active, avec une alpha qui monte puis descend.',
        solution:
          "On ajoute dans Core un état de transition (opacité, sens, scène suivante). Pendant Update, on fait monter l’opacité ; quand elle atteint 1, on effectue la transition ; puis on la fait redescendre. Le Draw de Core dessine la scène active, puis un rectangle noir plein écran avec Color.Black * opacity. L’état appartient à Core car il concerne toutes les scènes.",
      },
      {
        title: 'Pause sans changer de scène',
        level: 'Défi',
        prompt:
          "Pourquoi une pause ne devrait-elle pas être une nouvelle scène ? Propose une implémentation simple.",
        hint: 'Pense à l’état du jeu et à l’UI qui doit rester visible.',
        solution:
          "Changer de scène détruirait l’état de la partie. Une pause est un état interne à GameScene : un booléen _isPaused, un Update qui n’avance plus la logique du jeu, et un panneau d’UI par-dessus le rendu. Les entrées de pause restent actives pour reprendre.",
      },
    ],
    sources: [
      {
        label: 'Chapitre 17 officiel — Scenes',
        url: 'https://docs.monogame.net/articles/tutorials/building_2d_games/17_scenes/index.html',
      },
    ],
  },
  {
    slug: 'defilement',
    chapter: 16,
    module: 'gameplay',
    title: 'Un fond qui défile sans couture',
    navTitle: 'Le fond défilant',
    description:
      'Comprends les états d’échantillonnage et les coordonnées de texture pour créer un motif répété qui défile à l’infini.',
    duration: 30,
    objectives: [
      'Expliquer le filtrage et l’adressage de texture',
      'Choisir PointWrap, LinearWrap ou Clamp',
      'Faire défiler un motif en boucle',
      'Éviter les coutures visibles',
    ],
    blocks: [
      {
        t: 'p',
        html: "Un fond qui défile donne de la profondeur à un écran-titre. La technique est simple : dessiner un motif plus petit que l’écran, en répétition, et décaler les coordonnées de texture. Mais pour que la répétition soit invisible, il faut comprendre le <strong>sampler state</strong>.",
      },
      { t: 'h2', text: 'Filtrage et adressage' },
      {
        t: 'table',
        head: ['SamplerState', 'Filtrage', 'Adressage', 'Usage'],
        rows: [
          ['<code>PointClamp</code>', 'Plus proche voisin', 'Bords étirés', 'Pixel art net, pas de répétition'],
          ['<code>PointWrap</code>', 'Plus proche voisin', 'Répétition', 'Motif pixel art qui défile'],
          ['<code>LinearClamp</code>', 'Interpolé', 'Bords étirés', 'Images lissées'],
          ['<code>LinearWrap</code>', 'Interpolé', 'Répétition', 'Textures photo qui défilent'],
        ],
      },
      {
        t: 'p',
        html: "L’adressage <strong>Wrap</strong> signifie que dès que les coordonnées dépassent 1, la texture recommence à 0. On peut donc dessiner un rectangle plus grand que la texture et obtenir une répétition automatique, sans boucle de dessin.",
      },
      {
        t: 'image',
        src: '/images/background-pattern.png',
        alt: 'Motif de fond du donjon, petites chauves-souris sur fond bleu nuit',
        caption: 'Le motif de fond du tutoriel. Image : tutoriel officiel.',
      },
      { t: 'h2', text: 'Dessiner le fond en wrap' },
      {
        t: 'code',
        lang: 'csharp',
        title: 'TitleScene.cs — extrait',
        code: `private Texture2D _backgroundPattern;
private Rectangle _backgroundDestination;
private Vector2 _backgroundOffset;
private float _scrollSpeed = 50.0f;

public override void Initialize()
{
    base.Initialize();
    _backgroundOffset = Vector2.Zero;
    _backgroundDestination = Core.GraphicsDevice.PresentationParameters.Bounds;
}

public override void LoadContent()
{
    _backgroundPattern = Content.Load<Texture2D>("images/background-pattern");
}

public override void Update(GameTime gameTime)
{
    float offset = _scrollSpeed * (float)gameTime.ElapsedGameTime.TotalSeconds;
    _backgroundOffset.X -= offset;
    _backgroundOffset.Y -= offset;

    _backgroundOffset.X %= _backgroundPattern.Width;
    _backgroundOffset.Y %= _backgroundPattern.Height;
}

public override void Draw(GameTime gameTime)
{
    Core.SpriteBatch.Begin(samplerState: SamplerState.PointWrap);
    Core.SpriteBatch.Draw(
        _backgroundPattern,
        _backgroundDestination,
        new Rectangle(_backgroundOffset.ToPoint(), _backgroundDestination.Size),
        Color.White * 0.5f
    );
    Core.SpriteBatch.End();
}`,
      },
      {
        t: 'callout',
        tone: 'key',
        title: 'Pourquoi le modulo ?',
        html: "Sans modulo, l’offset grandit indéfiniment et perd de la précision après quelques minutes. En le ramenant dans la taille de la texture, le défilement est identique visuellement mais reste numériquement stable.",
      },
      {
        t: 'p',
        html: "Le rectangle source a la taille de l’écran, mais ses coordonnées commencent à l’offset. Comme l’adressage est Wrap, les portions hors texture se répètent automatiquement. C’est le GPU qui fait le travail, pas une boucle C#.",
      },
      {
        t: 'callout',
        tone: 'warn',
        title: 'Une couture visible ?',
        html: "Vérifie que le motif est <strong>tileable</strong> : le bord droit doit prolonger le bord gauche, et le bas le haut. Un motif non tileable montrera une ligne nette, même avec le bon sampler.",
      },
      {
        t: 'p',
        html: "Tu as maintenant tous les systèmes d’un jeu 2D : rendu, entrées, collisions, décor, audio, texte et scènes. Le module suivant les assemble en un jeu complet, avec une interface professionnelle.",
      },
    ],
    quiz: [
      {
        question: 'Que fait l’adressage Wrap ?',
        options: [
          'Il étire les bords de la texture',
          'Il répète la texture quand les coordonnées sortent de 0..1',
          'Il rend la texture floue',
          'Il désactive le filtrage',
        ],
        correct: 1,
        explanation:
          'Wrap répète la texture à l’infini. C’est ce qui permet de dessiner un rectangle plus grand que l’image source.',
      },
      {
        question: 'Quel SamplerState choisir pour un motif pixel art qui défile ?',
        options: ['PointClamp', 'PointWrap', 'LinearClamp', 'AnisotropicClamp'],
        correct: 1,
        explanation:
          'PointWrap combine un filtrage au plus proche voisin (net) et une répétition (défilement sans couture).',
      },
      {
        question: 'Pourquoi appliquer un modulo à l’offset ?',
        options: [
          'Pour accélérer le GPU',
          'Pour éviter la perte de précision quand la valeur grandit',
          'Pour changer la couleur',
          'Pour activer les collisions',
        ],
        correct: 1,
        explanation:
          'En ramenant l’offset dans la taille de la texture, on garde un défilement visuellement continu avec des valeurs stables.',
      },
      {
        question: 'Que se passe-t-il si le motif n’est pas tileable ?',
        options: [
          'Le jeu plante',
          'Une couture visible apparaît à la répétition',
          'Le fond devient noir',
          'Le sampler est ignoré',
        ],
        correct: 1,
        explanation:
          'La répétition révèle la discontinuité entre les bords. Le motif doit être conçu pour se raccorder.',
      },
    ],
    exercises: [
      {
        title: 'Changer la direction',
        level: 'Facile',
        prompt:
          "Fais défiler le fond horizontalement vers la droite uniquement, à 80 pixels par seconde.",
        hint: 'Modifie uniquement _backgroundOffset.X et le signe.',
        solution: `float offset = 80f * (float)gameTime.ElapsedGameTime.TotalSeconds;
_backgroundOffset.X += offset;
_backgroundOffset.X %= _backgroundPattern.Width;`,
        solutionLang: 'csharp',
      },
      {
        title: 'Vitesse variable',
        level: 'Intermédiaire',
        prompt:
          "Fais en sorte que le fond accélère progressivement de 20 à 100 pixels par seconde sur 10 secondes, puis reste à 100.",
        hint: 'Utilise MathHelper.Clamp et le temps total écoulé.',
        solution: `float t = MathHelper.Clamp((float)gameTime.TotalGameTime.TotalSeconds / 10f, 0f, 1f);
float speed = MathHelper.Lerp(20f, 100f, t);
float offset = speed * (float)gameTime.ElapsedGameTime.TotalSeconds;`,
        solutionLang: 'csharp',
      },
      {
        title: 'Deux couches de parallaxe',
        level: 'Défi',
        prompt:
          "Décris comment ajouter une seconde couche de fond plus lente pour créer un effet de parallaxe. Quelles textures et quels offsets faut-il ?",
        hint: 'Deux textures, deux offsets, deux vitesses, deux Begin/End ou un tri par profondeur.',
        solution:
          "On charge deux motifs (par exemple un fond lointain et un motif proche), on maintient deux offsets avec des vitesses différentes (20 et 50 px/s), et on dessine d’abord la couche lente puis la rapide. Chaque couche utilise PointWrap et son propre rectangle destination. L’effet de profondeur vient de la différence de vitesse, pas de la taille des textures.",
      },
    ],
    sources: [
      {
        label: 'Chapitre 18 officiel — Texture Sampling',
        url: 'https://docs.monogame.net/articles/tutorials/building_2d_games/18_texture_sampling/index.html',
      },
    ],
  },
];
