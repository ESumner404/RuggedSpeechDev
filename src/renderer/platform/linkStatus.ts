import { signal } from '@preact/signals';

/** How many of the family's own devices are connected over the link right now. */
export const linkPeers = signal(0);
