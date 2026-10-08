import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { DayBuilderTab } from './DayBuilderTab';
import { getDateString } from './dayLogic';
import { getDayPlan, getDaySettings, resetDBConnectionForTests } from '../store/db';

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

const today = getDateString(new Date());

describe('DayBuilderTab', () => {
  let container: HTMLElement;

  beforeEach(async () => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    container = document.createElement('div');
    render(<DayBuilderTab />, container);
    // Let the initial load settle before interacting (same reasoning as
    // PeoplePlacesTab: a fast sequence of actions can otherwise race the
    // mount effect).
    await new Promise((resolve) => setTimeout(resolve, 20));
  });

  it('adds an activity and persists it to today\'s plan', async () => {
    const input = container.querySelector<HTMLInputElement>(
      '.day-builder-tab__add-form input[placeholder="New activity name"]',
    )!;
    act(() => {
      input.value = 'Breakfast';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    act(() => {
      container
        .querySelector('.day-builder-tab__add-form')!
        .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await waitFor(() => container.querySelectorAll('.day-builder-tab__activity').length > 0);

    const plan = await getDayPlan(today);
    expect(plan.activities.map((a) => a.name)).toEqual(['Breakfast']);
  });

  it('editing an existing activity\'s name records changedFrom ("change of plan")', async () => {
    const addInput = container.querySelector<HTMLInputElement>(
      '.day-builder-tab__add-form input[placeholder="New activity name"]',
    )!;
    act(() => {
      addInput.value = 'Lunch';
      addInput.dispatchEvent(new Event('input', { bubbles: true }));
    });
    act(() => {
      container
        .querySelector('.day-builder-tab__add-form')!
        .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await waitFor(() => container.querySelectorAll('.day-builder-tab__activity').length > 0);

    const nameInput = container.querySelector<HTMLInputElement>(
      '.day-builder-tab__activity .parent-mode-screen__label-input',
    )!;
    act(() => {
      nameInput.value = "Grandma's";
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await new Promise((resolve) => setTimeout(resolve, 30));

    const plan = await getDayPlan(today);
    expect(plan.activities[0]).toMatchObject({ name: "Grandma's", changedFrom: 'Lunch' });
  });

  it('toggling countdown warnings on persists as a deliberate change (off by default)', async () => {
    expect((await getDaySettings()).countdownEnabled).toBe(false);

    const checkbox = container.querySelector<HTMLInputElement>(
      '.day-builder-tab__countdown-toggle input[type="checkbox"]',
    )!;
    expect(checkbox.checked).toBe(false);
    act(() => {
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await new Promise((resolve) => setTimeout(resolve, 30));

    expect((await getDaySettings()).countdownEnabled).toBe(true);
  });

  it('gives an activity a picture, and takes it off again', async () => {
    const input = container.querySelector<HTMLInputElement>(
      '.day-builder-tab__add-form input[placeholder="New activity name"]',
    )!;
    act(() => {
      input.value = 'Swimming';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    act(() => {
      container
        .querySelector('.day-builder-tab__add-form')!
        .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await waitFor(() => container.querySelectorAll('.day-builder-tab__activity').length > 0);

    const emoji = container.querySelector<HTMLInputElement>('input[aria-label="Emoji for Swimming"]')!;
    act(() => {
      emoji.value = '🏊';
      emoji.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await waitFor(() => container.querySelector('.day-builder-tab__picture summary')?.textContent === '🏊');
    let plan = await getDayPlan(today);
    expect(plan.activities[0]?.image).toEqual({ kind: 'emoji', char: '🏊' });

    const removeButton = () =>
      Array.from(container.querySelectorAll<HTMLButtonElement>('.day-builder-tab__picture button')).find(
        (b) => b.textContent === 'Take the picture off',
      );
    // The button appears a render after the summary changes.
    await waitFor(() => removeButton() !== undefined);
    act(() => removeButton()!.click());
    await waitFor(() => container.querySelector('.day-builder-tab__picture summary')?.textContent === 'Picture');
    await new Promise((resolve) => setTimeout(resolve, 30));
    plan = await getDayPlan(today);
    expect(plan.activities[0]?.image).toBeUndefined();
  });
});
