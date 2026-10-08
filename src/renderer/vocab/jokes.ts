// Very simple jokes: a question and an answer, each a few words, about things
// a young child knows. Gentle, with nothing that laughs at a person.
export type Joke = { q: string; a: string };

export const BASIC_JOKES: Joke[] = [
  { q: 'What do cows drink?', a: 'Moo-lk!' },
  { q: 'What do you call a sleeping bull?', a: 'A bulldozer!' },
  { q: 'What is a cat’s favourite colour?', a: 'Purr-ple!' },
  { q: 'What do you call a fish with no eyes?', a: 'A fsh!' },
  { q: 'Why did the banana go to the doctor?', a: 'It was not peeling well!' },
  { q: 'What do ducks like to eat?', a: 'Quackers!' },
  { q: 'What goes “tick tock woof”?', a: 'A watchdog!' },
  { q: 'Why did the teddy bear say no to pudding?', a: 'She was stuffed!' },
  { q: 'What do you call a dog on the beach?', a: 'A hot dog!' },
  { q: 'What is a frog’s favourite drink?', a: 'Croak-a-cola!' },
  { q: 'What do you call a sheep with no legs?', a: 'A cloud!' },
  { q: 'Why was the cat on the computer?', a: 'To catch the mouse!' },
  { q: 'What is yellow and goes “bang”?', a: 'A firework banana!' },
  { q: 'What do you call a bear with no teeth?', a: 'A gummy bear!' },
  { q: 'What is orange and sounds like a parrot?', a: 'A carrot!' },
  { q: 'Why did the cookie go to the doctor?', a: 'It felt crumby!' },
  { q: 'What do elves learn at school?', a: 'The elf-abet!' },
  { q: 'What has four legs and goes “quack”?', a: 'A duck with a spare pair of legs!' },
  { q: 'Where do cows go on a night out?', a: 'To the moo-vies!' },
  { q: 'What do you call a pig that does karate?', a: 'A pork chop!' },
  { q: 'Why did the sun not go to school?', a: 'It already had a million degrees!' },
  { q: 'What kind of key opens a banana?', a: 'A mon-key!' },
  { q: 'What do you get from a pampered cow?', a: 'Spoiled milk!' },
  { q: 'What did the big flower say to the little flower?', a: 'Hi, bud!' },
  { q: 'Why did the clock go to school?', a: 'To learn to tell the time!' },
  { q: 'What is a robot’s favourite snack?', a: 'Computer chips!' },
  { q: 'What do you call a snowman in summer?', a: 'A puddle!' },
  { q: 'What is brown and sticky?', a: 'A stick!' },
  { q: 'What did the sea say to the beach?', a: 'Nothing, it just waved!' },
  { q: 'Why do birds fly south?', a: 'It is too far to walk!' },
];

export const isJokeList = (value: unknown): value is Joke[] =>
  Array.isArray(value) &&
  value.length <= 100 &&
  value.every((j) => typeof j === 'object' && j !== null && typeof (j as Joke).q === 'string' && typeof (j as Joke).a === 'string');

/** Next joke: not the one just told, and not at random only: it goes through the whole list before repeating. */
export function nextJokeIndex(total: number, told: number[], random: () => number = Math.random): number {
  if (total <= 1) return 0;
  const recent = new Set(told.slice(-Math.min(told.length, total - 1)));
  const fresh = Array.from({ length: total }, (_, i) => i).filter((i) => !recent.has(i));
  return fresh[Math.floor(random() * fresh.length)]!;
}

/** A silly one: one joke's question with another joke's answer. */
export function sillyMix(jokes: Joke[], random: () => number = Math.random): Joke | undefined {
  if (jokes.length < 2) return undefined;
  const a = Math.floor(random() * jokes.length);
  let b = Math.floor(random() * (jokes.length - 1));
  if (b >= a) b += 1;
  return { q: jokes[a]!.q, a: jokes[b]!.a };
}
