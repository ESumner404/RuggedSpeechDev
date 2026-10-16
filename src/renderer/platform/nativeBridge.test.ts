import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildNativeBridge, installNativeBridge, nativePlatform, type NativeShell } from './nativeBridge';
import { printPage } from './print';

function fakeShell(overrides: Partial<NativeShell> = {}): NativeShell {
  return {
    info: vi.fn(async () => ({ version: '1.2.3' })),
    saveFile: vi.fn(async () => ({ ok: true })),
    openFile: vi.fn(async () => ({ ok: true, data: 'hello' })),
    printPage: vi.fn(async () => undefined),
    accessibility: vi.fn(async () => ({
      reduceMotion: true,
      increaseContrast: false,
      boldText: false,
      textScale: 1.25,
      voiceOver: false,
      switchControl: false,
      guidedAccess: false,
    })),
    haptic: vi.fn(async () => undefined),
    linkStart: vi.fn(async () => undefined),
    linkStop: vi.fn(async () => undefined),
    linkSend: vi.fn(async () => undefined),
    linkInbox: vi.fn(async () => ({ messages: ['{"type":"open","screen":"game"}', 'not json', '{"nope":1}'], peers: 2 })),
    ...overrides,
  };
}

describe('the phone and tablet bridge', () => {
  it('says what a phone or tablet cannot do, so the page can hide it', () => {
    const bridge = buildNativeBridge(fakeShell(), 'ios', '1.0');
    expect(bridge.platform).toBe('ios');
    expect(bridge.capabilities).toEqual({ fullscreen: false, startup: false, deviceAccessibility: true, haptics: true, link: true });
    expect(bridge.versions.app).toBe('1.0');
  });

  it('saves a backup under a dated name with the backup extension', async () => {
    const shell = fakeShell();
    const bridge = buildNativeBridge(shell, 'ios', '1.0');
    expect(await bridge.backup.save('{"a":1}')).toEqual({ ok: true });
    const call = vi.mocked(shell.saveFile).mock.calls[0]![0];
    expect(call.data).toBe('{"a":1}');
    expect(call.name).toMatch(/^rugged-speech-backup-\d{4}-\d{2}-\d{2}\.mwbackup$/);
  });

  it('reports a cancelled save as not saved, not as an error', async () => {
    const bridge = buildNativeBridge(fakeShell({ saveFile: async () => ({ ok: false }) }), 'ios', '1.0');
    expect(await bridge.files.save('x', { suggestedName: 'a.csv', filterName: 'CSV', extensions: ['csv'] })).toEqual({
      ok: false,
    });
  });

  it('survives the native side failing', async () => {
    const boom = async (): Promise<never> => {
      throw new Error('no');
    };
    const bridge = buildNativeBridge(fakeShell({ saveFile: boom, openFile: boom }), 'ios', '1.0');
    expect(await bridge.backup.save('x')).toEqual({ ok: false });
    expect(await bridge.backup.restore()).toEqual({ ok: false });
    expect(await bridge.files.open({ filterName: 'Page', extensions: ['obf'] })).toEqual({ ok: false });
  });

  it('opens a file by the kind asked for and hands back only its text', async () => {
    const shell = fakeShell();
    const bridge = buildNativeBridge(shell, 'ios', '1.0');
    expect(await bridge.files.open({ filterName: 'Page', extensions: ['obf'] })).toEqual({ ok: true, data: 'hello' });
    expect(shell.openFile).toHaveBeenCalledWith({ extensions: ['obf'] });
    expect(await bridge.backup.restore()).toEqual({ ok: true, data: 'hello' });
    expect(shell.openFile).toHaveBeenLastCalledWith({ extensions: ['mwbackup'] });
  });

  it('treats a picked file with no text as not opened', async () => {
    const bridge = buildNativeBridge(fakeShell({ openFile: async () => ({ ok: true }) }), 'ios', '1.0');
    expect(await bridge.backup.restore()).toEqual({ ok: false });
  });

  it('asks the device which accessibility settings are on, and can buzz', async () => {
    const shell = fakeShell();
    const bridge = buildNativeBridge(shell, 'ios', '1.0');
    expect((await bridge.deviceAccessibility!()).reduceMotion).toBe(true);
    await bridge.haptic!();
    expect(shell.haptic).toHaveBeenCalled();
  });

  it('passes link messages through as objects and drops what it cannot read', async () => {
    const shell = fakeShell();
    const bridge = buildNativeBridge(shell, 'ios', '1.0');
    await bridge.link!.start('1234');
    expect(shell.linkStart).toHaveBeenCalledWith({ code: '1234' });
    await bridge.link!.send({ type: 'state', screen: 'home' });
    expect(shell.linkSend).toHaveBeenCalledWith({ json: '{"type":"state","screen":"home"}' });
    expect(await bridge.link!.inbox()).toEqual({ messages: [{ type: 'open', screen: 'game' }], peers: 2 });
  });

  it('has no start-up setting and stays full screen', async () => {
    const bridge = buildNativeBridge(fakeShell(), 'ios', '1.0');
    expect(await bridge.startup.getOpenAtLogin()).toBe(false);
    expect(await bridge.parentMode.isFullscreen()).toBe(true);
  });
});

describe('knowing which shell the page is in', () => {
  afterEach(() => {
    delete (window as unknown as { Capacitor?: unknown }).Capacitor;
    delete (window as unknown as { myWords?: unknown }).myWords;
    document.documentElement.removeAttribute('data-platform');
    vi.restoreAllMocks();
  });

  it('is nothing in a plain browser or on the desktop', async () => {
    expect(nativePlatform()).toBeUndefined();
    await installNativeBridge();
    expect(window.myWords).toBeUndefined();
  });

  it('is ios inside the iPhone and iPad app', () => {
    (window as unknown as { Capacitor: unknown }).Capacitor = { isNativePlatform: () => true, getPlatform: () => 'ios' };
    expect(nativePlatform()).toBe('ios');
  });

  it('leaves the desktop bridge alone when one is already there', async () => {
    const existing = { versions: { app: 'desktop' } };
    (window as unknown as { myWords: unknown }).myWords = existing;
    (window as unknown as { Capacitor: unknown }).Capacitor = { isNativePlatform: () => true, getPlatform: () => 'ios' };
    await installNativeBridge();
    expect(window.myWords).toBe(existing);
  });
});

describe('printing', () => {
  afterEach(() => {
    delete (window as unknown as { myWords?: unknown }).myWords;
    vi.restoreAllMocks();
  });

  it('uses the shell’s own print sheet when it has one', () => {
    const print = vi.fn(async () => undefined);
    (window as unknown as { myWords: unknown }).myWords = { print };
    const windowPrint = vi.spyOn(window, 'print').mockImplementation(() => undefined);
    printPage();
    expect(print).toHaveBeenCalled();
    expect(windowPrint).not.toHaveBeenCalled();
  });

  it('uses the browser’s print otherwise', () => {
    (window as unknown as { myWords: unknown }).myWords = {};
    const windowPrint = vi.spyOn(window, 'print').mockImplementation(() => undefined);
    printPage();
    expect(windowPrint).toHaveBeenCalled();
  });
});
