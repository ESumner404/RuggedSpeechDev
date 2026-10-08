import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { GuideTab, filterBlocks, outline } from './GuideTab';
import { Markdown, parseMarkdown, renderInline, slug } from './markdown';

describe('parseMarkdown', () => {
  it('reads headings with their own ids, and tells two of the same name apart', () => {
    const blocks = parseMarkdown('# Title\n\n## Setting up\n\n## Setting up\n');
    expect(blocks).toEqual([
      { kind: 'heading', level: 1, text: 'Title', id: 'title' },
      { kind: 'heading', level: 2, text: 'Setting up', id: 'setting-up' },
      { kind: 'heading', level: 2, text: 'Setting up', id: 'setting-up-1' },
    ]);
    expect(slug('What it **does**!')).toBe('what-it-does');
  });

  it('reads paragraphs across lines, lists, quotes and code', () => {
    const blocks = parseMarkdown('One line\ncontinues here.\n\n- first\n- second\n  more of second\n\n1. one\n2. two\n\n> a note\n\n```\ncode here\n```\n');
    expect(blocks).toEqual([
      { kind: 'paragraph', text: 'One line continues here.' },
      { kind: 'list', ordered: false, items: ['first', 'second more of second'] },
      { kind: 'list', ordered: true, items: ['one', 'two'] },
      { kind: 'quote', text: 'a note' },
      { kind: 'code', text: 'code here' },
    ]);
  });

  it('reads a table and an image on its own line, and drops comments and rules', () => {
    const blocks = parseMarkdown('<!-- not shown -->\n\n| A | B |\n| --- | --- |\n| 1 | 2 |\n\n---\n\n![The Talk page](images/talk.png)\n');
    expect(blocks).toEqual([
      { kind: 'table', header: ['A', 'B'], rows: [['1', '2']] },
      { kind: 'image', alt: 'The Talk page', src: 'images/talk.png' },
    ]);
  });
});

describe('renderInline', () => {
  const html = (text: string) => {
    const c = document.createElement('div');
    render(<p>{renderInline(text)}</p>, c);
    return c.innerHTML;
  };

  it('makes bold, italic and code, and nothing else', () => {
    expect(html('a **b** *c* `d`')).toBe('<p>a <strong>b</strong> <em>c</em> <code>d</code></p>');
  });

  it('never turns text into markup: a tag in the guide is just words', () => {
    expect(html('<img src=x onerror=alert(1)> and <script>bad()</script>')).toBe(
      '<p>&lt;img src=x onerror=alert(1)&gt; and &lt;script&gt;bad()&lt;/script&gt;</p>',
    );
  });

  it('shows an address on the internet as words, never as something to open', () => {
    const out = html('see [the site](https://example.com/x) now');
    expect(out).not.toContain('<a');
    expect(out).toContain('the site');
    expect(out).toContain('(https://example.com/x)');
  });

  it('links to a part of the guide, and tells the guide where to go', () => {
    const went: string[] = [];
    const c = document.createElement('div');
    render(<p>{renderInline('[Back up](#backup)', (target) => went.push(target))}</p>, c);
    act(() => c.querySelector('a')!.click());
    expect(went).toEqual(['#backup']);
  });
});

describe('Markdown', () => {
  it('shows a picture it has, and nothing for one it has not', () => {
    const c = document.createElement('div');
    render(<Markdown blocks={parseMarkdown('![Talk](images/a.png)\n\n![Missing](images/b.png)')} images={{ 'a.png': 'data:image/png;base64,AAAA' }} />, c);
    expect(c.querySelectorAll('img')).toHaveLength(1);
    expect(c.querySelector('figcaption')!.textContent).toBe('Talk');
  });
});

describe('searching a guide', () => {
  const blocks = parseMarkdown('# Guide\n\nIntro.\n\n## Backup\n\nSave a file.\n\n## Wheelchair\n\nDraw a chair on My body.\n');

  it('lists the parts of a guide to jump to', () => {
    expect(outline(blocks).map((h) => h.text)).toEqual(['Backup', 'Wheelchair']);
  });

  it('shows everything for no search, and only the sections that match for a search', () => {
    expect(filterBlocks(blocks, '')).toEqual(blocks);
    const found = filterBlocks(blocks, 'wheelchair');
    expect(found.map((b) => ('text' in b ? b.text : ''))).toEqual(['Wheelchair', 'Draw a chair on My body.']);
    expect(filterBlocks(blocks, 'save file').map((b) => ('text' in b ? b.text : ''))).toEqual(['Backup', 'Save a file.']);
    expect(filterBlocks(blocks, 'zebra')).toEqual([]);
  });
});

describe('GuideTab', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    render(<GuideTab />, container);
  });

  afterEach(() => {
    render(null, container);
  });

  it('opens on the guide for parents, with the other two a press away', () => {
    const chips = Array.from(container.querySelectorAll('.activity-tab__chip')).map((c) => c.textContent);
    expect(chips).toEqual(['Start here: parents and carers', 'Start here: teachers and staff', 'The whole guide']);
    expect(container.querySelector('.activity-tab__chip--on')!.textContent).toBe('Start here: parents and carers');
    expect(container.querySelector('.guide__page')).not.toBeNull();
  });

  it('switches guide, and says so plainly when a search finds nothing', () => {
    act(() => Array.from(container.querySelectorAll<HTMLButtonElement>('.activity-tab__chip')).find((c) => c.textContent === 'The whole guide')!.click());
    expect(container.querySelector('.activity-tab__chip--on')!.textContent).toBe('The whole guide');
    const input = container.querySelector<HTMLInputElement>('input[type="search"]')!;
    act(() => {
      input.value = 'qqqqzzzz';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(container.querySelector('.guide__none')!.textContent).toContain('Nothing in this guide matches');
  });
});
