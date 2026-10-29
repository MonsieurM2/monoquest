import {
  MODULES,
  lessonSlugs,
  lessons,
  lessonsByModule,
  totalExercises,
  totalMinutes,
  totalQuizQuestions,
} from '../data';
import { icon, slimeMark } from '../lib/dom';
import { getProgress, isComplete, nextLesson } from '../lib/progress';

function moduleCard(module: (typeof MODULES)[number]): string {
  const items = lessonsByModule(module.id);
  const done = items.filter((lesson) => isComplete(lesson.slug)).length;

  return `<article class="module-card">
    <div class="module-card-head">
      <span class="module-number">${module.number}</span>
      <span class="module-count">${items.length} chapitre${items.length > 1 ? 's' : ''}</span>
    </div>
    <h3>${module.title}</h3>
    <p>${module.description}</p>
    <ul class="module-lessons">
      ${items
        .slice(0, 4)
        .map(
          (lesson) => `<li>
            <a href="/cours/${lesson.slug}" data-link>
              <span class="module-dot${isComplete(lesson.slug) ? ' is-done' : ''}"></span>
              ${lesson.navTitle}
            </a>
          </li>`,
        )
        .join('')}
      ${items.length > 4 ? `<li class="module-more">+ ${items.length - 4} autres chapitres</li>` : ''}
    </ul>
    <div class="module-card-foot">
      <span>${done} / ${items.length} terminé${done > 1 ? 's' : ''}</span>
      <a href="/parcours#module-${module.id}" data-link>Voir le module ${icon('arrow-right')}</a>
    </div>
  </article>`;
}

function startHref(): string {
  const progress = getProgress();
  return `/cours/${progress.lastLesson ?? nextLesson(lessonSlugs) ?? lessonSlugs[0]}`;
}

function heroCta(): { href: string; label: string } {
  const progress = getProgress();
  if (progress.completed.length > 0) {
    return { href: startHref(), label: 'Reprendre le parcours' };
  }
  return { href: startHref(), label: 'Commencer le parcours' };
}

export function renderHome(): string {
  const cta = heroCta();
  const hours = Math.round(totalMinutes / 60);

  return `<div class="home">
    <section class="hero">
      <div class="hero-glow" aria-hidden="true"></div>
      <div class="container hero-grid">
        <div class="hero-copy">
          <p class="hero-eyebrow">
            <span class="status-dot"></span>
            Adaptation française du tutoriel officiel MonoGame
            <span class="eyebrow-sep">·</span>
            <span class="mono">3.8.6</span>
          </p>
          <h1>Apprends le C# en créant <span class="accent-word">ton premier jeu 2D</span>.</h1>
          <p class="hero-lead">
            Un parcours guidé, du premier <code>dotnet new</code> jusqu’à un jeu publié.
            Tu construis <strong>Dungeon Slime</strong> pas à pas, avec des quiz pour vérifier
            que tu comprends vraiment.
          </p>
          <div class="hero-actions">
            <a class="btn btn-primary btn-lg" href="${cta.href}" data-link>${cta.label} ${icon('arrow-right')}</a>
            <a class="btn btn-ghost btn-lg" href="/parcours" data-link>${icon('list')} Voir le programme</a>
          </div>
          <dl class="hero-stats">
            <div><dt>${lessons.length}</dt><dd>chapitres</dd></div>
            <div><dt>${totalQuizQuestions}</dt><dd>questions de quiz</dd></div>
            <div><dt>${totalExercises}</dt><dd>exercices</dd></div>
            <div><dt>≈ ${hours} h</dt><dd>de pratique</dd></div>
          </dl>
          <p class="hero-note">
            ${icon('check')} Sans inscription · progression sauvegardée localement · code C# vérifié
          </p>
        </div>

        <div class="hero-visual" aria-hidden="true">
          <div class="game-window">
            <div class="game-window-bar">
              <span class="window-dots"><i></i><i></i><i></i></span>
              <span class="window-title">Dungeon Slime</span>
              <span class="window-tag">MonoGame</span>
            </div>
            <img src="/images/dungeon-slime-title.png" alt="" />
            <div class="game-window-foot">
              <span><i class="foot-dot"></i> 60 FPS</span>
              <span>1280 × 720</span>
              <span>C# · .NET</span>
            </div>
          </div>

          <div class="float-card float-code">
            <span class="float-code-dot"></span>
            <code>SpriteBatch.Begin();</code>
          </div>
          <div class="float-card float-progress">
            <span class="float-progress-icon">${icon('check')}</span>
            <span><strong>Chapitre 08</strong><small>terminé · +1</small></span>
          </div>
          <div class="hero-slime">${slimeMark(82)}</div>
        </div>
      </div>

      <div class="container tech-strip">
        <span>Construit avec</span>
        <div class="tech-items">
          <span class="tech-item"><span class="tech-c">C#</span> C#</span>
          <span class="tech-item"><span class="tech-net">.NET</span> .NET 9 / 10</span>
          <span class="tech-item"><img src="/images/monogame-logo.png" alt="" /> MonoGame 3.8.6</span>
          <span class="tech-item"><span class="tech-gum">G</span> Gum UI</span>
        </div>
      </div>
    </section>

    <section class="section build-section">
      <div class="container split">
        <div class="split-copy">
          <p class="eyebrow">Le projet fil rouge</p>
          <h2>Un vrai jeu, pas un exercice jetable.</h2>
          <p class="section-lead">
            À chaque chapitre, tu ajoutes une brique à <strong>Dungeon Slime</strong> : un serpent
            qui parcourt un donjon, collecte des chauves-souris et évite de se mordre la queue.
            À la fin, tu as un jeu complet — et tu sais comment il fonctionne.
          </p>
          <ul class="check-list">
            <li>${icon('check')} Un rendu 2D net, avec atlas de textures et animations</li>
            <li>${icon('check')} Des contrôles clavier, souris et manette</li>
            <li>${icon('check')} Une boucle de jeu complète : menu, partie, pause, game over</li>
            <li>${icon('check')} Du son, une interface stylée et des shaders</li>
            <li>${icon('check')} Un binaire publié sur itch.io</li>
          </ul>
          <a class="text-link" href="/cours/gameplay-final" data-link>Voir le résultat final ${icon('arrow-right')}</a>
        </div>
        <div class="split-visual">
          <div class="screenshot-frame">
            <img src="/images/dungeon-slime-game.png" alt="Dungeon Slime en jeu : un slime bleu dans un donjon" loading="lazy" />
            <div class="screenshot-badge">Gameplay · 2D</div>
          </div>
          <div class="code-float">
            <span class="code-float-label">Game1.cs</span>
            <pre><code><span class="tok-key">protected override</span> <span class="tok-type">void</span> <span class="tok-fn">Draw</span>(GameTime gameTime)
{
    SpriteBatch.<span class="tok-fn">Begin</span>();
    _slime.<span class="tok-fn">Draw</span>(SpriteBatch);
    SpriteBatch.<span class="tok-fn">End</span>();
}</code></pre>
          </div>
        </div>
      </div>
    </section>

    <section class="section modules-section" id="programme">
      <div class="container">
        <div class="section-head">
          <div>
            <p class="eyebrow">Le parcours</p>
            <h2>Quatre modules, un jeu à la fin.</h2>
          </div>
          <p class="section-head-note">
            Chaque chapitre s’appuie sur le précédent. Les quiz valident les concepts, les exercices
            les transforment en réflexes.
          </p>
        </div>
        <div class="module-grid">
          ${MODULES.map(moduleCard).join('')}
        </div>
        <div class="modules-cta">
          <a class="btn btn-secondary" href="/parcours" data-link>Explorer les ${lessons.length} chapitres ${icon('arrow-right')}</a>
        </div>
      </div>
    </section>

    <section class="section method-section">
      <div class="container">
        <div class="section-head">
          <div>
            <p class="eyebrow">La méthode</p>
            <h2>Conçu pour que ça rentre vraiment.</h2>
          </div>
        </div>
        <div class="feature-grid">
          <article class="feature-card">
            <span class="feature-icon">${icon('code')}</span>
            <h3>Du code vérifié, pas du pseudo-code</h3>
            <p>Tous les extraits proviennent du tutoriel officiel et sont alignés sur MonoGame 3.8.6. Le code reste en C#, jamais remplacé par une approximation.</p>
          </article>
          <article class="feature-card">
            <span class="feature-icon">${icon('target')}</span>
            <h3>Des quiz qui testent la compréhension</h3>
            <p>Pas de QCM de surface : chaque réponse est expliquée. Tu sais immédiatement quel concept revoir et pourquoi.</p>
          </article>
          <article class="feature-card">
            <span class="feature-icon">${icon('gamepad')}</span>
            <h3>Des exercices à difficulté variable</h3>
            <p>Un exercice facile pour vérifier, un intermédiaire pour adapter, un défi pour aller plus loin. Solutions disponibles, mais jamais imposées.</p>
          </article>
          <article class="feature-card">
            <span class="feature-icon">${icon('sparkle')}</span>
            <h3>Une progression qui te suit</h3>
            <p>Chapitres terminés, scores de quiz, dernier chapitre lu : tout est mémorisé dans ton navigateur, sans compte ni cookie.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section audience-section">
      <div class="container audience-grid">
        <div class="audience-card">
          <p class="eyebrow">C’est pour toi si…</p>
          <h2>Tu veux comprendre, pas seulement copier.</h2>
          <ul class="check-list">
            <li>${icon('check')} Tu connais les bases de C# (variables, classes, méthodes)</li>
            <li>${icon('check')} Tu n’as jamais créé de jeu, ou jamais avec MonoGame</li>
            <li>${icon('check')} Tu préfères le code à un éditeur visuel</li>
            <li>${icon('check')} Tu veux un projet concret pour apprendre</li>
          </ul>
          <p class="audience-note">Pas encore à l’aise avec C# ? Le <a href="/bases-csharp" data-link>guide express</a> couvre exactement le vocabulaire utilisé ici.</p>
        </div>
        <div class="audience-quote">
          <span class="quote-mark">“</span>
          <blockquote>
            Ce parcours est une adaptation du tutoriel de Christopher Whitley, ingénieur et
            contributeur MonoGame. L’objectif est le même : t’apprendre à construire un jeu
            en comprenant chaque décision.
          </blockquote>
          <p class="quote-source">Christopher Whitley · <em>Building 2D Games with MonoGame</em></p>
          <div class="quote-tags">
            <span>Traduction française</span>
            <span>Code préservé</span>
            <span>3.8.6</span>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container cta-inner">
        <div>
          <p class="eyebrow">Prêt ?</p>
          <h2>Ta première fenêtre MonoGame t’attend.</h2>
          <p>Installe .NET, crée le projet, et affiche ton premier pixel. Le reste suit naturellement.</p>
        </div>
        <div class="cta-actions">
          <a class="btn btn-primary btn-lg" href="/cours/monogame" data-link>Ouvrir le chapitre 01 ${icon('arrow-right')}</a>
          <a class="btn btn-ghost" href="/bases-csharp" data-link>Réviser C# d’abord</a>
        </div>
      </div>
    </section>
  </div>`;
}
