import type { ComponentChild } from 'preact';

// A small Markdown reader for the guide that comes with the app. It builds
// the page from elements, never from HTML text, so nothing in a guide file
// can run as script. Links to the internet are shown as plain words with the
// address, because the app never goes online; links to a part of the guide
// move to it.

export type Block =
  | { kind: 'heading'; level: 1 | 2 | 3; text: string; id: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; ordered: boolean; items: string[] }
  | { kind: 'quote'; text: string }
  | { kind: 'table'; header: string[]; rows: string[][] }
  | { kind: 'image'; alt: string; src: string }
  | { kind: 'code'; text: string };

export function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[`*_]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const splitRow = (line: string): string[] =>
  line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());

export function parseMarkdown(source: string): Block[] {
  const lines = source.replace(/\r\n/g, '\n').replace(/<!--[\s\S]*?-->/g, '').split('\n');
  const blocks: Block[] = [];
  let i = 0;
  const seen = new Map<string, number>();
  const uniqueId = (text: string) => {
    const base = slug(text) || 'section';
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  };

  while (i < lines.length) {
    const line = lines[i]!;
    if (line.trim() === '' || /^\s*(---|\*\*\*)\s*$/.test(line)) {
      i += 1;
      continue;
    }
    if (line.startsWith('```')) {
      const body: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i]!.startsWith('```')) body.push(lines[i++]!);
      i += 1;
      blocks.push({ kind: 'code', text: body.join('\n') });
      continue;
    }
    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) {
      const text = heading[2]!.trim();
      blocks.push({ kind: 'heading', level: heading[1]!.length as 1 | 2 | 3, text, id: uniqueId(text) });
      i += 1;
      continue;
    }
    const image = /^!\[([^\]]*)\]\(([^)]+)\)\s*$/.exec(line.trim());
    if (image) {
      blocks.push({ kind: 'image', alt: image[1]!, src: image[2]! });
      i += 1;
      continue;
    }
    if (line.trim().startsWith('|') && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1] ?? '')) {
      const header = splitRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i]!.trim().startsWith('|')) rows.push(splitRow(lines[i++]!));
      blocks.push({ kind: 'table', header, rows });
      continue;
    }
    if (line.startsWith('>')) {
      const body: string[] = [];
      while (i < lines.length && lines[i]!.startsWith('>')) body.push(lines[i++]!.replace(/^>\s?/, ''));
      blocks.push({ kind: 'quote', text: body.join(' ') });
      continue;
    }
    const listMatch = /^\s*([-*]|\d+\.)\s+(.*)$/.exec(line);
    if (listMatch) {
      const ordered = /\d+\./.test(listMatch[1]!);
      const items: string[] = [];
      while (i < lines.length) {
        const m = /^\s*([-*]|\d+\.)\s+(.*)$/.exec(lines[i]!);
        if (m) {
          items.push(m[2]!);
          i += 1;
        } else if (/^\s{2,}\S/.test(lines[i]!) && items.length > 0) {
          items[items.length - 1] += ` ${lines[i]!.trim()}`;
          i += 1;
        } else break;
      }
      blocks.push({ kind: 'list', ordered, items });
      continue;
    }
    const paragraph: string[] = [];
    while (
      i < lines.length &&
      lines[i]!.trim() !== '' &&
      !/^(#{1,3}\s|>|```|\s*([-*]|\d+\.)\s|\|)/.test(lines[i]!) &&
      !/^!\[/.test(lines[i]!.trim())
    ) {
      paragraph.push(lines[i++]!.trim());
    }
    if (paragraph.length === 0) {
      i += 1;
      continue;
    }
    blocks.push({ kind: 'paragraph', text: paragraph.join(' ') });
  }
  return blocks;
}

const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*\s][^*]*\*)/g;

/** Where a link in the guide goes: to a part of the guide, to another guide, or nowhere (an address is only shown). */
export type LinkHandler = (target: string) => void;

export function renderInline(text: string, onLink?: LinkHandler): ComponentChild[] {
  const out: ComponentChild[] = [];
  let last = 0;
  let key = 0;
  for (const match of text.matchAll(INLINE)) {
    const index = match.index ?? 0;
    if (index > last) out.push(text.slice(last, index));
    const token = match[0];
    if (token.startsWith('**')) out.push(<strong key={key++}>{renderInline(token.slice(2, -2), onLink)}</strong>);
    else if (token.startsWith('`')) out.push(<code key={key++}>{token.slice(1, -1)}</code>);
    else if (token.startsWith('[')) {
      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token)!;
      const label = link[1]!;
      const target = link[2]!;
      if (/^[a-z][a-z0-9+.-]*:/i.test(target)) {
        // An address on the internet: shown, never opened.
        out.push(
          <span key={key++}>
            {label} <span class="guide__address">({target.replace(/^mailto:/, '')})</span>
          </span>,
        );
      } else {
        out.push(
          <a
            key={key++}
            href={target}
            onClick={(event) => {
              event.preventDefault();
              onLink?.(target);
            }}
          >
            {label}
          </a>,
        );
      }
    } else out.push(<em key={key++}>{token.slice(1, -1)}</em>);
    last = index + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({
  blocks,
  images,
  onLink,
}: {
  blocks: Block[];
  images: Record<string, string>;
  onLink?: LinkHandler;
}) {
  return (
    <div class="guide__page">
      {blocks.map((block, index) => {
        switch (block.kind) {
          case 'heading': {
            const Tag = (`h${block.level}`) as 'h1' | 'h2' | 'h3';
            return (
              <Tag key={index} id={`guide-${block.id}`} class={`guide__h${block.level}`}>
                {renderInline(block.text, onLink)}
              </Tag>
            );
          }
          case 'paragraph':
            return <p key={index}>{renderInline(block.text, onLink)}</p>;
          case 'list': {
            const items = block.items.map((item, i) => <li key={i}>{renderInline(item, onLink)}</li>);
            return block.ordered ? <ol key={index}>{items}</ol> : <ul key={index}>{items}</ul>;
          }
          case 'quote':
            return (
              <blockquote key={index} class="guide__quote">
                {renderInline(block.text, onLink)}
              </blockquote>
            );
          case 'table':
            return (
              <table key={index} class="guide__table">
                <thead>
                  <tr>
                    {block.header.map((cell, i) => (
                      <th key={i}>{renderInline(cell, onLink)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, r) => (
                    <tr key={r}>
                      {row.map((cell, c) => (
                        <td key={c}>{renderInline(cell, onLink)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          case 'image': {
            const file = block.src.split('/').pop() ?? '';
            const url = images[file];
            return url ? (
              <figure key={index} class="guide__figure">
                <img src={url} alt={block.alt} loading="lazy" />
                {block.alt && <figcaption>{block.alt}</figcaption>}
              </figure>
            ) : null;
          }
          case 'code':
            return (
              <pre key={index} class="guide__code">
                {block.text}
              </pre>
            );
        }
      })}
    </div>
  );
}
