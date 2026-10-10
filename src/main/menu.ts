import type { MenuItemConstructorOptions } from 'electron';

/**
 * The application menu. On Windows there is none: the menu bar is removed so
 * the child's screen has nothing but the app. A Mac cannot have no menu bar at
 * all, and Cmd+C, Cmd+V and Cmd+Z only work in a text box if an Edit menu
 * exists, so there a small one is kept: Hide and Quit, and the editing
 * shortcuts. It has no reload, no developer tools and nothing that opens a
 * window.
 */
export function buildMenuTemplate(appName: string, platform: NodeJS.Platform): MenuItemConstructorOptions[] | null {
  if (platform !== 'darwin') return null;
  return [
    {
      label: appName,
      submenu: [{ role: 'hide' }, { type: 'separator' }, { role: 'quit' }],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
  ];
}
