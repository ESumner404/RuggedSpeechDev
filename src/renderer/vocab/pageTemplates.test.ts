import { describe, expect, it } from 'vitest';
import { PAGE_TEMPLATES } from './pageTemplates';
import { MAX_PAGE_BUTTONS } from '../store/pages';
import { FITZGERALD_COLORS } from '../ui/fitzgerald';

describe('page templates', () => {
  it('has a good spread, each with its own id and name', () => {
    expect(PAGE_TEMPLATES.length).toBeGreaterThanOrEqual(18);
    expect(new Set(PAGE_TEMPLATES.map((t) => t.id)).size).toBe(PAGE_TEMPLATES.length);
    expect(new Set(PAGE_TEMPLATES.map((t) => t.name)).size).toBe(PAGE_TEMPLATES.length);
  });

  it.each(PAGE_TEMPLATES.map((t) => [t.name, t] as const))('%s is usable as it stands', (_name, template) => {
    expect(template.description.trim()).not.toBe('');
    expect(template.buttons.length).toBeGreaterThanOrEqual(2);
    expect(template.buttons.length).toBeLessThanOrEqual(MAX_PAGE_BUTTONS);

    const labels = template.buttons.map((b) => b.label.toLowerCase());
    expect(new Set(labels).size).toBe(labels.length); // no duplicate buttons on a page
    for (const button of template.buttons) {
      expect(button.label.trim()).not.toBe('');
      expect(button.emoji, `${button.label} needs a picture`).toBeTruthy();
      if (button.colour) expect(FITZGERALD_COLORS[button.colour]).toBeDefined();
    }
  });

  it('keeps to the project\'s tone: no deficit wording in any template', () => {
    const text = JSON.stringify(PAGE_TEMPLATES).toLowerCase();
    for (const word of ['problem', 'behaviour', 'disorder', 'sensory issue', 'naughty']) {
      expect(text).not.toContain(word);
    }
  });
});
