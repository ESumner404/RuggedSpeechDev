// A minimal "what's focusable, in order" query, used to let Space act as
// a Tab-equivalent outside the board grid (docs/build-plan.md Phase 7's "operable
// with two switches and nothing else": Space advances, Enter activates,
// everywhere in the app, not only inside a scanning grid). Deliberately
// excludes anything the grid has already taken out of tab order itself
// (tabindex="-1"), so this and the grid's own scanning never fight over
// the same button.
// a[href], not the bare [href] one might reach for, a stylesheet <link
// href="..."> in <head> matches that too and isn't focusable, which
// silently stalls the whole chain on the very first press.
const FOCUSABLE_SELECTOR =
  'button:not([disabled]):not([tabindex="-1"]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])';

export function focusableElements(root: ParentNode = document): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

export function focusNext(): void {
  const elements = focusableElements();
  if (elements.length === 0) return;
  const currentIndex = elements.indexOf(document.activeElement as HTMLElement);
  const nextIndex = (currentIndex + 1 + elements.length) % elements.length;
  elements[nextIndex]?.focus();
}
