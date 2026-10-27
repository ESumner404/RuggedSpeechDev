import type { TargetArea } from '../store/staff';

// A bank of communication goals to start from, written in plain words, as the child would hope to hear them. They are
// starting points for an adult and a speech and language therapist to change, not a programme: each is a suggestion,
// and what is right depends on the child.
export type Goal = { area: TargetArea; text: string };

export const GOAL_BANK: Goal[] = [
  { area: 'express', text: 'Uses a word or picture to ask for more of something they like, at least 3 times a day.' },
  { area: 'express', text: 'Uses “no” or “stop” to say they do not want something, instead of only pushing it away.' },
  { area: 'express', text: 'Presses “help” when something is stuck or too hard, with a gentle reminder.' },
  { area: 'express', text: 'Combines two words (for example “want juice” or “more bubbles”) to ask for what they need.' },
  { area: 'express', text: 'Makes a short comment about something they see, such as “big dog”, to share, not only to ask.' },
  { area: 'express', text: 'Tells an adult how they feel, using a feelings button and how much.' },
  { area: 'express', text: 'Answers a choice of two things by pressing the one they want.' },
  { area: 'express', text: 'Says hello and goodbye to a familiar person, using the device or a gesture.' },
  { area: 'express', text: 'Asks a question, such as “what” or “where”, to find out something.' },
  { area: 'express', text: 'Builds a sentence of three words or more, with some help to find the words.' },
  { area: 'understand', text: 'Follows a one-step instruction with a picture or a gesture to help.' },
  { area: 'understand', text: 'Shows they understand what is next by looking at or pressing the My Day card.' },
  { area: 'understand', text: 'Points to or presses the picture when an adult says a familiar word.' },
  { area: 'understand', text: 'Waits for “first” and “then” cards, and finishes the first thing before the second.' },
  { area: 'social', text: 'Takes a turn in a back-and-forth game or chat, pressing a button on their turn.' },
  { area: 'social', text: 'Stays with a shared activity for a few turns, with an adult modelling on the device.' },
  { area: 'social', text: 'Uses the traffic light to show whether they want to be spoken to.' },
  { area: 'social', text: 'Presses “give me time” when they need longer to think, and is given it.' },
  { area: 'access', text: 'Finds a word on the Talk page they have used before, with fewer reminders each week.' },
  { area: 'access', text: 'Uses the device in a new place (a different room or the playground) with a trusted adult.' },
  { area: 'access', text: 'Takes the device to an activity, such as snack or story time, without being asked.' },
];
