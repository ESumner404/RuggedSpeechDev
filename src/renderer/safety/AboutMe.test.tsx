import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AboutMeButton } from './AboutMeButton';
import { aboutMeHeading, aboutMeSections, hasAboutMe } from './aboutMe';
import { AboutMeTab } from '../parent/AboutMeTab';
import { EMPTY_ABOUT_ME, aboutMeSetting, resetDBConnectionForTests, schoolModeSetting } from '../store/db';

describe('about me (pure)', () => {
  it('knows when nothing has been written', () => {
    expect(hasAboutMe(EMPTY_ABOUT_ME)).toBe(false);
    expect(hasAboutMe({ ...EMPTY_ABOUT_ME, likes: '   ' })).toBe(false);
    expect(hasAboutMe({ ...EMPTY_ABOUT_ME, likes: 'trains' })).toBe(true);
  });

  it('lists only the sections that have been filled in, in reading order', () => {
    const sections = aboutMeSections({
      ...EMPTY_ABOUT_ME,
      dislikes: ' loud hand dryers ',
      howIcommunicate: 'I use this app',
    });
    expect(sections).toEqual([
      { title: 'How I communicate', text: 'I use this app' },
      { title: "What I don't like", text: 'loud hand dryers' },
    ]);
  });

  it('heads the page with the preferred name when there is one', () => {
    expect(aboutMeHeading(EMPTY_ABOUT_ME)).toBe('About me');
    expect(aboutMeHeading({ ...EMPTY_ABOUT_ME, preferredName: ' Sam ' })).toBe('About Sam');
  });
});

describe('About me button', () => {
  let container: HTMLElement;

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    container = document.createElement('div');
  });

  afterEach(() => {
    render(null, container);
  });

  it('is not on the child screen until something is written (the screen stays simple)', () => {
    render(<AboutMeButton />, container);
    expect(container.querySelector('.about-me-button')).toBeNull();
  });

  it('appears once something is written, and shows it to anyone, with no PIN', () => {
    aboutMeSetting.signal.value = {
      ...EMPTY_ABOUT_ME,
      preferredName: 'Sam',
      whatHelps: 'A warning before changes',
    };
    render(<AboutMeButton />, container);
    act(() => container.querySelector<HTMLButtonElement>('.about-me-button')!.click());

    expect(container.querySelector('.about-me-overlay__heading')?.textContent).toBe('About Sam');
    expect(container.textContent).toContain('What helps me');
    expect(container.textContent).toContain('A warning before changes');
    expect(container.textContent).not.toContain('What I find hard');

    act(() => container.querySelector<HTMLButtonElement>('.medical-info-overlay__close')!.click());
    expect(container.querySelector('.medical-info-overlay')).toBeNull();
  });

  it('appears in school mode even when empty, and says where to fill it in', () => {
    schoolModeSetting.signal.value = true;
    render(<AboutMeButton />, container);
    act(() => container.querySelector<HTMLButtonElement>('.about-me-button')!.click());
    expect(container.textContent).toContain('Nothing has been written here yet');
    expect(container.textContent).toContain('Parent Mode');
  });
});

describe('About me tab', () => {
  let container: HTMLElement;

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    container = document.createElement('div');
    render(<AboutMeTab />, container);
  });

  afterEach(() => {
    render(null, container);
  });

  it('saves what is typed, and shows it in the printable preview', async () => {
    const [name] = Array.from(container.querySelectorAll<HTMLInputElement>('input.about-tab__input'));
    const helps = container.querySelector<HTMLTextAreaElement>('textarea[placeholder^="For example: a warning"]')!;
    act(() => {
      name!.value = 'Sam';
      name!.dispatchEvent(new Event('input', { bubbles: true }));
    });
    act(() => {
      helps.value = 'Quiet space';
      helps.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await new Promise((resolve) => setTimeout(resolve, 30));

    expect(aboutMeSetting.signal.value).toMatchObject({ preferredName: 'Sam', whatHelps: 'Quiet space' });
    expect(await aboutMeSetting.get()).toMatchObject({ preferredName: 'Sam', whatHelps: 'Quiet space' });
    expect(container.querySelector('.print-page')?.textContent).toContain('About Sam');
    expect(container.querySelector('.print-page')?.textContent).toContain('Quiet space');
  });

  it('only offers to print once there is something to print', () => {
    const print = Array.from(container.querySelectorAll('button')).find((b) => b.textContent?.includes('Print'))!;
    expect(print.disabled).toBe(true);
  });
});
