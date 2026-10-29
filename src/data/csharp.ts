import type { Block, QuizQuestion } from './types';

export const csharpBlocks: Block[] = [
  {
    t: 'p',
    html: "Ce guide n’est pas un cours de C# complet. C’est un <strong>lexique de survie</strong> : tout ce qu’il faut reconnaître et savoir écrire pour suivre le parcours MonoGame sans se perdre. Si tu connais déjà les classes et les méthodes, tu peux le parcourir en diagonale.",
  },
  {
    t: 'callout',
    tone: 'info',
    title: 'Comment utiliser cette page',
    html: "Lis une section, puis reviens au chapitre en cours dès qu’un mot te bloque. Le code MonoGame utilise un C# moderne mais très lisible : tu n’as pas besoin de maîtriser les expressions régulières ou les delegates avancés pour commencer.",
  },
  { t: 'h2', text: 'Le squelette d’un fichier C#' },
  {
    t: 'p',
    html: "Un fichier <code>.cs</code> déclare un <strong>namespace</strong> (un espace de noms) et une ou plusieurs <strong>classes</strong>. Les directives <code>using</code> importent les types dont tu as besoin. Depuis C# 10, le namespace peut être déclaré sans accolades :",
  },
  {
    t: 'code',
    lang: 'csharp',
    title: 'Un fichier C# minimal',
    code: `using Microsoft.Xna.Framework;

namespace DungeonSlime;

public class Slime
{
    public Vector2 Position;

    public void Move(float deltaTime)
    {
        Position.X += 120f * deltaTime;
    }
}`,
  },
  {
    t: 'p',
    html: "<code>public</code> signifie que la classe est accessible depuis les autres fichiers du projet. <code>private</code> la limite au fichier ou à la classe. En C#, les noms de classes et de méthodes publiques s’écrivent en <strong>PascalCase</strong>, les variables locales et les champs privés en <strong>camelCase</strong> (souvent préfixés par <code>_</code>).",
  },
  { t: 'h2', text: 'Variables, types et inférence' },
  {
    t: 'p',
    html: "C# est un langage <strong>statiquement typé</strong> : chaque variable a un type connu à la compilation. On peut l’écrire explicitement ou laisser le compilateur l’inférer avec <code>var</code>.",
  },
  {
    t: 'code',
    lang: 'csharp',
    code: `int score = 0;                 // entier 32 bits
float speed = 120.5f;          // nombre à virgule (suffixe f)
double elapsed = 0.016;        // double précision
bool isGameOver = false;       // booléen
string title = "Dungeon Slime"; // chaîne de caractères
char grade = 'A';              // un caractère

var position = new Vector2(10, 20); // Vector2, inféré
var sprites = new List<Sprite>();   // List<Sprite>, inféré

const int TileSize = 64;       // constante connue à la compilation
readonly int _lives = 3;       // affecté une seule fois (constructeur)`,
  },
  {
    t: 'callout',
    tone: 'tip',
    title: 'var n’est pas « sans type »',
    html: "Le type est déterminé à la compilation. Utilise <code>var</code> quand le type est évident à la lecture (<code>new Vector2(...)</code>, <code>new List&lt;Sprite&gt;()</code>), et écris-le explicitement quand il clarifie une intention.",
  },
  { t: 'h2', text: 'Classes, champs et propriétés' },
  {
    t: 'p',
    html: "Une <strong>classe</strong> regroupe des données (champs) et des comportements (méthodes). Une <strong>propriété</strong> expose une donnée avec un accès contrôlé. Les propriétés automatiques <code>{ get; set; }</code> sont partout dans MonoGame (<code>Position</code>, <code>Color</code>, <code>Scale</code>…).",
  },
  {
    t: 'code',
    lang: 'csharp',
    title: 'Champs, propriétés, constructeur',
    code: `public class Sprite
{
    // Champ privé : invisible depuis l'extérieur.
    private TextureRegion _region;

    // Propriété automatique : lisible et modifiable partout.
    public Vector2 Position { get; set; }

    // Propriété en lecture seule depuis l'extérieur.
    public int Width { get; private set; }

    // Propriété calculée, sans stockage.
    public float HalfWidth => Width * 0.5f;

    public Sprite(TextureRegion region)
    {
        _region = region;
        Width = region.Width;
    }
}`,
  },
  {
    t: 'p',
    html: "Le <code>=></code> d’une propriété calculée est une <strong>expression-bodied member</strong> : un raccourci pour <code>{ get { return ...; } }</code>. Tu en verras aussi sur les méthodes d’une ligne.",
  },
  { t: 'h2', text: 'Constructeurs, this et base' },
  {
    t: 'p',
    html: "Le <strong>constructeur</strong> porte le nom de la classe et initialise l’objet. <code>base(...)</code> appelle le constructeur de la classe parente ; <code>this(...)</code> appelle un autre constructeur de la même classe.",
  },
  {
    t: 'code',
    lang: 'csharp',
    title: 'AnimatedSprite dérive de Sprite',
    code: `public class AnimatedSprite : Sprite
{
    private readonly Animation _animation;

    public AnimatedSprite(TextureRegion region, Animation animation)
        : base(region) // appelle le constructeur de Sprite
    {
        _animation = animation;
    }
}`,
  },
  {
    t: 'p',
    html: "Dans le tutoriel, <code>Game1 : Core</code> appelle <code>base(\"Dungeon Slime\", 1280, 720, false)</code> : le constructeur de <code>Core</code> s’occupe de la fenêtre et du périphérique graphique.",
  },
  { t: 'h2', text: 'Méthodes, virtual et override' },
  {
    t: 'p',
    html: "Une méthode peut retourner une valeur ou <code>void</code>. Une méthode <code>virtual</code> peut être redéfinie par une classe fille avec <code>override</code>. C’est le mécanisme qui permet à MonoGame d’appeler <em>ton</em> <code>Update</code> et <em>ton</em> <code>Draw</code>.",
  },
  {
    t: 'code',
    lang: 'csharp',
    code: `public class Scene
{
    public virtual void Update(GameTime gameTime)
    {
        // Comportement par défaut : rien.
    }
}

public class GameScene : Scene
{
    public override void Update(GameTime gameTime)
    {
        base.Update(gameTime); // garde le comportement parent
        _slime.Update(gameTime);
    }
}`,
  },
  {
    t: 'callout',
    tone: 'key',
    title: 'Toujours appeler base ?',
    html: "Pas automatiquement. Pour <code>Game.Update</code> et <code>Game.Draw</code>, MonoGame a besoin de son propre traitement : le tutoriel appelle <code>base.Update(gameTime)</code>. Pour une méthode virtuelle vide de <code>Scene</code>, l’appel est facultatif. La règle : lis le code parent et décide en connaissance de cause.",
  },
  { t: 'h2', text: 'Structs et énumérations' },
  {
    t: 'p',
    html: "Un <strong>struct</strong> est un type valeur : il est copié à chaque affectation. <code>Vector2</code>, <code>Rectangle</code> et <code>GameTime</code> sont des structs. Une <strong>enum</strong> est un ensemble de constantes nommées, comme <code>Keys.Escape</code> ou <code>ButtonState.Pressed</code>.",
  },
  {
    t: 'code',
    lang: 'csharp',
    code: `Vector2 position = new Vector2(100, 50);
Rectangle bounds = new Rectangle(0, 0, 64, 64);

// Les enums rendent le code lisible.
if (Keyboard.GetState().IsKeyDown(Keys.Escape))
{
    Exit();
}

public enum GameState
{
    Title,
    Playing,
    Paused,
    GameOver
}`,
  },
  {
    t: 'p',
    html: "Attention à la copie : <code>Vector2 a = b;</code> duplique la valeur. Modifier <code>a.X</code> ne modifie pas <code>b.X</code>. Pour les objets (classes), la variable contient une référence vers le même objet.",
  },
  { t: 'h2', text: 'Collections et génériques' },
  {
    t: 'p',
    html: "Une <strong>collection générique</strong> précise le type qu’elle contient entre chevrons. <code>List&lt;SlimeSegment&gt;</code> est une liste de segments ; <code>Content.Load&lt;Texture2D&gt;</code> charge une texture et renvoie ce type précis.",
  },
  {
    t: 'code',
    lang: 'csharp',
    code: `List<SlimeSegment> _segments = new List<SlimeSegment>();
_segments.Add(new SlimeSegment());
_segments.RemoveAt(0);

foreach (SlimeSegment segment in _segments)
{
    segment.Draw(SpriteBatch);
}

// Dictionnaire : clé -> valeur
Dictionary<string, TextureRegion> _regions = new();

if (_regions.TryGetValue("slime", out TextureRegion? region))
{
    // region est utilisable ici
}

Texture2D logo = Content.Load<Texture2D>("images/logo");`,
  },
  {
    t: 'p',
    html: "Les <strong>génériques</strong> évitent les conversions de type et les erreurs à l’exécution. C’est l’un des grands avantages de C# sur les langages historiques du jeu vidéo.",
  },
  { t: 'h2', text: 'Nullabilité : ? et !' },
  {
    t: 'p',
    html: "Un type référence peut valoir <code>null</code>. Depuis C# 8, le compilateur suit la nullabilité : <code>SpriteFont?</code> signifie « peut être null ». L’opérateur <code>?.</code> n’appelle la suite que si la valeur existe, et <code>??</code> fournit une valeur de repli.",
  },
  {
    t: 'code',
    lang: 'csharp',
    code: `private SpriteFont? _font;

_font?.DrawString("Bonjour");
int width = _font?.MeasureString("Score").X ?? 0;

// Le ! affirme au compilateur qu'une valeur n'est pas null.
// À utiliser seulement si tu en es certain.
_spriteBatch = new SpriteBatch(GraphicsDevice);`,
  },
  {
    t: 'callout',
    tone: 'warn',
    title: 'Le piège classique',
    html: "Une variable non initialisée d’un type référence vaut <code>null</code>. Appeler une méthode dessus provoque une <code>NullReferenceException</code>. En jeu, cela arrive souvent quand un asset n’a pas été chargé ou qu’une scène n’a pas été initialisée.",
  },
  { t: 'h2', text: 'Les idiomes que tu vas croiser' },
  {
    t: 'list',
    items: [
      "<code>_spriteBatch</code>, <code>_graphics</code> : convention pour les champs privés.",
      "<code>s_instance</code> : convention pour un champ statique privé (<code>s_</code>).",
      "<code>Core.Instance</code> : accès au singleton du jeu.",
      "<code>base.Initialize()</code> : appel explicite à la classe parente.",
      "<code>GraphicsDevice.Clear(Color.CornflowerBlue)</code> : enchaînement de propriétés et de méthodes.",
      "<code>new Vector2(10, 20)</code> : appel de constructeur avec arguments.",
      "Les lambdas <code>(_, _) => { ... }</code> apparaîtront avec les événements de l’interface Gum.",
      "<code>IDisposable</code> et <code>Dispose()</code> : libération des ressources audio et graphiques.",
    ],
  },
  { t: 'h2', text: 'Et maintenant ?' },
  {
    t: 'p',
    html: "Tu n’as pas besoin de tout retenir. Le parcours introduit chaque notion au moment où elle devient utile. Si un chapitre utilise un mot inconnu, reviens ici : c’est ta page de référence.",
  },
];

export const csharpQuiz: QuizQuestion[] = [
  {
    question: 'Quelle est la différence entre une classe et un struct en C# ?',
    options: [
      'Une classe est copiée par valeur, un struct par référence',
      'Un struct est un type valeur, une classe est un type référence',
      'Un struct ne peut pas avoir de méthodes',
      'Une classe ne peut pas avoir de constructeur',
    ],
    correct: 1,
    explanation:
      'Les structs (Vector2, Rectangle, GameTime) sont des types valeur : l’affectation copie les données. Les classes sont des types référence : la variable pointe vers le même objet.',
  },
  {
    question: 'Que fait le mot-clé override ?',
    options: [
      'Il crée une nouvelle méthode indépendante',
      'Il remplace une méthode virtuelle héritée par une implémentation propre à la classe fille',
      'Il rend une méthode privée',
      'Il appelle automatiquement base',
    ],
    correct: 1,
    explanation:
      'override redéfinit une méthode virtual ou abstract de la classe parente. C’est ainsi que Game1 fournit son propre Update à MonoGame.',
  },
  {
    question: 'Quel est le type de la variable x dans var x = new Vector2(10, 20); ?',
    options: ['object', 'dynamic', 'Vector2', 'float[]'],
    correct: 2,
    explanation:
      'var demande au compilateur d’inférer le type à partir de l’expression. Ici, x est de type Vector2, connu à la compilation.',
  },
  {
    question: 'À quoi sert le ? dans SpriteFont? _font; ?',
    options: [
      'À rendre la variable optionnelle à l’exécution',
      'À indiquer que la valeur peut être null',
      'À créer un pointeur',
      'À déclarer une méthode asynchrone',
    ],
    correct: 1,
    explanation:
      'Le ? marque un type nullable : la variable peut contenir null. Le compilateur t’oblige alors à vérifier avant d’accéder à ses membres.',
  },
  {
    question: 'Que fait base(region) dans un constructeur ?',
    options: [
      'Il crée une copie de region',
      'Il appelle le constructeur de la classe parente avec region',
      'Il initialise un champ statique',
      'Il remplace la méthode Draw',
    ],
    correct: 1,
    explanation:
      'base(...) appelle le constructeur de la classe dont on hérite. AnimatedSprite transmet la région à Sprite, qui l’utilise pour initialiser ses dimensions.',
  },
  {
    question: 'Quelle collection est la plus adaptée pour retrouver une région de texture par son nom ?',
    options: ['List<TextureRegion>', 'Dictionary<string, TextureRegion>', 'Queue<TextureRegion>', 'Texture2D[]'],
    correct: 1,
    explanation:
      'Un Dictionary associe une clé (le nom) à une valeur (la région). C’est exactement ce que fait TextureAtlas avec ses régions nommées.',
  },
  {
    question: 'Pourquoi les champs privés du tutoriel commencent-ils souvent par _ ?',
    options: [
      'C’est une obligation du compilateur',
      'C’est une convention de nommage pour les distinguer des variables locales',
      'Cela les rend statiques',
      'Cela les rend accessibles depuis MonoGame',
    ],
    correct: 1,
    explanation:
      'Le préfixe _ est une convention très répandue. Il rend immédiatement lisible qu’un identifiant est un champ d’instance, pas une variable locale ou un paramètre.',
  },
  {
    question: 'Que se passe-t-il si tu appelles une méthode sur une référence null ?',
    options: [
      'La méthode est ignorée',
      'Une NullReferenceException est levée à l’exécution',
      'Le compilateur refuse le programme dans tous les cas',
      'La valeur par défaut est retournée',
    ],
    correct: 1,
    explanation:
      'Accéder à un membre d’une référence null lève une NullReferenceException. Les analyses de nullabilité aident à l’éviter, mais ne remplacent pas les vérifications aux frontières du système.',
  },
];
