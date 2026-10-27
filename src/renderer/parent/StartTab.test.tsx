import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StartTab } from './StartTab';
import { appleLinkSetting, resetDBConnectionForTests } from '../store/db';
import { linkPeers } from '../platform/linkStatus';

describe('StartTab', () => {
  let container: HTMLElement;

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    linkPeers.value = 0;
    container = document.createElement('div');
  });

  it('says linking is off and offers to set it up', () => {
    const go = vi.fn();
    render(<StartTab go={go} />, container);
    const card = container.querySelector('.start-tab__link')!;
    expect(card.textContent).toContain('Linking is off');
    act(() => card.querySelector('button')!.click());
    expect(go).toHaveBeenCalledWith('access');
  });

  it('counts the connected devices once linking is on', async () => {
    await appleLinkSetting.set({ enabled: true, code: '1234' });
    linkPeers.value = 2;
    render(<StartTab go={() => {}} />, container);
    const card = container.querySelector('.start-tab__link')!;
    expect(card.textContent).toContain('2 devices are connected');
    expect(card.querySelector('button')?.textContent).toBe('Manage linked devices');
  });
});
