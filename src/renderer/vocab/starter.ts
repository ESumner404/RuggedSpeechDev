import { FITZGERALD_COLORS, type FitzgeraldClass } from '../ui/fitzgerald';
import type { Board, GridSize, Item } from '../store/types';

// Starter vocabulary for Phase 1. Emoji only — symbols (Phase 10) and
// photographs (Phase 4) come later. This is a placeholder set for
// exercising the board mechanics, not a clinical vocabulary: PLAN.md is
// explicit that a speech and language therapist must review it before it
// reaches a real child.

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

const rootButtons: Item[] = [
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
  folder('school', 'School', 'things', '🏫', SCHOOL_BOARD_ID),
];

const rootBoard: Board = {
  id: ROOT_BOARD_ID,
  name: 'Talk',
  grid: { rows: 4, columns: 4, order: gridOrder(rootButtons.map((b) => b.id), 4, 4) },
  buttons: rootButtons,
};

const foodButtons: Item[] = [
  word('apple', 'apple', 'things', '🍎'),
  word('banana', 'banana', 'things', '🍌'),
  word('biscuit', 'biscuit', 'things', '🍪'),
  word('a-drink', 'a drink', 'things', '🥤'),
  folder('drinks', 'Drinks', 'things', '🧃', FOOD_DRINKS_BOARD_ID),
];

const foodBoard: Board = {
  id: FOOD_BOARD_ID,
  name: 'Food',
  grid: { rows: 3, columns: 3, order: gridOrder(foodButtons.map((b) => b.id), 3, 3) },
  buttons: foodButtons,
};

const foodDrinksButtons: Item[] = [
  word('water', 'water', 'things', '💧'),
  word('juice', 'juice', 'things', '🧃'),
  word('milk', 'milk', 'things', '🥛'),
];

const foodDrinksBoard: Board = {
  id: FOOD_DRINKS_BOARD_ID,
  name: 'Drinks',
  grid: { rows: 2, columns: 2, order: gridOrder(foodDrinksButtons.map((b) => b.id), 2, 2) },
  buttons: foodDrinksButtons,
};

const feelingsButtons: Item[] = [
  word('happy', 'happy', 'describing', '😊'),
  word('sad', 'sad', 'describing', '😢'),
  word('angry', 'angry', 'describing', '😠'),
  word('tired', 'tired', 'describing', '😴'),
  word('worried', 'worried', 'describing', '😟'),
  word('excited', 'excited', 'describing', '🤩'),
];

const feelingsBoard: Board = {
  id: FEELINGS_BOARD_ID,
  name: 'Feelings',
  grid: { rows: 3, columns: 3, order: gridOrder(feelingsButtons.map((b) => b.id), 3, 3) },
  buttons: feelingsButtons,
};

const playButtons: Item[] = [
  word('ball', 'ball', 'things', '⚽'),
  word('blocks', 'blocks', 'things', '🧱'),
  word('storybook', 'book', 'things', '📖'),
  word('game', 'game', 'things', '🎮'),
];

const playBoard: Board = {
  id: PLAY_BOARD_ID,
  name: 'Play',
  grid: { rows: 2, columns: 2, order: gridOrder(playButtons.map((b) => b.id), 2, 2) },
  buttons: playButtons,
};

const peopleButtons: Item[] = [
  word('mum', 'Mum', 'people', '👩'),
  word('dad', 'Dad', 'people', '👨'),
  word('friend', 'friend', 'people', '🧑‍🤝‍🧑'),
  word('teacher', 'teacher', 'people', '🧑‍🏫'),
  word('me', 'me', 'people', '🙋'),
];

const peopleBoard: Board = {
  id: PEOPLE_BOARD_ID,
  name: 'People',
  grid: { rows: 3, columns: 3, order: gridOrder(peopleButtons.map((b) => b.id), 3, 3) },
  buttons: peopleButtons,
};

const placesButtons: Item[] = [
  word('home-place', 'home', 'places', '🏠'),
  word('school-place', 'school', 'places', '🏫'),
  word('park', 'park', 'places', '🌳'),
  word('shop', 'shop', 'places', '🏪'),
];

const placesBoard: Board = {
  id: PLACES_BOARD_ID,
  name: 'Places',
  // 3×3 rather than a tight 2×2: unlike the other starter boards this one
  // ships with zero spare slots otherwise, and Parent Mode's People/Places
  // records (Phase 4) add a real button here the moment one is saved.
  grid: { rows: 3, columns: 3, order: gridOrder(placesButtons.map((b) => b.id), 3, 3) },
  buttons: placesButtons,
};

const schoolButtons: Item[] = [
  word('pencil', 'pencil', 'things', '✏️'),
  word('school-book', 'book', 'things', '📚'),
  word('school-teacher', 'teacher', 'people', '🧑‍🏫'),
  word('break', 'break', 'things', '🕑'),
];

const schoolBoard: Board = {
  id: SCHOOL_BOARD_ID,
  name: 'School',
  grid: { rows: 2, columns: 2, order: gridOrder(schoolButtons.map((b) => b.id), 2, 2) },
  buttons: schoolButtons,
};

export const STARTER_BOARDS: Board[] = [
  rootBoard,
  foodBoard,
  foodDrinksBoard,
  feelingsBoard,
  playBoard,
  peopleBoard,
  placesBoard,
  schoolBoard,
];

/** Every button label across the starter vocabulary — the prediction candidate set. */
export function collectVocabularyWords(): string[] {
  const labels = STARTER_BOARDS.flatMap((board) => board.buttons.map((button) => button.label));
  return Array.from(new Set(labels));
}
