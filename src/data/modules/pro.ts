import { code } from '../../content/code';
import type { Lesson } from '../types';

export const proLessons: Lesson[] = [
  {
    slug: 'interface',
    chapter: 17,
    module: 'pro',
    title: 'Une interface utilisateur avec Gum',
    navTitle: 'L’interface avec Gum',
    description:
      'Ancrage, docking, focus et accessibilité : construis des menus jouables au clavier, à la souris et à la manette avec Gum.',
    duration: 50,
    objectives: [
      'Comprendre les principes de disposition d’une UI de jeu',
      'Installer et initialiser Gum dans MonoGame',
      'Créer des panneaux, boutons et sliders',
      'Gérer le focus clavier et manette',
    ],
    blocks: [
      {
        t: 'p',
        html: "Une interface de jeu n’est pas une page web. Elle doit rester lisible à distance, se naviguer à la manette, réagir au survol et ne jamais voler le focus au jeu. Construire tout cela à la main est long ; <strong>Gum</strong> fournit la disposition, les contrôles et la navigation.",
      },
      { t: 'h2', text: 'Les principes : hiérarchie, ancrage, docking' },
      {
        t: 'list',
        items: [
          "<strong>Hiérarchie</strong> : un panneau contient des boutons, qui contiennent du texte. Les transformations du parent s’appliquent aux enfants.",
          "<strong>Ancrage</strong> : un bouton ancré en bas à gauche reste en bas à gauche quand la fenêtre change de taille.",
          "<strong>Docking</strong> : un panneau en <code>Fill</code> occupe tout l’espace disponible ; un panneau en <code>Top</code> prend toute la largeur et la hauteur dont il a besoin.",
          "<strong>Focus</strong> : un seul élément reçoit les entrées clavier/manette à la fois. Gum gère le cycle Tab et les flèches.",
        ],
      },
      {
        t: 'image',
        src: '/images/title-unstyled.png',
        alt: 'Écran-titre de Dungeon Slime avec les contrôles Gum non stylés',
        caption: 'Les contrôles Gum par défaut, avant personnalisation. Image : tutoriel officiel.',
        wide: true,
      },
      {
        t: 'callout',
        tone: 'info',
        title: 'Pourquoi Gum plutôt qu’une UI maison ?',
        html: "Gum résout la disposition responsive, la navigation clavier/manette, les états visuels (survol, appui, désactivé) et la hiérarchie. C’est un moteur d’interface complet, utilisé aussi hors de MonoGame.",
      },
      { t: 'h2', text: 'Installer Gum' },
      {
        t: 'code',
        lang: 'bash',
        title: 'Terminal, à la racine du projet',
        code: `dotnet add DungeonSlime.csproj package Gum.MonoGame --version 2026.5.8.1`,
      },
      {
        t: 'p',
        html: "La version utilisée par le tutoriel officiel est <code>2026.5.8.1</code>. Vérifie les notes de Gum si tu montes de version : l’espace de noms et l’initialisation ont évolué récemment (<code>MonoGameGum</code>, <code>GumService.Default</code>).",
      },
      { t: 'h2', text: 'Initialiser Gum dans Game1' },
      {
        t: 'code',
        lang: 'csharp',
        title: 'DungeonSlime/Game1.cs — extrait',
        code: `using MonoGameGum;
using Gum.Forms;
using Gum.Forms.Controls;

private void InitializeGum()
{
    GumService.Default.Initialize(this, DefaultVisualsVersion.V3);
    GumService.Default.ContentLoader.XnaContentManager = Core.Content;

    FrameworkElement.KeyboardsForUiControl.Add(GumService.Default.Keyboard);
    FrameworkElement.GamePadsForUiControl.AddRange(GumService.Default.Gamepads);

    FrameworkElement.TabReverseKeyCombos.Add(
        new KeyCombo() { PushedKey = Microsoft.Xna.Framework.Input.Keys.Up });
    FrameworkElement.TabKeyCombos.Add(
        new KeyCombo() { PushedKey = Microsoft.Xna.Framework.Input.Keys.Down });

    GumService.Default.CanvasWidth =
        GraphicsDevice.PresentationParameters.BackBufferWidth / 4.0f;
    GumService.Default.CanvasHeight =
        GraphicsDevice.PresentationParameters.BackBufferHeight / 4.0f;
    GumService.Default.Renderer.Camera.Zoom = 4.0f;
}`,
      },
      {
        t: 'p',
        html: "L’appel <code>InitializeGum()</code> se fait dans <code>Game1.Initialize</code>, après <code>base.Initialize()</code>, avant de changer de scène. Le canvas est volontairement à un quart de la résolution : les assets UI restent petits, puis Gum zoome d’un facteur 4.",
      },
      {
        t: 'callout',
        tone: 'warn',
        title: 'Un seul service Gum',
        html: "Gum est un service global. Initialise-le une seule fois dans Game1, pas dans chaque scène. Les scènes créent et détruisent leurs éléments, mais ne réinitialisent pas le service.",
      },
      { t: 'h2', text: 'Construire l’écran-titre' },
      {
        t: 'code',
        lang: 'csharp',
        title: 'TitleScene.cs — extrait',
        code: `private Panel _titleScreenButtonsPanel;
private Panel _optionsPanel;

private void InitializeUI()
{
    GumService.Default.Root.Children.Clear();

    CreateTitlePanel();
    CreateOptionsPanel();
}

private void CreateTitlePanel()
{
    _titleScreenButtonsPanel = new Panel();
    _titleScreenButtonsPanel.Dock(Gum.Wireframe.Dock.Fill);
    _titleScreenButtonsPanel.AddToRoot();

    var startButton = new Button();
    startButton.Anchor(Gum.Wireframe.Anchor.BottomLeft);
    startButton.X = 50;
    startButton.Y = -12;
    startButton.Width = 70;
    startButton.Text = "Start";
    startButton.Click += HandleStartClicked;
    _titleScreenButtonsPanel.AddChild(startButton);

    var optionsButton = new Button();
    optionsButton.Anchor(Gum.Wireframe.Anchor.BottomRight);
    optionsButton.X = -50;
    optionsButton.Y = -12;
    optionsButton.Width = 70;
    optionsButton.Text = "Options";
    optionsButton.Click += HandleOptionsClicked;
    _titleScreenButtonsPanel.AddChild(optionsButton);

    startButton.IsFocused = true;
}`,
      },
      {
        t: 'p',
        html: "Un <code>Panel</code> est un conteneur invisible qui remplit l’écran. Les boutons sont ancrés en bas, à gauche et à droite. <code>AddToRoot()</code> attache le panneau à la racine Gum ; <code>AddChild</code> construit la hiérarchie. Le focus initial est donné au bouton Start pour que la manette fonctionne immédiatement.",
      },
      { t: 'h2', text: 'Options et sliders' },
      {
        t: 'code',
        lang: 'csharp',
        title: 'TitleScene.cs — extrait',
        code: `var musicSlider = new Slider();
musicSlider.Anchor(Gum.Wireframe.Anchor.Top);
musicSlider.Y = 30f;
musicSlider.Minimum = 0;
musicSlider.Maximum = 1;
musicSlider.Value = Core.Audio.SongVolume;
musicSlider.SmallChange = .1;
musicSlider.LargeChange = .2;
musicSlider.ValueChanged += HandleMusicSliderValueChanged;
musicSlider.ValueChangeCompleted += HandleMusicSliderValueChangeCompleted;
_optionsPanel.AddChild(musicSlider);`,
      },
      {
        t: 'callout',
        tone: 'tip',
        title: 'ValueChanged vs ValueChangeCompleted',
        html: "<code>ValueChanged</code> se déclenche à chaque cran pendant le glissement ; <code>ValueChangeCompleted</code> au relâchement. Utilise le premier pour un retour visuel immédiat, le second pour sauvegarder la préférence ou jouer un son.",
      },
      { t: 'h2', text: 'Personnaliser l’apparence' },
      {
        t: 'p',
        html: "Gum fournit des visuels par défaut fonctionnels, mais génériques. Le chapitre 21 les remplace par des contrôles dessinés dans l’atlas du jeu : boutons animés, sliders sur mesure, police bitmap. Le principe reste le même : on crée des classes qui dérivent des contrôles Gum et on surcharge leur rendu.",
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'AnimatedButton.cs — extrait',
        code: `public class AnimatedButton : Button
{
    private AnimatedSprite _sprite;

    public AnimatedButton(AnimatedSprite sprite)
    {
        _sprite = sprite;
        // Configure les états visuels (normal, survolé, appuyé).
    }
}`,
      },
      {
        t: 'p',
        html: "Tu n’as pas besoin de créer un système d’UI complet. Commence par les contrôles standard, puis personnalise uniquement ce qui compte pour l’identité visuelle de ton jeu.",
      },
      { t: 'h2', text: 'Accessibilité : les réflexes' },
      {
        t: 'list',
        items: [
          "Un contraste suffisant entre le texte et le fond ; ne compte pas sur la couleur seule pour transmettre une information.",
          "Un focus visible et un ordre de navigation logique (Tab, flèches).",
          "Des contrôles remappables, ou au moins plusieurs périphériques supportés.",
          "Des tailles de texte lisibles à distance, pas seulement sur ton écran de développeur.",
          "Une option pour réduire les effets de mouvement, les flashs et le shake.",
        ],
      },
      {
        t: 'p',
        html: "L’interface est en place. Dans le prochain chapitre, tu assembles le serpent, les collectibles, le score et les états de jeu pour obtenir une boucle complète.",
      },
    ],
    quiz: [
      {
        question: 'Que fait Dock(Fill) sur un panneau ?',
        options: [
          'Il le place en haut de l’écran',
          'Il l’étire pour occuper tout l’espace disponible du parent',
          'Il le centre horizontalement',
          'Il le rend invisible',
        ],
        correct: 1,
        explanation:
          'Fill occupe tout l’espace du parent. Les autres modes (Top, Bottom, Left, Right) prennent une bande.',
      },
      {
        question: 'Pourquoi donner IsFocused = true à un bouton ?',
        options: [
          'Pour changer sa couleur',
          'Pour que les entrées clavier et manette agissent sur lui dès l’ouverture',
          'Pour le rendre cliquable à la souris',
          'Pour le charger en mémoire',
        ],
        correct: 1,
        explanation:
          'Le focus détermine quel contrôle reçoit les entrées de navigation et de validation. Sans focus initial, la manette ne fait rien.',
      },
      {
        question: 'Quel événement de Slider se déclenche au relâchement ?',
        options: ['ValueChanged', 'ValueChangeCompleted', 'Click', 'FocusChanged'],
        correct: 1,
        explanation:
          'ValueChangeCompleted signale la fin du glissement, idéal pour sauvegarder ou valider la valeur.',
      },
      {
        question: 'Pourquoi le canvas Gum est-il à un quart de la résolution ?',
        options: [
          'Pour économiser la mémoire des assets UI et zoomer le rendu',
          'Parce que Gum ne supporte pas 1280 × 720',
          'Pour accélérer les collisions',
          'Pour éviter le Content Pipeline',
        ],
        correct: 0,
        explanation:
          'Les assets UI sont créés en petite résolution puis zoomés ×4. Cela réduit la taille de l’atlas et garde un rendu net avec PointClamp.',
      },
    ],
    exercises: [
      {
        title: 'Ajouter un bouton Quitter',
        level: 'Facile',
        prompt:
          "Ajoute un bouton « Quit » à droite du bouton Options, qui appelle <code>Core.Instance.Exit()</code>.",
        hint: 'Ancre-le en BottomRight et décale son X pour ne pas chevaucher Options.',
        solution: `var quitButton = new Button();
quitButton.Anchor(Gum.Wireframe.Anchor.BottomRight);
quitButton.X = -130;
quitButton.Y = -12;
quitButton.Width = 70;
quitButton.Text = "Quit";
quitButton.Click += (_, _) => Core.Instance.Exit();
_titleScreenButtonsPanel.AddChild(quitButton);`,
        solutionLang: 'csharp',
      },
      {
        title: 'Slider de volume des effets',
        level: 'Intermédiaire',
        prompt:
          "Ajoute un second slider pour le volume des effets sonores, initialisé avec <code>Core.Audio.SoundEffectVolume</code>, et branche-le sur le contrôleur audio.",
        hint: 'Le slider va de 0 à 1. ValueChanged donne la nouvelle valeur en float.',
        solution: `var sfxSlider = new Slider();
sfxSlider.Anchor(Gum.Wireframe.Anchor.Top);
sfxSlider.Y = 60f;
sfxSlider.Minimum = 0;
sfxSlider.Maximum = 1;
sfxSlider.Value = Core.Audio.SoundEffectVolume;
sfxSlider.ValueChanged += (_, _) =>
{
    Core.Audio.SoundEffectVolume = (float)sfxSlider.Value;
};
_optionsPanel.AddChild(sfxSlider);`,
        solutionLang: 'csharp',
      },
      {
        title: 'Navigation accessible',
        level: 'Défi',
        prompt:
          "Décris trois améliorations d’accessibilité pour ton écran-titre, au-delà du contraste et du focus.",
        hint: 'Pense aux contrôles, aux animations, aux sous-titres et à la lisibilité.',
        solution:
          "1) Proposer un remappage des touches et afficher les contrôles actuels dans le menu. 2) Ajouter une option « réduire les animations » qui coupe le défilement du fond, les flashs et les secousses d’écran. 3) Sous-titrer ou accompagner d’une icône les sons importants, et ne jamais dépendre uniquement d’un signal sonore pour une information de jeu.",
      },
    ],
    sources: [
      {
        label: 'Chapitre 19 officiel — User Interface Fundamentals',
        url: 'https://docs.monogame.net/articles/tutorials/building_2d_games/19_user_interface_fundamentals/index.html',
      },
      {
        label: 'Chapitre 20 officiel — Implementing UI with Gum',
        url: 'https://docs.monogame.net/articles/tutorials/building_2d_games/20_implementing_ui_with_gum/index.html',
      },
      {
        label: 'Chapitre 21 officiel — Customizing Gum UI',
        url: 'https://docs.monogame.net/articles/tutorials/building_2d_games/21_customizing_gum_ui/index.html',
      },
      {
        label: 'Documentation Gum',
        url: 'https://docs.flatredball.com/gum/code/about',
      },
    ],
  },
  {
    slug: 'gameplay-final',
    chapter: 18,
    module: 'pro',
    title: 'Le serpent, le score et la boucle complète',
    navTitle: 'Le jeu complet',
    description:
      'Assemble les mécaniques du serpent, la croissance, les collisions, le score et les états de jeu pour obtenir une boucle jouable de bout en bout.',
    duration: 55,
    objectives: [
      'Implémenter un déplacement sur grille avec interpolation',
      'Gérer une chaîne de segments et sa croissance',
      'Détecter la collision de la tête avec le corps',
      'Structurer les états Playing, Paused et GameOver',
    ],
    blocks: [
      {
        t: 'p',
        html: "Tu as toutes les briques. Il reste à les assembler en une boucle de jeu : le slime avance sur une grille, mange des chauves-souris, grandit, accélère peut-être, et meurt s’il se mord la queue. Chaque système doit rester petit et lisible.",
      },
      { t: 'h2', text: 'Le déplacement sur grille' },
      {
        t: 'p',
        html: "Un serpent classique ne se déplace pas en continu : il avance d’une case tous les 200 ms, puis on interpole visuellement entre l’ancienne et la nouvelle position. Cette séparation entre <strong>logique discrète</strong> et <strong>rendu fluide</strong> simplifie les collisions et donne le « snap » caractéristique du genre.",
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'DungeonSlime/GameObjects/SlimeSegment.cs',
        code: code.slimeSegment,
      },
      {
        t: 'p',
        html: "Chaque segment connaît sa position de départ (<code>At</code>), sa position d’arrivée (<code>To</code>) et sa direction. La tête est le premier élément de la liste. Pour avancer, on décale la tête, on l’insère au début et on retire la queue : les segments suivants n’ont pas besoin d’être recalculés.",
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'Slime.cs — extrait de Move',
        code: `private void Move()
{
    SlimeSegment head = _segments[0];
    head.Direction = _nextDirection;
    head.At = head.To;
    head.To = head.At + head.Direction * _stride;

    _segments.Insert(0, head);
    _segments.RemoveAt(_segments.Count - 1);

    for (int i = 1; i < _segments.Count; i++)
    {
        if (head.At == _segments[i].At)
        {
            BodyCollision?.Invoke(this, EventArgs.Empty);
            return;
        }
    }
}`,
      },
      {
        t: 'callout',
        tone: 'key',
        title: 'Le déplacement est une file',
        html: "Insérer en tête et retirer en queue déplace toute la chaîne sans boucle. C’est l’astuce qui rend le serpent à la fois simple et correct. La queue suit naturellement le chemin de la tête.",
      },
      { t: 'h2', text: 'La croissance' },
      {
        t: 'code',
        lang: 'csharp',
        title: 'Slime.cs — Grow',
        code: `public void Grow()
{
    SlimeSegment tail = _segments[^1];

    SlimeSegment newTail = new SlimeSegment();
    newTail.At = tail.To + tail.ReverseDirection * _stride;
    newTail.To = tail.At;
    newTail.Direction = Vector2.Normalize(tail.At - newTail.At);

    _segments.Add(newTail);
}`,
      },
      {
        t: 'p',
        html: "On duplique la queue derrière elle, dans la direction opposée à son déplacement. Le nouveau segment est initialisé pour que son interpolation reste cohérente dès la frame suivante.",
      },
      { t: 'h2', text: 'Un contrôle abstrait' },
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
}

public static bool Pause()
{
    return s_keyboard.WasKeyJustPressed(Keys.Escape) ||
           s_gamePad.WasButtonJustPressed(Buttons.Start);
}`,
      },
      {
        t: 'callout',
        tone: 'tip',
        title: 'Interdire le demi-tour',
        html: "Le slime ne doit pas pouvoir inverser sa direction instantanément, sinon il se rentre dedans. Compare la direction demandée à la direction actuelle avec un produit scalaire : si <code>dot &lt; 0</code>, ignore l’entrée.",
      },
      {
        t: 'code',
        lang: 'csharp',
        code: `float dot = Vector2.Dot(potentialNextDirection, _segments[0].Direction);
if (dot >= 0)
{
    _nextDirection = potentialNextDirection;
}`,
      },
      { t: 'h2', text: 'Les états de jeu' },
      {
        t: 'code',
        lang: 'csharp',
        title: 'GameScene.cs — extrait',
        code: `private enum GameState
{
    Playing,
    Paused,
    GameOver
}

private GameState _state;
private int _score;
private Slime _slime;
private Bat _bat;
private GameSceneUI _ui;

private void InitializeNewGame()
{
    Vector2 slimePos = new Vector2(
        (_tilemap.Columns / 2) * _tilemap.TileWidth,
        (_tilemap.Rows / 2) * _tilemap.TileHeight
    );

    _slime.Initialize(slimePos, _tilemap.TileWidth);
    _bat.RandomizeVelocity();
    PositionBatAwayFromSlime();

    _score = 0;
    _state = GameState.Playing;
}`,
      },
      {
        t: 'p',
        html: "L’état décide de ce qui est mis à jour. En pause, on continue de mettre à jour l’UI mais pas le serpent. En game over, on affiche le panneau et on attend une action. Les entrées de pause et de reprise restent actives dans tous les états pertinents.",
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'GameScene.cs — extrait de Update',
        code: `public override void Update(GameTime gameTime)
{
    _ui.Update(gameTime);

    if (_state == GameState.Playing)
    {
        if (GameController.Pause())
        {
            TogglePause();
            return;
        }

        _slime.Update(gameTime);
        _bat.Update(gameTime);
        CollisionChecks();
    }
    else if (_state == GameState.Paused && GameController.Pause())
    {
        TogglePause();
    }
}`,
      },
      { t: 'h2', text: 'Score et interface de jeu' },
      {
        t: 'code',
        lang: 'csharp',
        title: 'GameScene.cs — extraits de collision',
        code: `private void CollisionChecks()
{
    Circle slimeBounds = _slime.GetBounds();
    Circle batBounds = _bat.GetBounds();

    if (slimeBounds.Intersects(batBounds))
    {
        _score += 100;
        _ui.UpdateScoreText(_score);

        _slime.Grow();
        PositionBatAwayFromSlime();
        Core.Audio.PlaySoundEffect(_collectSoundEffect);
    }

    if (slimeBounds.Left < _roomBounds.Left ||
        slimeBounds.Right > _roomBounds.Right ||
        slimeBounds.Top < _roomBounds.Top ||
        slimeBounds.Bottom > _roomBounds.Bottom)
    {
        GameOver();
    }
}`,
      },
      {
        t: 'code',
        lang: 'csharp',
        title: 'GameSceneUI.cs — extrait',
        code: `public class GameSceneUI : ContainerRuntime
{
    public event EventHandler ResumeButtonClick;
    public event EventHandler RetryButtonClick;
    public event EventHandler QuitButtonClick;

    private Panel _pausePanel;
    private Panel _gameOverPanel;
    private Label _scoreText;
    private Button _resumeButton;
    private Button _retryButton;

    public void UpdateScoreText(int score)
    {
        _scoreText.Text = string.Format("SCORE: {0:000000}", score);
    }

    public void ShowPausePanel()
    {
        _pausePanel.IsVisible = true;
        _resumeButton.IsFocused = true;
        _gameOverPanel.IsVisible = false;
    }

    public void ShowGameOverPanel()
    {
        _gameOverPanel.IsVisible = true;
        _retryButton.IsFocused = true;
        _pausePanel.IsVisible = false;
    }
}`,
      },
      {
        t: 'callout',
        tone: 'info',
        title: 'Les événements plutôt que les références croisées',
        html: "GameSceneUI expose des événements (<code>ResumeButtonClick</code>…). GameScene s’y abonne et décide de la suite. L’UI ne connaît pas la scène, la scène connaît l’UI : la dépendance va dans un seul sens.",
      },
      { t: 'h2', text: 'La boucle complète' },
      {
        t: 'steps',
        items: [
          {
            title: 'Titre → Jeu',
            html: "Entrée ou bouton Start crée une <code>GameScene</code> et l’active via <code>Core.ChangeScene</code>.",
          },
          {
            title: 'Jeu → Pause',
            html: "Échap ou Start ouvre le panneau de pause, met le focus sur « Resume » et gèle la logique du serpent.",
          },
          {
            title: 'Jeu → Game over',
            html: "Une collision avec le corps ou un bord déclenche le panneau de game over et fige la partie.",
          },
          {
            title: 'Game over → Rejouer ou Quitter',
            html: "« Retry » réinitialise le slime, la chauve-souris et le score sans recharger les assets. « Quit » revient au titre.",
          },
        ],
      },
      {
        t: 'p',
        html: "Tu as maintenant un jeu jouable. Le prochain chapitre ajoute un effet de shader pour le game over ; le suivant t’apprend à le packager et à le publier.",
      },
    ],
    quiz: [
      {
        question: 'Comment déplace-t-on la chaîne du serpent sans boucler sur chaque segment ?',
        options: [
          'En recalculant toutes les positions depuis la tête',
          'En insérant la nouvelle tête au début et en retirant la queue',
          'En inversant la liste',
          'En téléportant chaque segment',
        ],
        correct: 1,
        explanation:
          'La liste décrit le chemin parcouru. Insérer la tête et retirer la queue décale toute la chaîne en temps constant.',
      },
      {
        question: 'Pourquoi interdire le demi-tour instantané ?',
        options: [
          'Pour des raisons esthétiques',
          'Parce que la tête entrerait immédiatement dans le corps',
          'Parce que la manette ne le permet pas',
          'Pour économiser de la mémoire',
        ],
        correct: 1,
        explanation:
          'Inverser la direction ferait que la tête occupe la case du cou, déclenchant une collision avec le corps. Le produit scalaire permet de filtrer.',
      },
      {
        question: 'Que fait Slime.Grow() ?',
        options: [
          'Il augmente la vitesse',
          'Il ajoute un segment derrière la queue',
          'Il change la couleur du slime',
          'Il recharge la tilemap',
        ],
        correct: 1,
        explanation:
          'Grow duplique la queue dans la direction opposée, ce qui allonge la chaîne au prochain déplacement.',
      },
      {
        question: 'Comment GameScene et GameSceneUI communiquent-ils ?',
        options: [
          'L’UI appelle directement les méthodes de la scène',
          'La scène s’abonne aux événements exposés par l’UI',
          'Ils partagent une variable globale',
          'Ils ne communiquent pas',
        ],
        correct: 1,
        explanation:
          'GameSceneUI expose des événements ; GameScene s’y abonne. La dépendance va de la scène vers l’UI, pas l’inverse.',
      },
      {
        question: 'Que doit faire Update lorsque l’état est Paused ?',
        options: [
          'Continuer à déplacer le serpent',
          'Mettre à jour l’UI et écouter la reprise, sans avancer la logique du jeu',
          'Arrêter complètement le jeu',
          'Changer de scène',
        ],
        correct: 1,
        explanation:
          'La pause gèle la simulation mais garde l’interface réactive pour permettre de reprendre ou de quitter.',
      },
    ],
    exercises: [
      {
        title: 'Accélérer avec le score',
        level: 'Facile',
        prompt:
          "Réduis le délai de déplacement du slime de 200 ms à 150 ms lorsque le score atteint 500 points.",
        hint: 'Le délai est s_time, une constante ou un champ de Slime. Rends-le configurable.',
        solution: `// Remplacer la constante par un champ :
private TimeSpan _movementTime = TimeSpan.FromMilliseconds(200);

// Dans Update, après la collecte :
if (_score >= 500)
{
    _slime.MovementTime = TimeSpan.FromMilliseconds(150);
}`,
        solutionLang: 'csharp',
      },
      {
        title: 'Faire grandir le slime',
        level: 'Intermédiaire',
        prompt:
          "Appelle Grow() quand le slime collecte une chauve-souris et vérifie que la queue s’allonge correctement.",
        hint: 'L’appel se fait dans le bloc de collision, après le score.',
        solution: `if (slimeBounds.Intersects(batBounds))
{
    _score += 100;
    _ui.UpdateScoreText(_score);
    _slime.Grow();
    PositionBatAwayFromSlime();
    Core.Audio.PlaySoundEffect(_collectSoundEffect);
}`,
        solutionLang: 'csharp',
      },
      {
        title: 'Screen shake',
        level: 'Défi',
        prompt:
          "Ajoute une secousse d’écran de 150 ms lors d’un game over. Comment l’implémenter sans déplacer la logique du jeu ?",
        hint: 'Décale la caméra ou la matrice de SpriteBatch.Begin, pas les positions des entités.',
        solution:
          "On stocke une durée et une intensité de shake. Pendant le Draw, on calcule un offset aléatoire (ou sinusoïdal) et on le passe à SpriteBatch.Begin(transformMatrix: Matrix.CreateTranslation(offset.X, offset.Y, 0)). Les positions logiques ne changent pas, seule la présentation est décalée. Il faut respecter une option d’accessibilité pour désactiver le shake.",
      },
    ],
    sources: [
      {
        label: 'Chapitre 22 officiel — Snake Game Mechanics',
        url: 'https://docs.monogame.net/articles/tutorials/building_2d_games/22_snake_game_mechanics/index.html',
      },
      {
        label: 'Chapitre 23 officiel — Completing the Game',
        url: 'https://docs.monogame.net/articles/tutorials/building_2d_games/23_completing_the_game/index.html',
      },
    ],
  },
  {
    slug: 'shaders',
    chapter: 19,
    module: 'pro',
    title: 'Des effets visuels avec les shaders',
    navTitle: 'Les shaders',
    description:
      'Écris ton premier pixel shader HLSL et applique un fondu en niveaux de gris au game over, directement sur le GPU.',
    duration: 35,
    objectives: [
      'Expliquer le rôle d’un vertex shader et d’un pixel shader',
      'Lire la structure d’un fichier .fx',
      'Charger un Effect et le passer à SpriteBatch',
      'Moduler un effet avec un paramètre',
    ],
    blocks: [
      {
        t: 'p',
        html: "Un shader est un petit programme exécuté sur le GPU. Au lieu de calculer la couleur d’un pixel en C#, tu délègues ce travail à la carte graphique, pour chaque pixel, en parallèle. C’est ce qui permet les effets de lumière, de distortion, de saturation ou de brouillard à coût maîtrisé.",
      },
      {
        t: 'image',
        src: '/images/shader-pipeline.png',
        alt: 'Schéma du pipeline de shaders : vertex shader, rasterisation, pixel shader',
        caption: 'Le pipeline graphique simplifié. Image : tutoriel officiel.',
        wide: true,
      },
      { t: 'h2', text: 'Vertex shader et pixel shader' },
      {
        t: 'table',
        head: ['Type', 'Entrée', 'Rôle'],
        rows: [
          ['Vertex shader', 'Sommets (position, couleur, UV)', 'Transforme les sommets et prépare les données pour la rasterisation'],
          ['Pixel shader', 'Fragments interpolés', 'Calcule la couleur finale de chaque pixel'],
        ],
      },
      {
        t: 'p',
        html: "MonoGame compile les fichiers <code>.fx</code> en bytecode via le Content Pipeline, puis les traduit pour DirectX, OpenGL ou Vulkan selon la plateforme. Le langage source est HLSL, mais MonoGame gère la portabilité via MojoShader sur OpenGL.",
      },
      { t: 'h2', text: 'La structure d’un fichier .fx' },
      {
        t: 'code',
        lang: 'glsl',
        title: 'Content/effects/grayscale.fx',
        code: code.grayscale,
      },
      {
        t: 'p',
        html: "Le fichier déclare une texture, un sampler, un paramètre <code>Saturation</code>, une structure de sortie de vertex shader, puis une fonction <code>MainPS</code>. La <code>technique</code> indique quel pixel shader compiler pour la passe <code>P0</code>. MonoGame ne se sert que du pixel shader ici : le vertex shader par défaut de SpriteBatch fait le reste.",
      },
      {
        t: 'callout',
        tone: 'info',
        title: 'Pourquoi les macros OPENGL ?',
        html: "DirectX et OpenGL n’utilisent pas les mêmes noms de sémantiques et de modèles de shader. Les <code>#define</code> en tête du fichier permettent au même code source de compiler sur les deux backends.",
      },
      { t: 'h2', text: 'Charger et appliquer l’effet' },
      {
        t: 'code',
        lang: 'csharp',
        title: 'GameScene.cs — extrait',
        code: `private Effect _grayscaleEffect;
private float _saturation = 1.0f;

public override void LoadContent()
{
    _grayscaleEffect = Content.Load<Effect>("effects/grayscaleEffect");
}

private void GameOver()
{
    _ui.ShowGameOverPanel();
    _state = GameState.GameOver;
    _saturation = 1.0f;
}

public override void Draw(GameTime gameTime)
{
    Core.GraphicsDevice.Clear(Color.CornflowerBlue);

    if (_state != GameState.Playing)
    {
        _grayscaleEffect.Parameters["Saturation"].SetValue(_saturation);
        Core.SpriteBatch.Begin(
            samplerState: SamplerState.PointClamp,
            effect: _grayscaleEffect
        );
    }
    else
    {
        Core.SpriteBatch.Begin(samplerState: SamplerState.PointClamp);
    }

    _tilemap.Draw(Core.SpriteBatch);
    _slime.Draw();
    _bat.Draw();
    Core.SpriteBatch.End();

    _ui.Draw();
}`,
      },
      {
        t: 'p',
        html: "Le paramètre <code>Saturation</code> vaut 1 en jeu normal et descend vers 0 pour désaturer l’écran. L’effet est appliqué à tout ce que dessine le SpriteBatch entre <code>Begin</code> et <code>End</code>, sauf l’UI dessinée après, avec un autre batch.",
      },
      {
        t: 'callout',
        tone: 'tip',
        title: 'Le shader ne remplace pas le design',
        html: "Un effet doit servir le feedback : game over, dégâts, transition, état altéré. Si l’effet rend le jeu illisible ou provoque un inconfort, il dessert le joueur. Prévois toujours une option pour le réduire ou le désactiver.",
      },
      { t: 'h2', text: 'Aller plus loin' },
      {
        t: 'list',
        items: [
          "Ajouter un paramètre <code>Intensity</code> pour doser l’effet sans réécrire le shader.",
          "Combiner plusieurs textures pour un effet de dissolution.",
          "Utiliser le temps comme paramètre pour animer une vague ou un flash.",
          "Toujours tester sur les backends ciblés : un shader qui compile sur DirectX peut échouer sur OpenGL.",
        ],
      },
      {
        t: 'p',
        html: "Dernière étape : transformer ton projet en binaire distribuable, puis le publier. C’est le chapitre suivant.",
      },
    ],
    quiz: [
      {
        question: 'Quel shader calcule la couleur d’un pixel ?',
        options: ['Le vertex shader', 'Le pixel shader', 'Le geometry shader', 'Le compute shader'],
        correct: 1,
        explanation:
          'Le pixel shader (ou fragment shader) s’exécute par fragment et retourne la couleur finale.',
      },
      {
        question: 'Que déclare une technique dans un fichier .fx ?',
        options: [
          'La résolution de la fenêtre',
          'Les passes et les shaders à compiler',
          'Les textures du jeu',
          'Les contrôles clavier',
        ],
        correct: 1,
        explanation:
          'Une technique regroupe une ou plusieurs passes ; chaque passe indique quel vertex/pixel shader compiler.',
      },
      {
        question: 'Comment passer une valeur à un shader ?',
        options: [
          'En modifiant le fichier .fx à l’exécution',
          'Via Effect.Parameters["Nom"].SetValue(...)',
          'En changeant la résolution',
          'En recréant le SpriteBatch',
        ],
        correct: 1,
        explanation:
          'Les paramètres déclarés dans le shader sont accessibles par nom et mis à jour avant le Begin ou le Draw.',
      },
      {
        question: 'Pourquoi l’UI est-elle dessinée après le batch avec effet ?',
        options: [
          'Pour qu’elle reste nette et non désaturée',
          'Parce que Gum ne supporte pas les shaders',
          'Pour accélérer le rendu',
          'Parce que SpriteBatch ne peut pas changer d’effet',
        ],
        correct: 0,
        explanation:
          'L’effet s’applique à tout le batch. Dessiner l’UI dans un second batch sans effet la garde lisible et colorée.',
      },
    ],
    exercises: [
      {
        title: 'Paramètre d’intensité',
        level: 'Facile',
        prompt:
          "Renomme <code>Saturation</code> en <code>Intensity</code> dans le shader et le C#, puis fais varier la valeur de 1 à 0 sur 0,5 seconde au game over.",
        hint: 'Utilise _saturation -= deltaTime * 2 dans Update lorsque l’état est GameOver.',
        solution: `// Shader :
float Intensity = 1.0f;
float3 finalColor = lerp(grayscale, color.rgb, Intensity);

// C# :
_grayscaleEffect.Parameters["Intensity"].SetValue(_intensity);
_intensity = MathHelper.Max(0f, _intensity - (float)gameTime.ElapsedGameTime.TotalSeconds * 2f);`,
        solutionLang: 'csharp',
      },
      {
        title: 'Teinte de dégâts',
        level: 'Intermédiaire',
        prompt:
          "Écris un shader qui ajoute une teinte rouge quand un paramètre Damage vaut 1, sans supprimer les couleurs d’origine.",
        hint: 'Mélange la couleur d’origine avec du rouge en utilisant Damage comme facteur.',
        solution: `float Damage = 0.0f;

float4 MainPS(VertexShaderOutput input) : COLOR
{
    float4 color = tex2D(SpriteTextureSampler, input.TextureCoordinates) * input.Color;
    float3 damaged = lerp(color.rgb, float3(1.0, 0.1, 0.1), Damage * 0.5);
    return float4(damaged, color.a);
}`,
        solutionLang: 'glsl',
      },
      {
        title: 'Coût d’un shader',
        level: 'Défi',
        prompt:
          "Pourquoi un pixel shader peut-il coûter plus cher qu’un calcul C# équivalent ? Dans quels cas faut-il l’éviter ?",
        hint: 'Pense au nombre de pixels, à la parallélisation, à la bande passante et aux plateformes mobiles.',
        solution:
          "Un pixel shader s’exécute pour chaque pixel couvert, plusieurs millions de fois par frame. Il est massivement parallèle, mais chaque instruction compte, surtout en remplissage (overdraw) et sur mobile. Il faut éviter les effets coûteux sur des surfaces plein écran, les branches complexes et les textures supplémentaires inutiles. À l’inverse, un calcul C# par objet est souvent moins coûteux qu’un shader par pixel.",
      },
    ],
    sources: [
      {
        label: 'Chapitre 24 officiel — Shaders',
        url: 'https://docs.monogame.net/articles/tutorials/building_2d_games/24_shaders/index.html',
      },
      {
        label: 'Documentation HLSL',
        url: 'https://learn.microsoft.com/windows/win32/direct3dhlsl/dx-graphics-hlsl',
      },
    ],
  },
  {
    slug: 'publication',
    chapter: 20,
    module: 'pro',
    title: 'Packager et publier ton jeu',
    navTitle: 'Packager et publier',
    description:
      'Produis un binaire autonome pour Windows, macOS ou Linux, prépare ta page itch.io et termine le parcours avec un jeu distribuable.',
    duration: 45,
    objectives: [
      'Publier une version self-contained',
      'Comprendre ReadyToRun, TieredCompilation et le trimming',
      'Préparer une archive propre par plateforme',
      'Créer une page itch.io et y uploader le jeu',
    ],
    blocks: [
      {
        t: 'p',
        html: "Un jeu qui tourne sur ta machine n’est pas encore un jeu distribuable. Il faut inclure le runtime .NET, compiler les assets, choisir les bons paramètres de publication et fournir une archive que le joueur peut lancer sans rien installer.",
      },
      {
        t: 'callout',
        tone: 'info',
        title: 'Version et chemins',
        html: "Les exemples utilisent <code>net9.0</code>, la cible des modèles MonoGame 3.8.6. Si ton projet cible <code>net8.0</code> ou <code>net10.0</code>, adapte le chemin de sortie. Le dossier <code>Content</code> doit toujours accompagner l’exécutable.",
      },
      { t: 'h2', text: 'Publier pour Windows' },
      {
        t: 'code',
        lang: 'bash',
        title: 'Windows x64',
        code: `dotnet publish -c Release -r win-x64 \
  -p:PublishReadyToRun=false \
  -p:TieredCompilation=false \
  --self-contained

# Sortie : bin/Release/net9.0/win-x64/publish/`,
      },
      {
        t: 'p',
        html: "Le dossier <code>publish</code> contient l’exécutable, les DLL du runtime et le dossier <code>Content</code>. Zippe <strong>tout le contenu</strong> du dossier, pas seulement le .exe. Le joueur décompresse et lance l’exécutable.",
      },
      { t: 'h2', text: 'Publier pour macOS' },
      {
        t: 'code',
        lang: 'bash',
        code: `# Intel
dotnet publish -c Release -r osx-x64 -p:PublishReadyToRun=false -p:TieredCompilation=false --self-contained

# Apple Silicon
dotnet publish -c Release -r osx-arm64 -p:PublishReadyToRun=false -p:TieredCompilation=false --self-contained`,
      },
      {
        t: 'p',
        html: "Pour une application <code>.app</code>, crée la structure <code>DungeonSlime.app/Contents/MacOS/</code>, copie le contenu publié dedans, puis signe et notarise l’application avec les outils Apple. Sans notarisation, macOS affichera un avertissement de sécurité. Pour un prototype, une archive avec le binaire et un script de lancement peut suffire.",
      },
      { t: 'h2', text: 'Publier pour Linux' },
      {
        t: 'code',
        lang: 'bash',
        title: 'Linux x64',
        code: `dotnet publish -c Release -r linux-x64 \
  -p:PublishReadyToRun=false \
  -p:TieredCompilation=false \
  --self-contained

chmod +x bin/Release/net9.0/linux-x64/publish/DungeonSlime
tar -czf DungeonSlime-linux-x64.tar.gz \
  -C bin/Release/net9.0/linux-x64/publish/ .`,
      },
      {
        t: 'p',
        html: "Le bit exécutable n’est pas toujours conservé dans une archive ZIP. Fournis un <code>.tar.gz</code> ou indique <code>chmod +x DungeonSlime</code> dans les instructions.",
      },
      { t: 'h2', text: 'Les paramètres qui comptent' },
      {
        t: 'table',
        head: ['Paramètre', 'Effet', 'Recommandation'],
        rows: [
          ['<code>--self-contained</code>', 'Inclut le runtime .NET', 'Oui pour une distribution simple'],
          ['<code>PublishReadyToRun</code>', 'Précompile du code pour réduire le temps de démarrage', 'Souvent false pour les jeux MonoGame'],
          ['<code>TieredCompilation</code>', 'Compilation JIT progressive', 'Désactivé pour un comportement stable'],
          ['<code>PublishTrimmed</code>', 'Supprime le code inutilisé', 'Risqué avec la réflexion ; tester'],
          ['<code>PublishSingleFile</code>', 'Un seul exécutable', 'Pratique, mais le Content reste à côté'],
        ],
      },
      {
        t: 'callout',
        tone: 'warn',
        title: 'Le trimming et MonoGame',
        html: "MonoGame utilise la réflexion pour charger le contenu et certains types. Un trimming agressif peut supprimer du code nécessaire et provoquer des erreurs au runtime. Teste toujours un build trimmé sur une machine propre ; dans le doute, ne trime pas.",
      },
      { t: 'h2', text: 'Préparer la page itch.io' },
      {
        t: 'steps',
        items: [
          {
            title: 'Créer un projet',
            html: "Sur <a href=\"https://itch.io/game/new\" target=\"_blank\" rel=\"noreferrer\">itch.io/game/new</a>, renseigne le titre, le type (Downloadable), le prix (ou « No payments »), et une description courte.",
          },
          {
            title: 'Uploader les builds',
            html: "Ajoute une archive par plateforme. Coche la bonne plateforme pour chaque fichier (Windows, macOS, Linux). Évite les exécutables seuls : fournis un ZIP ou un TAR.GZ.",
          },
          {
            title: 'Ajouter des visuels',
            html: "Une cover 630 × 500, trois à cinq captures d’écran, et éventuellement un GIF. C’est ce que les joueurs voient en premier.",
          },
          {
            title: 'Rédiger la page',
            html: "Explique les contrôles, la configuration requise, la durée, et comment lancer le jeu. Ajoute les crédits des assets et des musiques.",
          },
          {
            title: 'Publier et tester',
            html: "Passe la visibilité en public, ouvre la page dans un navigateur déconnecté, télécharge l’archive et lance-la sur une machine sans SDK .NET.",
          },
        ],
      },
      {
        t: 'callout',
        tone: 'key',
        title: 'Le test de la machine propre',
        html: "La seule validation qui compte : une personne qui n’a pas .NET installé télécharge ton archive, la décompresse et lance le jeu. Si cela fonctionne, tu as un jeu distribuable. Tout le reste est du polish.",
      },
      { t: 'h2', text: 'Sécurité et code' },
      {
        t: 'p',
        html: "Les fichiers <code>.xnb</code> ne sont pas chiffrés. Un utilisateur motivé peut extraire tes textures et tes sons. L’obfuscation du code C# ralentit l’analyse mais ne la rend pas impossible. Ne mets jamais de secrets (clés API, mots de passe) dans un client de jeu : tout ce qui est embarqué peut être extrait.",
      },
      { t: 'h2', text: 'Terminer, vraiment' },
      {
        t: 'p',
        html: "Tu as construit un jeu complet : boucle, rendu, entrées, collisions, tilemaps, audio, texte, scènes, interface, shaders et publication. Ce n’est pas seulement un tutoriel terminé ; c’est une base réutilisable. La prochaine étape n’est pas d’apprendre encore un framework, mais de <strong>finir un petit jeu original</strong>.",
      },
      {
        t: 'list',
        items: [
          "Choisis un concept que tu peux terminer en une à deux semaines.",
          "Réutilise Core, Scene, InputManager, AudioController et TextureAtlas.",
          "Coupe les fonctionnalités qui ne servent pas la boucle principale.",
          "Publie une version jouable, même imparfaite. Les retours valent plus que le polish isolé.",
          "Recommence avec ce que tu as appris.",
        ],
      },
      {
        t: 'callout',
        tone: 'tip',
        title: 'Le mot de la fin',
        html: "La différence entre un développeur de jeux et une personne qui suit des tutoriels, c’est un jeu terminé et publié. Tu viens de faire le plus dur. Continue.",
      },
    ],
    quiz: [
      {
        question: 'Que fait --self-contained ?',
        options: [
          'Il inclut le runtime .NET dans la publication',
          'Il compresse les textures',
          'Il crée une page itch.io',
          'Il désactive le Content Pipeline',
        ],
        correct: 0,
        explanation:
          'Le runtime est copié avec le jeu. Le joueur n’a pas besoin d’installer .NET séparément.',
      },
      {
        question: 'Pourquoi ne pas publier uniquement le fichier .exe ?',
        options: [
          'Parce que Windows le bloque',
          'Parce que le jeu a besoin des DLL, du runtime et du dossier Content',
          'Parce que l’exécutable est trop petit',
          'Parce que MonoGame exige un .sln',
        ],
        correct: 1,
        explanation:
          'L’exécutable dépend du runtime, des assemblies et des assets compilés. Il faut distribuer tout le dossier publish.',
      },
      {
        question: 'Quel est le risque du trimming avec MonoGame ?',
        options: [
          'Il augmente la taille du build',
          'Il peut supprimer du code utilisé par réflexion',
          'Il désactive le son',
          'Il empêche la publication',
        ],
        correct: 1,
        explanation:
          'Le trimmer ne voit pas les usages via réflexion. Il peut retirer des types nécessaires au chargement du contenu.',
      },
      {
        question: 'Quel test valide vraiment une publication ?',
        options: [
          'Lancer le jeu sur sa machine de développement',
          'Télécharger l’archive et la lancer sur une machine sans SDK .NET',
          'Compiler sans erreur',
          'Avoir une page itch.io',
        ],
        correct: 1,
        explanation:
          'Seule une machine propre reproduit les conditions du joueur : runtime inclus, fichiers présents, chemins corrects.',
      },
    ],
    exercises: [
      {
        title: 'Publier une version Windows',
        level: 'Facile',
        prompt:
          "Publie le jeu en Release pour win-x64, zippe le dossier publish et vérifie que le dossier Content est présent.",
        hint: 'La commande est donnée dans le chapitre. Ouvre l’archive et inspecte la structure.',
        solution:
          "Commande : dotnet publish -c Release -r win-x64 -p:PublishReadyToRun=false -p:TieredCompilation=false --self-contained. L’archive doit contenir DungeonSlime.exe, les DLL, et Content/ avec les .xnb. Lance l’exe depuis un autre dossier pour vérifier que les chemins relatifs fonctionnent.",
      },
      {
        title: 'Tester sur une machine propre',
        level: 'Intermédiaire',
        prompt:
          "Envoie l’archive à une personne (ou utilise une machine virtuelle sans .NET), fais-la lancer le jeu et note les problèmes. Corrige au moins un point.",
        hint: 'Les problèmes classiques : archive incomplète, Content manquant, antivirus, dépendance native.',
        solution:
          "Il n’y a pas de solution universelle : le résultat dépend de ce que tu observes. Documente le système, le message d’erreur et l’étape. Vérifie d’abord la présence de Content/ et du runtime, puis les dépendances natives (OpenAL, SDL) et la signature du binaire. Corrige l’archive ou les instructions, puis reteste.",
      },
      {
        title: 'Préparer la page itch.io',
        level: 'Défi',
        prompt:
          "Rédige la fiche de ton jeu : titre, pitch en une phrase, contrôles, configuration, crédits, trois captures. Publie-la en privé et relis-la comme un joueur.",
        hint: 'Un bon pitch dit ce que fait le joueur, pas la technologie utilisée.',
        solution:
          "Exemple de pitch : « Guidez une chaîne de slimes dans un donjon, collectez les chauves-souris et évitez de vous mordre la queue. » Indique les contrôles (flèches/WASD, Échap, manette), la configuration (Windows 10+, 200 Mo), et crédite les assets. Les captures doivent montrer le jeu, pas l’éditeur. Relis la page sur mobile : c’est là que beaucoup de joueurs la découvrent.",
      },
    ],
    sources: [
      {
        label: 'Chapitre 25 officiel — Packaging Your Game',
        url: 'https://docs.monogame.net/articles/tutorials/building_2d_games/25_packaging_game/index.html',
      },
      {
        label: 'Chapitre 26 officiel — Publishing to itch.io',
        url: 'https://docs.monogame.net/articles/tutorials/building_2d_games/26_publish_to_itch/index.html',
      },
      {
        label: 'Chapitre 27 officiel — Conclusion',
        url: 'https://docs.monogame.net/articles/tutorials/building_2d_games/27_conclusion/index.html',
      },
      {
        label: 'Créer un projet itch.io',
        url: 'https://itch.io/game/new',
      },
    ],
  },
];
