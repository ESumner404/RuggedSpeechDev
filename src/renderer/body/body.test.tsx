import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MyBodyScreen } from './MyBodyScreen';
import { BodyFigure } from './BodyFigure';
import { DEFAULT_BODY_LOOK, isBodyLook, withDefaults } from './look';
import { BACK_GROUPS, FRONT_GROUPS, PART_LABELS, bodySentence, regionsFor } from './parts';
import { BodyTab } from '../parent/BodyTab';
import { getRecentEntries, myBodySetting, resetDBConnectionForTests, setRecentEnabled } from '../store/db';

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

describe('bodySentence', () => {
  it('names a part, or says how it feels', () => {
    expect(bodySentence(['head'])).toBe('My head.');
    expect(bodySentence(['tummy'], 'hurts')).toBe('My tummy hurts.');
    expect(bodySentence(['tummy'], 'hurts', 'a lot')).toBe('My tummy hurts a lot.');
    expect(bodySentence(['armL'], 'sore', 'a little')).toBe('My arm is sore a little.');
  });

  it('joins several parts and uses the right form of the word', () => {
    expect(bodySentence(['head', 'tummy'], 'hurts')).toBe('My head and my tummy hurt.');
    expect(bodySentence(['head', 'tummy', 'armR'], 'itchy')).toBe('My head, my tummy and my arm are itchy.');
    expect(bodySentence(['eyes'], 'hurts')).toBe('My eyes hurt.'); // already plural
  });

  it('two sides of the same part become one plural part', () => {
    expect(bodySentence(['armL', 'armR'], 'hurts')).toBe('My arms hurt.');
    expect(bodySentence(['footL', 'footR'])).toBe('My feet.');
    expect(bodySentence(['kneeR'], 'hurts')).toBe('My knee hurts.');
  });

  it('the private area is only ever "under my pants"', () => {
    expect(bodySentence(['pants'])).toBe('Under my pants.');
    expect(bodySentence(['pants'], 'hurts', 'a lot')).toBe('It hurts a lot under my pants.');
    expect(bodySentence(['pants'], 'funny')).toBe('It feels funny under my pants.');
    expect(bodySentence(['tummy', 'pants'], 'sore')).toBe('My tummy is sore. It is sore under my pants.');
  });

  it('says nothing for nothing', () => {
    expect(bodySentence([])).toBe('');
    expect(bodySentence([], 'hurts')).toBe('');
  });
});

describe('the figure', () => {
  it('has a part for everything on the list, front and back, seated or standing', () => {
    for (const wheelchair of [false, true]) {
      for (const [view, groups] of [['front', FRONT_GROUPS], ['back', BACK_GROUPS]] as const) {
        const ids = new Set(regionsFor(view, wheelchair).map((r) => r.id));
        for (const group of groups) for (const part of group.parts) expect(ids.has(part), `${view} ${part}`).toBe(true);
      }
    }
  });

  it('only ever uses words a child can be taught for the private area', () => {
    const everything = [...Object.values(PART_LABELS), ...FRONT_GROUPS.map((g) => g.label), ...BACK_GROUPS.map((g) => g.label)].join(' ').toLowerCase();
    for (const word of ['penis', 'vagina', 'genital', 'breast', 'nipple', 'bum', 'private part']) {
      expect(everything).not.toContain(word);
    }
    expect(PART_LABELS.pants).toBe('Under my pants');
  });

  it('a wheelchair is drawn only when asked for', () => {
    const wheels = (look = DEFAULT_BODY_LOOK) => {
      const c = document.createElement('div');
      render(<BodyFigure look={look} view="front" />, c);
      const n = c.querySelectorAll('ellipse[ry="64"]').length;
      render(null, c);
      return n;
    };
    expect(wheels()).toBe(0);
    expect(wheels({ ...DEFAULT_BODY_LOOK, wheelchair: true })).toBe(2);
  });

  it('checks a look before using it', () => {
    expect(isBodyLook(DEFAULT_BODY_LOOK)).toBe(true);
    expect(isBodyLook({ ...DEFAULT_BODY_LOOK, skin: 'brown' })).toBe(false);
    expect(isBodyLook({ ...DEFAULT_BODY_LOOK, hairStyle: 'mohican' })).toBe(false);
    expect(isBodyLook(null)).toBe(false);
  });
});

describe('MyBodyScreen', () => {
  let container: HTMLElement;
  let spoken: string[];

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    spoken = [];
    (window as unknown as { speechSynthesis: unknown }).speechSynthesis = {
      getVoices: () => [],
      cancel: () => {},
      speak: (u: { text: string }) => spoken.push(u.text),
    };
    (globalThis as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = class {
      constructor(public text: string) {}
    };
    container = document.createElement('div');
    render(<MyBodyScreen />, container);
  });

  afterEach(() => {
    render(null, container);
  });

  const part = (label: string) => Array.from(container.querySelectorAll<HTMLButtonElement>('.my-body__part')).find((b) => b.textContent === label)!;
  const feeling = (label: string) => Array.from(container.querySelectorAll<HTMLButtonElement>('.my-body__feeling')).find((b) => b.textContent?.includes(label))!;
  const press = (el: Element) => act(() => void el.dispatchEvent(new MouseEvent('click', { bubbles: true })));
  const sentence = () => container.querySelector('.my-body__sentence')!.textContent;

  it('says nothing until something is pressed, and cannot say an empty sentence', () => {
    expect(spoken).toEqual([]);
    expect(sentence()).toBe('Point to the part of your body.');
    expect((container.querySelector('.my-body__say') as HTMLButtonElement).disabled).toBe(true);
  });

  it('points to a part, says how it feels, and says it', () => {
    press(part('Tummy'));
    expect(spoken).toEqual(['My tummy.']);
    press(feeling('Hurts'));
    press(Array.from(container.querySelectorAll('.my-body__amount')).find((b) => b.textContent === 'a lot')!);
    expect(sentence()).toBe('My tummy hurts a lot.');
    press(container.querySelector('.my-body__say')!);
    expect(spoken[spoken.length - 1]).toBe('My tummy hurts a lot.');
  });

  it('pointing to the picture works the same as the list, and lights the part', () => {
    press(container.querySelector('[data-part="head"]')!);
    expect(container.querySelector('[data-part="head"]')!.classList.contains('body-figure__part--on')).toBe(true);
    expect(part('Head').getAttribute('aria-pressed')).toBe('true');
    press(container.querySelector('[data-part="head"]')!);
    expect(part('Head').getAttribute('aria-pressed')).toBe('false');
  });

  it('turns round to show the back, keeping what was chosen', () => {
    press(part('Head'));
    expect(container.querySelector('[data-part="back"]')).toBeNull();
    press(container.querySelector('.my-body__turn')!);
    expect(container.querySelector('[data-part="back"]')).not.toBeNull();
    expect(part('Head').getAttribute('aria-pressed')).toBe('true');
  });

  it('the private area is spoken as "under my pants" and nothing more', () => {
    press(part('Under my pants'));
    expect(spoken).toEqual(['Under my pants.']);
    press(feeling('Hurts'));
    expect(sentence()).toBe('It hurts under my pants.');
  });

  it('starts again with nothing chosen', () => {
    press(part('Head'));
    press(feeling('Sore'));
    press(container.querySelector('.my-body__again')!);
    expect(sentence()).toBe('Point to the part of your body.');
    expect(container.querySelectorAll('.my-body__part--on')).toHaveLength(0);
  });

  it('is kept like anything else that is said, and not marked out: no special log', async () => {
    await setRecentEnabled(true);
    press(part('Under my pants'));
    press(feeling('Hurts'));
    press(container.querySelector('.my-body__say')!);
    await new Promise((resolve) => setTimeout(resolve, 60));
    const entries = await getRecentEntries();
    expect(entries.map((e) => Object.keys(e).sort())).toEqual(entries.map(() => ['id', 'text', 'timestamp']));
  });
});

describe('BodyTab', () => {
  let container: HTMLElement;

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    container = document.createElement('div');
    render(<BodyTab />, container);
  });

  afterEach(() => {
    render(null, container);
  });

  it('makes the figure look like the child and remembers it', async () => {
    const skin = container.querySelector<HTMLButtonElement>('button[aria-label="Skin #6b4423"]')!;
    act(() => skin.click());
    await waitFor(() => myBodySetting.signal.value.skin === '#6b4423');

    const chair = Array.from(container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'))[0]!;
    act(() => {
      chair.checked = true;
      chair.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(() => myBodySetting.signal.value.wheelchair);
    await waitFor(() => container.querySelectorAll('.body-tab__preview ellipse[ry="64"]').length === 2);

    const long = Array.from(container.querySelectorAll<HTMLButtonElement>('.body-tab__choice')).find((b) => b.textContent === 'Long')!;
    act(() => long.click());
    await waitFor(() => myBodySetting.signal.value.hairStyle === 'long');
    expect(await myBodySetting.get()).toMatchObject({ skin: '#6b4423', wheelchair: true, hairStyle: 'long' });
  });

  it('puts the figure back to how it started', async () => {
    act(() => container.querySelector<HTMLButtonElement>('button[aria-label="Skin #6b4423"]')!.click());
    await waitFor(() => myBodySetting.signal.value.skin === '#6b4423');
    act(() => Array.from(container.querySelectorAll('button')).find((b) => b.textContent?.startsWith('Put the figure back'))!.click());
    await waitFor(() => myBodySetting.signal.value.skin === DEFAULT_BODY_LOOK.skin);
  });
});

describe('figures and equipment', () => {
  const draw = (look: Partial<typeof DEFAULT_BODY_LOOK>, view: 'front' | 'back' = 'front') => {
    const c = document.createElement('div');
    render(<BodyFigure look={withDefaults(look)} view={view} />, c);
    return c;
  };

  it('draws a boy, a girl and a non-binary figure differently, and a dress or skirt over the hips', () => {
    const widths = (['boy', 'girl', 'neutral'] as const).map((figure) => {
      const c = draw({ figure });
      const torso = Array.from(c.querySelectorAll('rect')).find((r) => r.getAttribute('y') === '94' && r.getAttribute('height') === '116')!;
      return Number(torso.getAttribute('width'));
    });
    expect(new Set(widths).size).toBe(3);
    expect(draw({ outfit: 'dress' }).querySelectorAll('path').length).toBeGreaterThan(draw({ outfit: 'trousers' }).querySelectorAll('path').length);
  });

  it('draws the chair with big wheels, spokes, handles and small front wheels', () => {
    const c = draw({ wheelchair: true });
    expect(c.querySelectorAll('ellipse[ry="64"]')).toHaveLength(2);
    expect(c.querySelectorAll('line').length).toBeGreaterThan(10); // spokes, posts and frame
    expect(c.querySelectorAll('circle[r="13"]')).toHaveLength(2); // front wheels
  });

  it('shows equipment only when it is chosen, and lets the child point to it', () => {
    expect(draw({}).querySelector('[data-part="feedtube"]')).toBeNull();
    const c = draw({ extras: ['feedingTube', 'pump', 'hearingAids', 'braces', 'oxygen', 'trach', 'sensor'] });
    for (const part of ['feedtube', 'pump', 'hearing', 'braces', 'oxygen', 'trach', 'sensor']) {
      expect(c.querySelector(`[data-part="${part}"]`), part).not.toBeNull();
    }
    // The tummy tube is on the front only.
    const back = draw({ extras: ['feedingTube', 'pump'] }, 'back');
    expect(back.querySelector('[data-part="feedtube"]')).toBeNull();
    expect(back.querySelector('[data-part="pump"]')).not.toBeNull();
  });

  it('crutches and a frame are for standing: not drawn with a wheelchair', () => {
    expect(draw({ extras: ['crutches'] }).innerHTML).toContain('M34 120 L16 388');
    expect(draw({ extras: ['crutches'], wheelchair: true }).innerHTML).not.toContain('M34 120 L16 388');
  });

  it('says it for equipment too: not working, too tight', () => {
    expect(bodySentence(['pump'], 'notworking')).toBe('My pump is not working.');
    expect(bodySentence(['braces'], 'tight')).toBe('My leg braces are too tight.');
    expect(bodySentence(['feedtube'], 'hurts', 'a lot')).toBe('My tummy tube hurts a lot.');
    expect(bodySentence(['hearing'], 'notworking')).toBe('My hearing aids are not working.');
    expect(bodySentence(['trach', 'oxygen'], 'sore')).toBe('My neck tube and my oxygen tube are sore.');
  });

  it('opens a look saved before figures and equipment existed', () => {
    const old = { skin: '#e0ac69', hair: '#4a2c17', hairStyle: 'short', outfit: 'trousers', top: '#38bdf8', bottom: '#2563eb', wheelchair: true, glasses: false };
    expect(isBodyLook(old)).toBe(true);
    expect(withDefaults(old as never)).toMatchObject({ figure: 'neutral', extras: [], wheelchair: true });
    expect(isBodyLook({ ...old, extras: ['rocket'] })).toBe(false);
  });
});

describe('My body for the child and the adult', () => {
  let container: HTMLElement;

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    (window as unknown as { speechSynthesis: unknown }).speechSynthesis = { getVoices: () => [], cancel: () => {}, speak: () => {} };
    (globalThis as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = class {
      constructor(public text: string) {}
    };
    container = document.createElement('div');
  });

  afterEach(() => {
    render(null, container);
  });

  it('the child finds it in Feelings & Help, with no set-up', async () => {
    const { FeelingsHelpScreen } = await import('../app/FeelingsHelpScreen');
    render(<FeelingsHelpScreen tab="body" onTabChange={() => {}} />, container);
    expect(container.querySelector('.my-body')).not.toBeNull();
    const tabs = Array.from(container.querySelectorAll('.page-tabs__tab')).map((t) => t.textContent);
    expect(tabs).toEqual(['Feelings', 'Help', 'Calm', 'My body']);
  });

  it('shows buttons for the equipment the figure has', async () => {
    await myBodySetting.set(withDefaults({ extras: ['pump', 'braces'] }));
    render(<MyBodyScreen />, container);
    const labels = Array.from(container.querySelectorAll('.my-body__part')).map((b) => b.textContent);
    expect(labels).toContain('Pump');
    expect(labels).toContain('Leg braces');
    expect(labels).not.toContain('Tummy tube');
  });

  it('the adult starts from a boy, a girl or a non-binary figure, and adds equipment', async () => {
    render(<BodyTab />, container);
    const figure = (label: string) => Array.from(container.querySelectorAll<HTMLButtonElement>('[aria-label="Figure"] button')).find((b) => b.textContent === label)!;
    act(() => figure('Girl').click());
    await waitFor(() => myBodySetting.signal.value.figure === 'girl');
    expect(myBodySetting.signal.value).toMatchObject({ hairStyle: 'long', outfit: 'dress' });
    act(() => figure('Non-binary').click());
    await waitFor(() => myBodySetting.signal.value.figure === 'neutral');

    const box = (label: string) => Array.from(container.querySelectorAll<HTMLLabelElement>('label.access-tab__checkbox')).find((l) => l.textContent!.startsWith(label))!.querySelector('input')!;
    act(() => {
      box('Insulin pump').checked = true;
      box('Insulin pump').dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(() => myBodySetting.signal.value.extras.includes('pump'));
    act(() => {
      box('Uses a wheelchair').checked = true;
      box('Uses a wheelchair').dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(() => myBodySetting.signal.value.wheelchair);
    await waitFor(() => box('Crutches').disabled); // crutches are for standing
  });
});
