import { FITZGERALD_COLORS, type FitzgeraldClass } from '../ui/fitzgerald';
import type { Board, GridSize, Item } from '../store/types';

// Starter vocabulary: a small set of the first words a young child uses, and
// only those. Emoji only, and only emoji that Windows 10 can draw (nothing
// newer than Unicode 12), because an unknown emoji shows as an empty box on a
// child's screen. The Talk page is sixteen big buttons: the words that go
// with everything ("I", "want", "more", "no", "help", "go"), and a few
// folders. Every folder holds nine things or fewer, in a three-by-three of
// large buttons, so there is never a crowd to search. Everyday words only:
// nothing a four-year-old would not say. Families add their own people,
// places and things (Parent Mode), and a speech and language therapist
// should review and trim this before it reaches a child; word stages (Parent
// Mode, Learning) bring words in gradually.
function word(id: string, label: string, cls: FitzgeraldClass, emoji: string): Item {
  return {
    id,
    label,
    image: { kind: 'emoji', char: emoji },
    background_color: FITZGERALD_COLORS[cls],
  };
}

function folder(id: string, label: string, cls: FitzgeraldClass, emoji: string, targetBoardId: string): Item {
  return {
    id,
    label,
    image: { kind: 'emoji', char: emoji },
    background_color: FITZGERALD_COLORS[cls],
    load_board: { id: targetBoardId },
  };
}

function gridOrder(ids: (string | null)[], rows: GridSize, columns: GridSize): (string | null)[][] {
  const cells = rows * columns;
  const padded: (string | null)[] = [...ids];
  while (padded.length < cells) padded.push(null);
  const order: (string | null)[][] = [];
  for (let r = 0; r < rows; r += 1) {
    order.push(padded.slice(r * columns, (r + 1) * columns));
  }
  return order;
}


export const ROOT_BOARD_ID = 'talk-root';
export const FOOD_BOARD_ID = 'food';
export const FOOD_DRINKS_BOARD_ID = 'food-drinks';
export const FEELINGS_BOARD_ID = 'feelings';
export const PLAY_BOARD_ID = 'play';
export const PEOPLE_BOARD_ID = 'people';
export const PLACES_BOARD_ID = 'places';
export const SCHOOL_BOARD_ID = 'school';
export const ACTIONS_BOARD_ID = 'actions';
export const ANIMALS_BOARD_ID = 'animals';
export const BODY_BOARD_ID = 'body';
export const HELLO_BOARD_ID = 'hello';

/** A board whose buttons are laid out in list order. */
function board(id: string, name: string, rows: GridSize, columns: GridSize, buttons: Item[]): Board {
  return { id, name, grid: { rows, columns, order: gridOrder(buttons.map((b) => b.id), rows, columns) }, buttons };
}

// The first fifteen places are where they have always been, so a child who
// learnt "I want" keeps that motor memory (I3).
const rootBoard = board(ROOT_BOARD_ID, 'Talk', 4, 4, [
  word('i', 'I', 'littleWords', '🙋'),
  word('want', 'want', 'doing', '🤲'),
  word('like', 'like', 'doing', '👍'),
  word('more', 'more', 'littleWords', '➕'),
  word('no', 'no', 'noStop', '🚫'),
  word('yes', 'yes', 'littleWords', '✅'),
  word('help', 'help', 'social', '🆘'),
  word('go', 'go', 'doing', '🚶'),
  word('my', 'my', 'littleWords', '☝️'),
  word('feel', 'feel', 'describing', '❤️'),
  folder('food', 'Food', 'things', '🍽️', FOOD_BOARD_ID),
  folder('feelings', 'Feelings', 'describing', '😊', FEELINGS_BOARD_ID),
  folder('play', 'Play', 'things', '🧸', PLAY_BOARD_ID),
  folder('people', 'People', 'people', '👨‍👩‍👧', PEOPLE_BOARD_ID),
  folder('places', 'Places', 'places', '📍', PLACES_BOARD_ID),
  folder('actions', 'Doing', 'doing', '🏃', ACTIONS_BOARD_ID),
]);

const foodBoard = board(FOOD_BOARD_ID, 'Food', 3, 3, [
  word('apple', 'apple', 'things', '🍎'),
  word('banana', 'banana', 'things', '🍌'),
  word('biscuit', 'biscuit', 'things', '🍪'),
  word('bread', 'bread', 'things', '🍞'),
  word('cheese', 'cheese', 'things', '🧀'),
  word('egg', 'egg', 'things', '🥚'),
  word('a-drink', 'a drink', 'things', '🥤'),
  folder('drinks', 'Drinks', 'things', '🧃', FOOD_DRINKS_BOARD_ID),
]);

const foodDrinksBoard = board(FOOD_DRINKS_BOARD_ID, 'Drinks', 3, 3, [
  word('water', 'water', 'things', '💧'),
  word('juice', 'juice', 'things', '🧃'),
  word('milk', 'milk', 'things', '🥛'),
]);

const feelingsBoard = board(FEELINGS_BOARD_ID, 'Feelings', 3, 3, [
  word('happy', 'happy', 'describing', '😊'),
  word('sad', 'sad', 'describing', '😢'),
  word('angry', 'angry', 'describing', '😠'),
  word('tired', 'tired', 'describing', '😴'),
  word('hungry', 'hungry', 'describing', '😋'),
  word('scared-talk', 'scared', 'describing', '😨'),
  { ...word('it-hurts', 'it hurts', 'describing', '🤕'), vocalization: 'It hurts' },
  folder('body', 'My body', 'things', '🙂', BODY_BOARD_ID),
]);

const playBoard = board(PLAY_BOARD_ID, 'Play', 3, 3, [
  word('ball', 'ball', 'things', '⚽'),
  word('blocks', 'blocks', 'things', '🧱'),
  word('storybook', 'book', 'things', '📖'),
  word('car', 'car', 'things', '🚗'),
  word('teddy', 'teddy', 'things', '🧸'),
  word('music', 'music', 'things', '🎵'),
  word('tv', 'TV', 'things', '📺'),
  folder('animals', 'Animals', 'things', '🐶', ANIMALS_BOARD_ID),
]);

// Four by four, with room left for the people and places a family adds.
const peopleBoard = board(PEOPLE_BOARD_ID, 'People', 4, 4, [
  word('mum', 'Mum', 'people', '👩'),
  word('dad', 'Dad', 'people', '👨'),
  word('me', 'me', 'people', '🙋'),
  word('you', 'you', 'people', '👉'),
  word('friend', 'friend', 'people', '🧑‍🤝‍🧑'),
  word('teacher', 'teacher', 'people', '🧑‍🏫'),
  word('baby', 'baby', 'people', '👶'),
  word('grandma', 'Grandma', 'people', '👵'),
  folder('hello', 'Hello', 'social', '👋', HELLO_BOARD_ID),
]);

const placesBoard = board(PLACES_BOARD_ID, 'Places', 4, 4, [
  word('home-place', 'home', 'places', '🏠'),
  word('park', 'park', 'places', '🌳'),
  word('shop', 'shop', 'places', '🏪'),
  word('bedroom', 'bedroom', 'places', '🛏️'),
  word('kitchen', 'kitchen', 'places', '🍳'),
  word('car-place', 'in the car', 'places', '🚗'),
  folder('school', 'School', 'things', '🏫', SCHOOL_BOARD_ID),
]);

const schoolBoard = board(SCHOOL_BOARD_ID, 'School', 3, 3, [
  word('pencil', 'pencil', 'things', '✏️'),
  word('school-book', 'book', 'things', '📚'),
  word('school-teacher', 'teacher', 'people', '🧑‍🏫'),
  word('break', 'break', 'things', '🕑'),
  word('lunch', 'lunch', 'things', '🍱'),
  word('my-turn', 'my turn', 'social', '🙋'),
  word('your-turn', 'your turn', 'social', '👉'),
]);

const actionsBoard = board(ACTIONS_BOARD_ID, 'Doing', 4, 4, [
  word('stop', 'stop', 'noStop', '🛑'),
  word('look', 'look', 'doing', '👀'),
  word('all-done', 'all done', 'littleWords', '🏁'),
  word('eat', 'eat', 'doing', '🍽️'),
  word('drink', 'drink', 'doing', '🥤'),
  word('sleep', 'sleep', 'doing', '😴'),
  word('wash', 'wash', 'doing', '🧼'),
  { ...word('toilet', 'toilet', 'things', '🚽'), vocalization: 'I need the toilet' },
  word('sit', 'sit', 'doing', '🪑'),
  word('again', 'again', 'littleWords', '🔁'),
  word('open', 'open', 'doing', '📂'),
  word('that', 'that', 'littleWords', '👆'),
  word('not', 'not', 'noStop', '⛔'),
]);

const animalsBoard = board(ANIMALS_BOARD_ID, 'Animals', 3, 3, [
  word('dog', 'dog', 'things', '🐶'),
  word('cat', 'cat', 'things', '🐱'),
  word('bird', 'bird', 'things', '🐦'),
  word('fish', 'fish', 'things', '🐟'),
  word('horse', 'horse', 'things', '🐴'),
  word('cow', 'cow', 'things', '🐮'),
  word('pig', 'pig', 'things', '🐷'),
  word('duck', 'duck', 'things', '🦆'),
  word('sheep', 'sheep', 'things', '🐑'),
]);

const bodyBoard = board(BODY_BOARD_ID, 'My body', 3, 3, [
  word('head', 'head', 'things', '🙂'),
  word('eyes', 'eyes', 'things', '👁️'),
  word('ears', 'ears', 'things', '👂'),
  word('nose', 'nose', 'things', '👃'),
  word('mouth', 'mouth', 'things', '👄'),
  word('hand', 'hand', 'things', '✋'),
  word('tummy', 'tummy', 'things', '🎽'),
  word('leg', 'leg', 'things', '🦵'),
  word('foot', 'foot', 'things', '🦶'),
]);

const helloBoard = board(HELLO_BOARD_ID, 'Hello', 3, 3, [
  word('what', 'what?', 'social', '❓'),
  word('hello-word', 'hello', 'social', '👋'),
  word('goodbye', 'goodbye', 'social', '🖐️'),
  word('please', 'please', 'social', '🙏'),
  word('thank-you', 'thank you', 'social', '😊'),
  word('sorry', 'sorry', 'social', '😔'),
  word('wait', 'wait', 'social', '✋'),
  word('goodnight', 'goodnight', 'social', '🌙'),
]);

export const STARTER_BOARDS: Board[] = [
  rootBoard,
  foodBoard,
  foodDrinksBoard,
  feelingsBoard,
  playBoard,
  peopleBoard,
  placesBoard,
  schoolBoard,
  actionsBoard,
  animalsBoard,
  bodyBoard,
  helloBoard,
];

/** Every button label across the starter vocabulary, the prediction candidate set. */
export function collectVocabularyWords(): string[] {
  const labels = STARTER_BOARDS.flatMap((board) => board.buttons.map((button) => button.label));
  return Array.from(new Set(labels));
}
