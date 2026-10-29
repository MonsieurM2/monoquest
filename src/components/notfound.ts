import { icon, slimeMark } from '../lib/dom';

export function renderNotFound(): string {
  return `<section class="notfound">
    <div class="container notfound-inner">
      <div class="notfound-slime">${slimeMark(96)}</div>
      <p class="eyebrow">Erreur 404</p>
      <h1>Ce slime s’est perdu dans le donjon.</h1>
      <p>La page que tu cherches n’existe pas — ou pas encore. Retourne au parcours pour retrouver ton chemin.</p>
      <div class="notfound-actions">
        <a class="btn btn-primary" href="/parcours" data-link>Voir le parcours ${icon('arrow-right')}</a>
        <a class="btn btn-ghost" href="/" data-link>Retour à l’accueil</a>
      </div>
    </div>
  </section>`;
}
