import type { AccessSettings } from '../store/types';

// Visual adjustments (PLAN.md Phase 7): applied as attributes/CSS custom
// properties on the document root so global.css can key off them without
// every component needing to know about Access settings itself.
export function applyAccessSettings(settings: AccessSettings): void {
  const root = document.documentElement;
  root.dataset['contrast'] = settings.highContrast;
  root.dataset['reduceMotion'] = String(settings.reduceMotion);
  root.style.setProperty('--text-scale', String(settings.textScale));
}
