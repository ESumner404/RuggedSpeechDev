import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ParentModeScreen } from './ParentModeScreen';
import {
  ensureSeeded,
  lastBackupSetting,
  parentModeTimeoutSetting,
  resetDBConnectionForTests,
  savePerson,
  schoolModeSetting,
} from '../store/db';

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

describe('ParentModeScreen shell', () => {
  let container: HTMLElement;
  let onExit: ReturnType<typeof vi.fn<() => void>>;

  beforeEach(async () => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    (window as unknown as { myWords: unknown }).myWords = {
      parentMode: { setFullscreen: async () => {}, isFullscreen: async () => false },
    };
    await ensureSeeded();
    onExit = vi.fn<() => void>();
    container = document.createElement('div');
  });

  afterEach(() => {
    render(null, container);
    vi.useRealTimers();
  });

  const tabLabels = () => Array.from(container.querySelectorAll('.page-tabs__tab')).map((el) => el.textContent);

  it('has a tab for every area, in a fixed order', async () => {
    render(<ParentModeScreen onExit={onExit} />, container);
    expect(tabLabels()).toEqual([
      'User guide',
      'User',
      'About me',
      'Medical',
      'My body',
      'Boards',
      'People',
      'Places',
      'My Pages',
      'Quick Access',
      'Profiles',
      'My Day',
      'Music',
      'Jokes',
      'Seasons',
      'Access',
      'Look',
      'Learning',
      'Targets',
      'Notes',
      'Activity',
      'Reports',
      'School',
      'Lost mode',
      'Backup',
      'Print',
      'General',
    ]);
  });

  describe('name', () => {
    it('is Parent Mode at home', () => {
      render(<ParentModeScreen onExit={onExit} />, container);
      expect(container.querySelector('.parent-mode-screen__title')?.textContent).toBe('Parent Mode');
      expect(container.querySelector('.parent-mode-screen__exit')?.textContent).toBe('Exit Parent Mode');
    });

    it('stays Parent Mode when School Mode is on: School Mode is a separate place', () => {
      schoolModeSetting.signal.value = true;
      render(<ParentModeScreen onExit={onExit} />, container);
      expect(container.querySelector('.parent-mode-screen__title')?.textContent).toBe('Parent Mode');
    });
  });

  describe('backup reminder', () => {
    const notice = () => container.querySelector('.parent-mode-screen__notice');

    it('stays quiet on a fresh install, when there is nothing to lose', async () => {
      render(<ParentModeScreen onExit={onExit} />, container);
      await new Promise((resolve) => setTimeout(resolve, 80));
      expect(notice()).toBeNull();
    });

    it('appears once there is something worth protecting and no recent backup, and goes to Backup', async () => {
      await savePerson({ id: 'mum', name: 'Mum', phrases: [] });
      render(<ParentModeScreen onExit={onExit} />, container);
      await waitFor(() => notice() !== null);

      act(() => notice()!.querySelector<HTMLButtonElement>('button')!.click());
      expect(container.querySelector('.backup-tab')).not.toBeNull();
    });

    it('does not appear after a recent backup, but does once it is over a month old', async () => {
      await savePerson({ id: 'mum', name: 'Mum', phrases: [] });
      await lastBackupSetting.set(Date.now() - 2 * 24 * 60 * 60 * 1000);
      render(<ParentModeScreen onExit={onExit} />, container);
      await new Promise((resolve) => setTimeout(resolve, 80));
      expect(notice()).toBeNull();

      render(null, container);
      await lastBackupSetting.set(Date.now() - 45 * 24 * 60 * 60 * 1000);
      render(<ParentModeScreen onExit={onExit} />, container);
      await waitFor(() => notice() !== null);
    });
  });

  describe('closing itself when unused', () => {
    it('does nothing by default', () => {
      vi.useFakeTimers();
      // Inside act() so its effects run now, not on a timer a previous test
      // may have left pending.
      act(() => {
        render(<ParentModeScreen onExit={onExit} />, container);
      });
      act(() => {
        vi.advanceTimersByTime(3 * 60 * 60 * 1000);
      });
      expect(onExit).not.toHaveBeenCalled();
    });

    it('closes after the chosen time without any use', () => {
      parentModeTimeoutSetting.signal.value = 5;
      vi.useFakeTimers();
      // Inside act() so its effects run now, not on a timer a previous test
      // may have left pending.
      act(() => {
        render(<ParentModeScreen onExit={onExit} />, container);
      });

      act(() => {
        vi.advanceTimersByTime(4 * 60_000);
      });
      expect(onExit).not.toHaveBeenCalled();
      act(() => {
        vi.advanceTimersByTime(90_000);
      });
      expect(onExit).toHaveBeenCalledOnce();
    });

    it('any press, key or typing counts as use and starts the wait again', () => {
      parentModeTimeoutSetting.signal.value = 5;
      vi.useFakeTimers();
      // Inside act() so its effects run now, not on a timer a previous test
      // may have left pending.
      act(() => {
        render(<ParentModeScreen onExit={onExit} />, container);
      });

      act(() => {
        vi.advanceTimersByTime(4 * 60_000);
      });
      act(() => {
        document.dispatchEvent(new Event('keydown', { bubbles: true }));
      });
      act(() => {
        vi.advanceTimersByTime(4 * 60_000);
      });
      expect(onExit).not.toHaveBeenCalled();
      act(() => {
        vi.advanceTimersByTime(2 * 60_000);
      });
      expect(onExit).toHaveBeenCalledOnce();
    });

    it('stops watching once it has been left', () => {
      parentModeTimeoutSetting.signal.value = 5;
      vi.useFakeTimers();
      // Inside act() so its effects run now, not on a timer a previous test
      // may have left pending.
      act(() => {
        render(<ParentModeScreen onExit={onExit} />, container);
      });
      render(null, container);
      act(() => {
        vi.advanceTimersByTime(60 * 60_000);
      });
      expect(onExit).not.toHaveBeenCalled();
    });
  });
});
