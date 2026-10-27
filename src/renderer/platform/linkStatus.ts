import { signal } from '@preact/signals';

/** How many of the family's own devices are connected over the link right now. */
export const linkPeers = signal(0);

import type { ControllerSpec } from './appleLink';

/** The buttons the Apple TV last asked this device to show for a game, or null when no game is on. */
export const controllerSpec = signal<ControllerSpec | null>(null);
