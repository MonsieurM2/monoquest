import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import csharp from 'highlight.js/lib/languages/csharp';
import glsl from 'highlight.js/lib/languages/glsl';
import xml from 'highlight.js/lib/languages/xml';
import type { Block, Tone } from '../data/types';
import { escapeHtml, icon, slugify } from '../lib/dom';

hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('glsl', glsl);

const languageLabels: Record<string, string> = {
  csharp: 'C#',
  bash: 'Terminal',
  xml: 'XML',
  glsl: 'HLSL',
  text: 'Texte',
};

export function highlightCode(source: string, language = 'csharp'): string {
  if (hljs.getLanguage(language)) {
    return hljs.highlight(source, { language, ignoreIllegals: true }).value;
  }
  return escapeHtml(source);
}

export function renderCode(options: {
  code: string;
  lang?: string;
  title?: string;
  compact?: boolean;
}): string {
  const lang = options.lang ?? 'csharp';
  const label = languageLabels[lang] ?? lang;
  return `<div class="code-block${options.compact ? ' is-compact' : ''}">
    <div class="code-head">
      <span class="code-lang">${escapeHtml(label)}</span>
      ${options.title ? `<span class="code-title">${escapeHtml(options.title)}</span>` : ''}
      <button class="copy-button" type="button" data-copy aria-label="Copier le code">
        ${icon('copy')}<span>Copier</span>
      </button>
    </div>
    <pre><code class="hljs language-${lang}">${highlightCode(options.code, lang)}</code></pre>
  </div>`;
}

const calloutIcons: Record<Tone, 'info' | 'lightbulb' | 'alert' | 'key'> = {
  info: 'info',
  tip: 'lightbulb',
  warn: 'alert',
  key: 'key',
};

const calloutLabels: Record<Tone, string> = {
  info: 'À savoir',
  tip: 'Astuce',
  warn: 'Attention',
  key: 'À retenir',
};

export interface TocEntry {
  id: string;
  text: string;
}

export function renderBlocks(blocks: Block[]): { html: string; toc: TocEntry[] } {
  const toc: TocEntry[] = [];
  const usedIds = new Set<string>();

  const html = blocks
    .map((block) => {
      switch (block.t) {
        case 'p':
          return `<p>${block.html}</p>`;

        case 'h2': {
          let id = slugify(block.text);
          let suffix = 2;
          while (usedIds.has(id)) {
            id = `${slugify(block.text)}-${suffix++}`;
          }
          usedIds.add(id);
          toc.push({ id, text: block.text });
          return `<h2 id="${id}">${escapeHtml(block.text)}<a class="heading-anchor" href="#${id}" aria-label="Lien direct vers cette section">#</a></h2>`;
        }

        case 'h3':
          return `<h3>${escapeHtml(block.text)}</h3>`;

        case 'code':
          return renderCode({ code: block.code, lang: block.lang, title: block.title });

        case 'callout':
          return `<aside class="callout callout-${block.tone}">
            <span class="callout-icon">${icon(calloutIcons[block.tone])}</span>
            <div class="callout-body">
              <p class="callout-label">${block.title ?? calloutLabels[block.tone]}</p>
              <div class="callout-text">${block.html}</div>
            </div>
          </aside>`;

        case 'list': {
          const tag = block.ordered ? 'ol' : 'ul';
          return `<${tag} class="prose-list${block.ordered ? ' is-ordered' : ''}">${block.items
            .map((item) => `<li>${item}</li>`)
            .join('')}</${tag}>`;
        }

        case 'steps':
          return `<ol class="prose-steps">${block.items
            .map(
              (item, index) => `<li>
                <span class="step-number">${String(index + 1).padStart(2, '0')}</span>
                <div><p class="step-title">${item.title}</p><p>${item.html}</p></div>
              </li>`,
            )
            .join('')}</ol>`;

        case 'table':
          return `<div class="table-wrap"><table class="prose-table">
            <thead><tr>${block.head.map((cell) => `<th>${cell}</th>`).join('')}</tr></thead>
            <tbody>${block.rows
              .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
              .join('')}</tbody>
          </table></div>`;

        case 'image':
          return `<figure class="prose-figure${block.wide ? ' is-wide' : ''}${block.light ? ' is-light' : ''}">
            <img src="${block.src}" alt="${escapeHtml(block.alt)}" loading="lazy" />
            ${block.caption ? `<figcaption>${block.caption}</figcaption>` : ''}
          </figure>`;

        case 'gallery':
          return `<div class="prose-gallery">${block.items
            .map(
              (item) => `<figure class="prose-figure">
                <img src="${item.src}" alt="${escapeHtml(item.alt)}" loading="lazy" />
                ${item.caption ? `<figcaption>${item.caption}</figcaption>` : ''}
              </figure>`,
            )
            .join('')}</div>`;

        case 'quote':
          return `<blockquote class="prose-quote"><p>${block.html}</p>${
            block.author ? `<cite>${escapeHtml(block.author)}</cite>` : ''
          }</blockquote>`;

        default:
          return '';
      }
    })
    .join('\n');

  return { html, toc };
}
