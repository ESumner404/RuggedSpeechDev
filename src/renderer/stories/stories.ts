// My stories: short step-by-step stories that get a child ready for something (the dentist, a haircut, a fire drill), told
// in plain, kind words with a picture for each step. An adult writes or changes them in Parent Mode. The child reads one a
// step at a time and presses to hear it; nothing is read aloud unless it is pressed.

export type StoryStep = { id: string; text: string; emoji: string; photoBlobId?: string };

export type Story = { id: string; title: string; emoji: string; steps: StoryStep[] };

export const MAX_STORIES = 30;
export const MAX_STEPS = 20;

export const isStoryList = (value: unknown): value is Story[] =>
  Array.isArray(value) &&
  value.length <= MAX_STORIES &&
  value.every((entry) => {
    if (typeof entry !== 'object' || entry === null) return false;
    const s = entry as Record<string, unknown>;
    return (
      typeof s['id'] === 'string' &&
      typeof s['title'] === 'string' &&
      typeof s['emoji'] === 'string' &&
      Array.isArray(s['steps']) &&
      s['steps'].length <= MAX_STEPS &&
      s['steps'].every((step) => {
        const t = step as Record<string, unknown> | null;
        return !!t && typeof t['id'] === 'string' && typeof t['text'] === 'string' && typeof t['emoji'] === 'string' && (t['photoBlobId'] === undefined || typeof t['photoBlobId'] === 'string');
      })
    );
  });

const newId = (prefix: string): string => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

export function newStory(title: string, emoji = '📖'): Story {
  return { id: newId('story'), title: title.trim().slice(0, 80) || 'My story', emoji, steps: [] };
}

export function newStep(text = '', emoji = '🙂'): StoryStep {
  return { id: newId('step'), text, emoji };
}

/** Moves a step one place earlier or later, leaving everything else where it is. */
export function moveStep(steps: StoryStep[], index: number, by: -1 | 1): StoryStep[] {
  const target = index + by;
  if (target < 0 || target >= steps.length) return steps;
  const next = [...steps];
  [next[index], next[target]] = [next[target]!, next[index]!];
  return next;
}

// Starting points, written to be gentle and plain, in the first person ("I"), to change to suit the child and the place.
// A speech and language therapist or the child's teacher should read them before a child relies on them.
export const STARTER_STORIES: Array<{ title: string; emoji: string; steps: Array<[string, string]> }> = [
  { title: 'Going to the dentist', emoji: '🦷', steps: [['Today I am going to the dentist.', '🚗'], ['I sit in the waiting room. I can look at a book.', '📚'], ['The dentist says hello.', '👋'], ['I sit in a big chair. It goes back a little.', '💺'], ['The dentist looks at my teeth with a small mirror.', '🪞'], ['If I need a break, I can put my hand up.', '✋'], ['Then it is finished. I did it!', '🎉']] },
  { title: 'Having a haircut', emoji: '✂️', steps: [['Today I am having my hair cut.', '💇'], ['I sit in a chair. I wear a cape.', '🧥'], ['The hairdresser uses scissors. They are safe.', '✂️'], ['It can be noisy. I can ask for a break.', '🔊'], ['When it is done, I look in the mirror.', '🪞'], ['Then we go home.', '🏠']] },
  { title: 'The fire drill', emoji: '🚒', steps: [['Sometimes a loud bell rings at school. It is a fire drill.', '🔔'], ['It is only practice.', '✅'], ['I stop what I am doing.', '✋'], ['I walk out with my class, with a grown-up.', '🚶'], ['We stand outside and wait.', '🌳'], ['Then we go back in. It is quiet again.', '🏫']] },
  { title: 'A new person is coming', emoji: '🙋', steps: [['Someone new is coming to see me.', '🚪'], ['They will say hello.', '👋'], ['I can say hello back, or wave, or just look.', '🙂'], ['I can show them my device.', '📱'], ['I can ask for a break if I need one.', '⏸️']] },
];

export function storyFromStarter(index: number): Story | null {
  const starter = STARTER_STORIES[index];
  if (!starter) return null;
  return { id: newId('story'), title: starter.title, emoji: starter.emoji, steps: starter.steps.map(([text, emoji]) => ({ id: newId('step'), text, emoji })) };
}
