// GitHub Pages sert le site sous /<nom-du-depot>/ : toutes les URLs internes
// doivent donc être préfixées par la base fournie par Vite.
const RAW_BASE = import.meta.env.BASE_URL || '/';
export const BASE = RAW_BASE === '/' ? '' : RAW_BASE.replace(/\/$/, '');

export function stripBase(pathname: string): string {
  if (!BASE) return pathname;
  if (pathname === BASE) return '/';
  if (pathname.startsWith(`${BASE}/`)) return pathname.slice(BASE.length);
  return pathname;
}

export function withBase(path: string): string {
  if (!BASE || !path.startsWith('/') || path.startsWith('//')) return path;
  if (path === BASE || path.startsWith(`${BASE}/`)) return path;
  return `${BASE}${path}`;
}

export type Route =
  | { name: 'home' }
  | { name: 'course' }
  | { name: 'lesson'; slug: string }
  | { name: 'csharp' }
  | { name: 'exam' }
  | { name: 'resources' }
  | { name: 'notfound'; path: string };

export function parseRoute(pathname = window.location.pathname): Route {
  const path = stripBase(pathname).replace(/\/+$/, '') || '/';

  if (path === '/') return { name: 'home' };
  if (path === '/parcours') return { name: 'course' };
  if (path === '/bases-csharp') return { name: 'csharp' };
  if (path === '/quiz-final') return { name: 'exam' };
  if (path === '/ressources') return { name: 'resources' };

  const lesson = path.match(/^\/cours\/([a-z0-9-]+)$/);
  if (lesson?.[1]) return { name: 'lesson', slug: lesson[1] };

  return { name: 'notfound', path };
}

export function navigate(to: string, options: { replace?: boolean } = {}): void {
  const url = new URL(withBase(to), window.location.origin);
  if (url.href === window.location.href) return;

  if (options.replace) window.history.replaceState({}, '', url);
  else window.history.pushState({}, '', url);

  window.dispatchEvent(new CustomEvent('route:change'));
}

export function initLinks(): void {
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const target = event.target as Element | null;
    const anchor = target?.closest<HTMLAnchorElement>('a[href]');
    if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;

    const href = anchor.getAttribute('href');
    if (!href || !href.startsWith('/') || href.startsWith('//')) return;

    event.preventDefault();

    const url = new URL(href, window.location.origin);
    if (url.pathname === window.location.pathname && url.hash) {
      document.querySelector(url.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    navigate(url.pathname + url.search + url.hash);
  });
}

export function currentPath(): string {
  return stripBase(window.location.pathname).replace(/\/+$/, '') || '/';
}

// Réécrit les liens et images écrits en absolu (/parcours, /images/...) pour
// qu'ils pointent vers la bonne base. Sans effet en développement (base « / »).
export function fixInternalUrls(root: ParentNode): void {
  if (!BASE) return;

  root.querySelectorAll<HTMLAnchorElement>('a[href^="/"]').forEach((anchor) => {
    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('//')) return;
    anchor.setAttribute('href', withBase(href));
  });

  root.querySelectorAll<HTMLImageElement>('img[src^="/"]').forEach((image) => {
    const src = image.getAttribute('src');
    if (!src || src.startsWith('//')) return;
    image.setAttribute('src', withBase(src));
  });
}
