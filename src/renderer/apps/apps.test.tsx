import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppsScreen } from './AppsScreen';
import { AppsTab } from './AppsTab';
import { appFromForm, isAppList } from './apps';
import { appsSetting, resetDBConnectionForTests } from '../store/db';

const waitFor = async (check: () => boolean) => {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > 2000) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
};

describe('apps', () => {
  let open: ReturnType<typeof vi.fn>;
  let container: HTMLElement;

  beforeEach(async () => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    open = vi.fn(async () => true);
    (window as unknown as { myWords: unknown }).myWords = { apps: { open } };
    await appsSetting.set([]);
    container = document.createElement('div');
  });

  it('only a link to an app is a valid entry', () => {
    expect(isAppList([{ id: 'a', name: 'Photos', emoji: '🖼️', link: 'photos-redirect://' }])).toBe(true);
    expect(isAppList([{ id: 'a', name: 'Web', emoji: '🌐', link: 'https://example.com' }])).toBe(false);
    expect(isAppList(new Array(25).fill({ id: 'a', name: 'x', emoji: 'x', link: 'tel:' }))).toBe(false);
  });

  it('says why a web address cannot be added', () => {
    const made = appFromForm('Browser', '', 'https://example.com');
    expect('problem' in made && made.problem).toContain('web address');
    const odd = appFromForm('Thing', '', 'not a link');
    expect('problem' in odd && odd.problem).toContain('not a link that opens an app');
  });

  it('an adult adds an app, and it shows as a tile that opens it when pressed', async () => {
    render(<AppsTab />, container);
    const inputs = container.querySelectorAll<HTMLInputElement>('.apps-tab__form input');
    act(() => {
      inputs[0]!.value = 'Calls';
      inputs[0]!.dispatchEvent(new Event('input', { bubbles: true }));
      inputs[2]!.value = 'tel:';
      inputs[2]!.dispatchEvent(new Event('input', { bubbles: true }));
    });
    act(() => {
      container.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    });
    await waitFor(() => appsSetting.signal.value.length === 1);
    expect(appsSetting.signal.value[0]).toMatchObject({ name: 'Calls', link: 'tel:', emoji: '📲' });

    const screen = document.createElement('div');
    render(<AppsScreen />, screen);
    expect(screen.textContent).toContain('Calls');
    act(() => screen.querySelector<HTMLButtonElement>('.apps-screen__tile')!.click());
    await waitFor(() => open.mock.calls.length === 1);
    expect(open).toHaveBeenCalledWith('tel:');
  });

  it('refuses a web address in the form and adds nothing', async () => {
    render(<AppsTab />, container);
    const inputs = container.querySelectorAll<HTMLInputElement>('.apps-tab__form input');
    act(() => {
      inputs[2]!.value = 'https://example.com';
      inputs[2]!.dispatchEvent(new Event('input', { bubbles: true }));
    });
    act(() => {
      container.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    });
    await waitFor(() => (container.querySelector('[role="status"]')?.textContent ?? '').includes('web address'));
    expect(appsSetting.signal.value).toEqual([]);
  });

  it('says so when an app does not open', async () => {
    open.mockResolvedValue(false);
    await appsSetting.set([{ id: 'a', name: 'Gone', emoji: '❓', link: 'gone://' }]);
    render(<AppsScreen />, container);
    act(() => container.querySelector<HTMLButtonElement>('.apps-screen__tile')!.click());
    await waitFor(() => (container.querySelector('[role="status"]')?.textContent ?? '').includes('did not open'));
  });
});
