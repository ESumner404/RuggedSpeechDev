import { describe, expect, it } from 'vitest';
import { buildMenuTemplate } from './menu';

const roles = (template: ReturnType<typeof buildMenuTemplate>): string[] =>
  (template ?? []).flatMap((entry) => (Array.isArray(entry.submenu) ? entry.submenu : []).map((item) => item.role ?? item.type ?? ''));

describe('the application menu', () => {
  it('is removed on Windows and Linux', () => {
    expect(buildMenuTemplate('Rugged Speech Test', 'win32')).toBeNull();
    expect(buildMenuTemplate('Rugged Speech Test', 'linux')).toBeNull();
  });

  it('is small on a Mac: Hide, Quit and the editing shortcuts', () => {
    const template = buildMenuTemplate('Rugged Speech Test', 'darwin');
    expect(template?.map((entry) => entry.label)).toEqual(['Rugged Speech Test', 'Edit']);
    expect(roles(template)).toEqual(['hide', 'separator', 'quit', 'undo', 'redo', 'separator', 'cut', 'copy', 'paste', 'selectAll']);
  });

  it('never offers a way to reload, open developer tools, change zoom or open a window', () => {
    const forbidden = ['reload', 'forceReload', 'toggleDevTools', 'zoomIn', 'zoomOut', 'resetZoom', 'togglefullscreen', 'minimize', 'close', 'front', 'window'];
    for (const role of roles(buildMenuTemplate('x', 'darwin'))) expect(forbidden).not.toContain(role);
  });
});
