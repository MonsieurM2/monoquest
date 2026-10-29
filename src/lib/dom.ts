export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function qs<T extends Element = Element>(selector: string, root: ParentNode = document): T | null {
  return root.querySelector<T>(selector);
}

export function qsa<T extends Element = Element>(selector: string, root: ParentNode = document): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

export function cx(...values: (string | false | null | undefined)[]): string {
  return values.filter(Boolean).join(' ');
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest}`;
}

type IconName =
  | 'arrow-right'
  | 'arrow-left'
  | 'check'
  | 'clock'
  | 'book'
  | 'search'
  | 'menu'
  | 'close'
  | 'copy'
  | 'chevron-down'
  | 'info'
  | 'lightbulb'
  | 'alert'
  | 'key'
  | 'gamepad'
  | 'sparkle'
  | 'external'
  | 'target'
  | 'code'
  | 'play'
  | 'list'
  | 'github'
  | 'reset';

const paths: Record<IconName, string> = {
  'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
  'arrow-left': '<path d="M19 12H5M11 18l-6-6 6-6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13Z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  lightbulb: '<path d="M9 18h6M10 22h4M8.5 14.5a6 6 0 1 1 7 0c-.9.7-1.5 1.7-1.5 2.5h-4c0-.8-.6-1.8-1.5-2.5Z"/>',
  alert: '<path d="M12 3 2.7 20h18.6L12 3Z"/><path d="M12 9v5M12 17h.01"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3"/>',
  gamepad: '<path d="M7 8h10a5 5 0 0 1 4.9 6l-.7 3.2a2.5 2.5 0 0 1-4.4 1.1L15 16H9l-1.8 2.3a2.5 2.5 0 0 1-4.4-1.1L2.1 14A5 5 0 0 1 7 8Z"/><path d="M7 11v3M5.5 12.5h3M16 12h.01M18 14h.01"/>',
  sparkle: '<path d="m12 3 2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2L12 3Z"/>',
  external: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  code: '<path d="m8 9-4 3 4 3M16 9l4 3-4 3M13 5l-2 14"/>',
  play: '<path d="m9 7 8 5-8 5V7Z"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.9A5.4 5.4 0 0 0 19.8 5a5 5 0 0 0-.1-3.7s-1.2-.3-3.9 1.5a13.4 13.4 0 0 0-7 0C6 .5 4.8.8 4.8.8A5 5 0 0 0 4.7 4.5 5.4 5.4 0 0 0 3.2 8.3c0 5.4 3.2 6.6 6.2 6.9a3.4 3.4 0 0 0-.9 2.6V22"/>',
  reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
};

export function icon(name: IconName, className = 'icon'): string {
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
}

export function slimeMark(size = 34): string {
  return `<svg class="slime-mark" width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true">
    <path d="M14 50V35c0-11 7-19 18-19s18 8 18 19v15c0 2-1.5 3-3.5 3h-29C15.5 53 14 52 14 50Z" fill="currentColor"/>
    <path d="M14 45h36v5c0 2-1.5 3-3.5 3h-29C15.5 53 14 52 14 50v-5Z" fill="#000" opacity=".14"/>
    <rect x="23" y="33" width="6" height="9" rx="2.5" fill="#0c0f14"/>
    <rect x="35" y="33" width="6" height="9" rx="2.5" fill="#0c0f14"/>
    <rect x="24.5" y="34.5" width="2" height="3" rx="1" fill="#eaffd2"/>
    <rect x="36.5" y="34.5" width="2" height="3" rx="1" fill="#eaffd2"/>
    <path d="M29 47c1.8 1.6 4.2 1.6 6 0" stroke="#0c0f14" stroke-width="2" stroke-linecap="round" fill="none"/>
  </svg>`;
}
