import { useSignal } from '@preact/signals';
import parentsGuide from '../../../docs/getting-started-parents.md?raw';
import staffGuide from '../../../docs/getting-started-staff.md?raw';
import fullGuide from '../../../docs/user-guide.md?raw';
import { Markdown, parseMarkdown, slug, type Block } from './markdown';

// Every picture in docs/images, by file name, bundled into the app so the
// guide shows them with no internet.
const IMAGES = import.meta.glob('../../../docs/images/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const IMAGE_BY_FILE: Record<string, string> = Object.fromEntries(
  Object.entries(IMAGES).map(([path, url]) => [path.split('/').pop() ?? path, url]),
);

type GuideId = 'parents' | 'staff' | 'full';

const GUIDES: { id: GuideId; label: string; source: string }[] = [
  { id: 'parents', label: 'Start here: parents and carers', source: parentsGuide },
  { id: 'staff', label: 'Start here: teachers and staff', source: staffGuide },
  { id: 'full', label: 'The whole guide', source: fullGuide },
];

const parsed: Record<GuideId, Block[]> = {
  parents: parseMarkdown(parentsGuide),
  staff: parseMarkdown(staffGuide),
  full: parseMarkdown(fullGuide),
};

/** The headings of one guide, in order, to jump to. */
export function outline(blocks: Block[]): { id: string; text: string; level: number }[] {
  return blocks
    .filter((b): b is Extract<Block, { kind: 'heading' }> => b.kind === 'heading' && b.level === 2)
    .map((b) => ({ id: b.id, text: b.text.replace(/[`*_]/g, ''), level: b.level }));
}

/** The parts of a guide that mention what was searched for, each with its heading, or the whole guide for no search. */
export function filterBlocks(blocks: Block[], query: string): Block[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return blocks;
  const sections: Block[][] = [];
  for (const block of blocks) {
    if (block.kind === 'heading' && block.level <= 2) sections.push([block]);
    else if (sections.length > 0) sections[sections.length - 1]!.push(block);
    else sections.push([block]);
  }
  const text = (section: Block[]) =>
    section
      .map((b) => (b.kind === 'list' ? b.items.join(' ') : b.kind === 'table' ? [...b.header, ...b.rows.flat()].join(' ') : 'text' in b ? b.text : ''))
      .join(' ')
      .toLowerCase();
  return sections.filter((section) => words.every((word) => text(section).includes(word))).flat();
}

// The guide, inside Parent Mode, so the answer is where the question is. It
// is the same text as the guide that comes with the app, so the two can never
// disagree, and every picture is inside the app, so it works with no internet.
export function GuideTab({ start = 'parents' }: { start?: GuideId } = {}) {
  const which = useSignal<GuideId>(start);
  const search = useSignal('');
  const blocks = filterBlocks(parsed[which.value], search.value);
  const headings = outline(parsed[which.value]);

  function jump(id: string): void {
    document.getElementById(`guide-${id}`)?.scrollIntoView?.({ block: 'start' });
  }

  function follow(target: string): void {
    if (target.startsWith('#')) {
      jump(slug(target.slice(1)));
      return;
    }
    const file = target.split('#')[0]!.split('/').pop() ?? '';
    const next = file.includes('parents') ? 'parents' : file.includes('staff') ? 'staff' : file.includes('user-guide') ? 'full' : null;
    if (next) {
      search.value = '';
      which.value = next;
      const anchor = target.split('#')[1];
      if (anchor) setTimeout(() => jump(slug(anchor)), 0);
    }
  }

  return (
    <div class="parent-mode-screen__body guide">
      <div class="guide__top">
        <div class="activity-tab__what" role="group" aria-label="Which guide">
          {GUIDES.map((guide) => (
            <button
              type="button"
              key={guide.id}
              class={`activity-tab__chip${which.value === guide.id ? ' activity-tab__chip--on' : ''}`}
              aria-pressed={which.value === guide.id}
              onClick={() => {
                which.value = guide.id;
                search.value = '';
              }}
            >
              {guide.label}
            </button>
          ))}
        </div>
        <label class="guide__search">
          Search the guide
          <input
            type="search"
            autocomplete="off"
            placeholder="for example: backup, wheelchair, PIN"
            value={search.value}
            onInput={(event) => (search.value = (event.target as HTMLInputElement).value)}
          />
        </label>
      </div>

      <div class="guide__layout">
        <nav class="guide__outline" aria-label="In this guide">
          <p class="guide__outline-title">In this guide</p>
          <ul>
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    search.value = '';
                    setTimeout(() => jump(heading.id), 0);
                  }}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div class="guide__content">
          {blocks.length === 0 ? (
            <p class="guide__none">Nothing in this guide matches “{search.value}”. Try another word, or look in the whole guide.</p>
          ) : (
            <Markdown blocks={blocks} images={IMAGE_BY_FILE} onLink={follow} />
          )}
        </div>
      </div>
    </div>
  );
}
