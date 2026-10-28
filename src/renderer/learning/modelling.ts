// Modelling ("aided language input"): the most useful thing a partner can do is press the words on the device while
// they talk, so the child sees the words and hears them in use, with no demand to press anything back. This gives a
// partner one word to model each week, and a few easy ways to do it. The wording is a starting point for a speech and
// language therapist to change.

export type ModellingFocus = { word: string; why: string; try: string[] };

export const MODELLING_WORDS: ModellingFocus[] = [
  { word: 'more', why: 'The first word many children use to ask, and it works in every activity.', try: ['Pause in a game they like, then press “more” and say “More?” before you continue.', 'At snack, press “more” as you offer another piece.', 'During bubbles or songs, press “more” each time you start again.'] },
  { word: 'want', why: 'Lets a child say what they choose, which is the heart of communicating.', try: ['Hold up two things and press “want” while you say “Which do you want?”', 'Press “want” as you say “I want the red one” about something of your own.'] },
  { word: 'help', why: 'A word that gets a need met and keeps a child safe.', try: ['When a lid is tight, press “help” and say “I need help!” before opening it for them.', 'Press “help” when you are stuck on a puzzle, so they see an adult asking too.'] },
  { word: 'stop', why: 'A clear way to say no that is not behaviour, but communication.', try: ['Play “stop and go”: press “stop” and pause, then “go”.', 'Press “stop” and stop a tickle straight away when they show they want it to end.'] },
  { word: 'go', why: 'A little word that gets things moving, and goes with “stop”.', try: ['Press “go” as you start the swing, the car or the walk.', 'Before leaving a room, press “go” and say “Let’s go”.'] },
  { word: 'like', why: 'Opens up comments and opinions, not just requests.', try: ['Press “I”, then “like” when you enjoy something: “I like this song.”', 'Ask “Do you like it?” and press “like”.'] },
  { word: 'my', why: 'Gives the child a way to say what belongs to them.', try: ['Pick up their cup and press “my” as you say “This is your cup. It is my cup.”', 'In a game, press “my” on your turn and “your” on theirs.'] },
  { word: 'yes', why: 'An easy way to answer, and the first step to answering questions.', try: ['Offer something they love and press “yes” as you say “Yes! You like that!”', 'Ask a question you know the answer to, so “yes” is easy to be right.'] },
  { word: 'no', why: 'Every child should be able to say no and be listened to.', try: ['Offer something they usually do not want and press “no” as you take it away.', 'Press “no” when they turn away, so they know you heard.'] },
  { word: 'feel', why: 'Helps a child name how they feel, and lets you talk about feelings together.', try: ['At a calm moment, press “I”, “feel”, then a feeling word about yourself.', 'Use it when a character in a book feels something: “He feels sad.”'] },
  { word: 'finished', why: 'A kind way to end an activity, and a first step to telling you they are done.', try: ['Press “finished” at the end of every snack or game so it is always the same.', 'Offer “finished?” when they start to lose interest.'] },
  { word: 'play', why: 'Play is how children learn language, so this word is useful all day.', try: ['Press “play” when you sit down with toys: “Let’s play.”', 'Press “play” and then a thing, such as “play ball”.'] },
];

/** ISO week number (1 to 53) of a date, so a word lasts a week and then changes. */
export function weekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}

/** The word to model this week. It changes on Monday, and goes round again in the same order. */
export function modellingFocus(date: Date, words: ModellingFocus[] = MODELLING_WORDS): ModellingFocus {
  return words[(weekNumber(date) + date.getFullYear()) % words.length]!;
}
