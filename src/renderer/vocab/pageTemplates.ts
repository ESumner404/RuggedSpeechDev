import type { FitzgeraldClass } from '../ui/fitzgerald';
import { SEASONS, seasonTemplate } from './seasons';

export type PageButtonSpec = {
  label: string;
  emoji?: string;
  /** What it says, when that is more than the label. */
  says?: string;
  colour?: FitzgeraldClass;
};

export type PageTemplate = {
  id: string;
  name: string;
  description: string;
  buttons: PageButtonSpec[];
};

// Starting points for My Pages: the commonest things families and classrooms
// build for themselves, so nobody starts from an empty grid. Every one is an
// ordinary page once made, to change as needed. Like the starter vocabulary,
// the wording is a placeholder for a speech and language therapist to review
// before a child relies on it.
export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    id: 'snacks',
    name: 'Snack choices',
    description: 'Pick a snack. Replace these with the ones that are really on offer.',
    buttons: [
      { label: 'apple', emoji: '🍎', says: 'I want an apple' },
      { label: 'banana', emoji: '🍌', says: 'I want a banana' },
      { label: 'biscuit', emoji: '🍪', says: 'I want a biscuit' },
      { label: 'cheese', emoji: '🧀', says: 'I want cheese' },
      { label: 'grapes', emoji: '🍇', says: 'I want grapes' },
      { label: 'carrot', emoji: '🥕', says: 'I want a carrot' },
      { label: 'nothing', emoji: '🚫', says: 'I do not want a snack', colour: 'noStop' },
    ],
  },
  {
    id: 'drinks',
    name: 'Drink choices',
    description: 'A few drinks to choose between.',
    buttons: [
      { label: 'water', emoji: '💧', says: 'I want water' },
      { label: 'milk', emoji: '🥛', says: 'I want milk' },
      { label: 'juice', emoji: '🧃', says: 'I want juice' },
      { label: 'squash', emoji: '🥤', says: 'I want squash' },
    ],
  },
  {
    id: 'playground',
    name: 'Playground',
    description: 'Things to ask for or say outside.',
    buttons: [
      { label: 'ball', emoji: '⚽', colour: 'things', says: 'I want the ball' },
      { label: 'bike', emoji: '🚲', colour: 'things', says: 'I want the bike' },
      { label: 'run', emoji: '🏃', colour: 'doing', says: 'I want to run' },
      { label: 'climb', emoji: '🤸', colour: 'doing', says: 'I want to climb' },
      { label: 'roundabout', emoji: '🎠', colour: 'things', says: 'I want the roundabout' },
      { label: 'my turn', emoji: '👆', colour: 'social', says: 'It is my turn' },
      { label: 'your turn', emoji: '🤝', colour: 'social', says: 'It is your turn' },
      { label: 'stop', emoji: '✋', colour: 'noStop', says: 'Stop, please' },
      { label: 'inside', emoji: '🏠', colour: 'places', says: 'I want to go inside' },
    ],
  },
  {
    id: 'classroom',
    name: 'Classroom requests',
    description: 'Things to ask for in a lesson.',
    buttons: [
      { label: 'help', emoji: '🙋', colour: 'social', says: 'I need help' },
      { label: 'question', emoji: '❓', colour: 'social', says: 'I have a question' },
      { label: 'break', emoji: '⏸️', colour: 'social', says: 'I need a break' },
      { label: 'toilet', emoji: '🚻', colour: 'places', says: 'I need the toilet' },
      { label: 'drink', emoji: '💧', colour: 'things', says: 'Can I have a drink?' },
      { label: 'pencil', emoji: '✏️', colour: 'things', says: 'I need a pencil' },
      { label: 'say again', emoji: '🔁', colour: 'social', says: 'Can you say that again, please?' },
      { label: 'finished', emoji: '✅', colour: 'social', says: "I've finished" },
      { label: "don't understand", emoji: '🤔', colour: 'social', says: "I don't understand" },
    ],
  },
  {
    id: 'manners',
    name: 'Hello and thank you',
    description: 'Greetings and manners.',
    buttons: [
      { label: 'hello', emoji: '👋', colour: 'social', says: 'Hello' },
      { label: 'goodbye', emoji: '👋', colour: 'social', says: 'Goodbye' },
      { label: 'please', emoji: '🙏', colour: 'social', says: 'Please' },
      { label: 'thank you', emoji: '😊', colour: 'social', says: 'Thank you' },
      { label: 'sorry', emoji: '😔', colour: 'social', says: 'Sorry' },
      { label: 'excuse me', emoji: '🙇', colour: 'social', says: 'Excuse me' },
      { label: 'how are you?', emoji: '💬', colour: 'social', says: 'How are you?' },
      { label: "I'm fine", emoji: '👍', colour: 'social', says: "I'm fine, thank you" },
      { label: 'well done', emoji: '👏', colour: 'social', says: 'Well done' },
    ],
  },
  {
    id: 'dressing',
    name: 'Getting dressed',
    description: 'What to put on, in the order of the morning.',
    buttons: [
      { label: 'top', emoji: '👕', says: 'Put my top on' },
      { label: 'trousers', emoji: '👖', says: 'Put my trousers on' },
      { label: 'socks', emoji: '🧦', says: 'Put my socks on' },
      { label: 'shoes', emoji: '👟', says: 'Put my shoes on' },
      { label: 'coat', emoji: '🧥', says: 'Put my coat on' },
      { label: 'hat', emoji: '🧢', says: 'Put my hat on' },
      { label: 'help', emoji: '🙋', colour: 'social', says: 'Please help me' },
      { label: 'all done', emoji: '✅', colour: 'social', says: "I'm all dressed" },
    ],
  },
  {
    id: 'bedtime',
    name: 'Bedtime',
    description: 'The steps before sleep.',
    buttons: [
      { label: 'bath', emoji: '🛁', says: 'I want a bath' },
      { label: 'teeth', emoji: '🪥', says: 'I am brushing my teeth' },
      { label: 'story', emoji: '📖', says: 'I want a story' },
      { label: 'teddy', emoji: '🧸', says: 'I want my teddy' },
      { label: 'drink', emoji: '🥛', says: 'I want a drink' },
      { label: 'light', emoji: '💡', says: 'Can I have the light on?' },
      { label: 'cuddle', emoji: '🤗', colour: 'social', says: 'I want a cuddle' },
      { label: 'goodnight', emoji: '😴', colour: 'social', says: 'Goodnight' },
    ],
  },
  {
    id: 'cafe',
    name: 'Café or shop',
    description: 'Ordering and paying.',
    buttons: [
      { label: "I'd like…", emoji: '👉', colour: 'doing', says: "I'd like" },
      { label: 'menu', emoji: '📋', colour: 'things', says: 'Can I see the menu?' },
      { label: 'water', emoji: '💧', colour: 'things', says: 'Can I have some water?' },
      { label: 'the bill', emoji: '🧾', colour: 'things', says: 'Can I have the bill, please?' },
      { label: 'pay by card', emoji: '💳', colour: 'doing', says: 'I would like to pay by card' },
      { label: 'toilet', emoji: '🚻', colour: 'places', says: 'Where is the toilet?' },
      { label: 'thank you', emoji: '😊', colour: 'social', says: 'Thank you' },
      { label: 'too loud', emoji: '🔊', colour: 'describing', says: "It's too loud in here" },
    ],
  },
  {
    id: 'appointment',
    name: 'Doctor or dentist',
    description: 'Telling someone how you feel during a visit.',
    buttons: [
      { label: 'it hurts', emoji: '🤕', colour: 'describing', says: 'It hurts' },
      { label: "I'm scared", emoji: '😨', colour: 'describing', says: "I'm feeling scared" },
      { label: 'stop', emoji: '✋', colour: 'noStop', says: 'Please stop' },
      { label: 'break', emoji: '⏸️', colour: 'social', says: 'I need a break' },
      { label: 'ready', emoji: '✅', colour: 'social', says: "I'm ready" },
      { label: 'tell me first', emoji: '🗣️', colour: 'social', says: 'Please tell me what you are going to do' },
      { label: 'one more', emoji: '☝️', colour: 'social', says: 'One more, please' },
      { label: 'all done', emoji: '🎉', colour: 'social', says: 'All done' },
    ],
  },
  {
    id: 'maths',
    name: 'Maths lesson',
    description: 'Words for number work.',
    buttons: [
      { label: 'add', emoji: '➕', colour: 'doing', says: 'Add' },
      { label: 'take away', emoji: '➖', colour: 'doing', says: 'Take away' },
      { label: 'more', emoji: '⬆️', colour: 'describing', says: 'More' },
      { label: 'less', emoji: '⬇️', colour: 'describing', says: 'Less' },
      { label: 'the same', emoji: '🟰', colour: 'describing', says: 'The same' },
      { label: 'count', emoji: '🔢', colour: 'doing', says: 'Count' },
      { label: 'big', emoji: '🐘', colour: 'describing', says: 'Big' },
      { label: 'small', emoji: '🐭', colour: 'describing', says: 'Small' },
      { label: 'I know', emoji: '💡', colour: 'social', says: 'I know the answer' },
    ],
  },
  {
    id: 'science',
    name: 'Science and nature',
    description: 'Looking, finding out and talking about what happens.',
    buttons: [
      { label: 'look', emoji: '👀', colour: 'doing', says: 'Look' },
      { label: 'plant', emoji: '🌱', colour: 'things', says: 'Plant' },
      { label: 'water', emoji: '💧', colour: 'things', says: 'Water' },
      { label: 'hot', emoji: '🥵', colour: 'describing', says: 'Hot' },
      { label: 'cold', emoji: '🥶', colour: 'describing', says: 'Cold' },
      { label: 'sink', emoji: '⬇️', colour: 'doing', says: 'It sinks' },
      { label: 'float', emoji: '🛶', colour: 'doing', says: 'It floats' },
      { label: 'what happens?', emoji: '❓', colour: 'social', says: 'What happens next?' },
      { label: 'it grew', emoji: '🌻', colour: 'describing', says: 'It grew' },
    ],
  },
  {
    id: 'story',
    name: 'Story time',
    description: 'Joining in with a book.',
    buttons: [
      { label: 'again', emoji: '🔁', colour: 'social', says: 'Read it again' },
      { label: 'turn the page', emoji: '📖', colour: 'doing', says: 'Turn the page' },
      { label: 'who?', emoji: '🧑', colour: 'social', says: 'Who is that?' },
      { label: 'what next?', emoji: '❓', colour: 'social', says: 'What happens next?' },
      { label: 'I like it', emoji: '😊', colour: 'social', says: 'I like this story' },
      { label: 'funny', emoji: '😄', colour: 'describing', says: 'That is funny' },
      { label: 'scary', emoji: '😨', colour: 'describing', says: 'That is scary' },
      { label: 'the end', emoji: '🏁', colour: 'social', says: 'The end' },
    ],
  },
  {
    id: 'pe',
    name: 'PE and movement',
    description: 'Getting ready and joining in.',
    buttons: [
      { label: 'run', emoji: '🏃', colour: 'doing', says: 'Run' },
      { label: 'jump', emoji: '🦘', colour: 'doing', says: 'Jump' },
      { label: 'throw', emoji: '🤾', colour: 'doing', says: 'Throw' },
      { label: 'catch', emoji: '🥎', colour: 'doing', says: 'Catch' },
      { label: 'my turn', emoji: '🙋', colour: 'social', says: 'It is my turn' },
      { label: 'tired', emoji: '😴', colour: 'describing', says: 'I am tired' },
      { label: 'drink', emoji: '💧', colour: 'things', says: 'I need a drink' },
      { label: 'shoes', emoji: '👟', colour: 'things', says: 'I need my shoes' },
      { label: 'rest', emoji: '🪑', colour: 'doing', says: 'I need a rest' },
    ],
  },
  {
    id: 'art',
    name: 'Art and making',
    description: 'Things to use and say while making something.',
    buttons: [
      { label: 'paint', emoji: '🎨', colour: 'things', says: 'I want paint' },
      { label: 'pencil', emoji: '✏️', colour: 'things', says: 'I want a pencil' },
      { label: 'scissors', emoji: '✂️', colour: 'things', says: 'I need scissors' },
      { label: 'glue', emoji: '🧴', colour: 'things', says: 'I need glue' },
      { label: 'paper', emoji: '📄', colour: 'things', says: 'I need paper' },
      { label: 'colour', emoji: '🌈', colour: 'describing', says: 'What colour?' },
      { label: 'messy', emoji: '🖐️', colour: 'describing', says: 'My hands are messy' },
      { label: 'wash hands', emoji: '🧼', colour: 'doing', says: 'I need to wash my hands' },
      { label: 'finished', emoji: '✅', colour: 'social', says: "I've finished" },
    ],
  },
  {
    id: 'lunch',
    name: 'Lunchtime',
    description: 'Choosing, asking and saying when you have had enough.',
    buttons: [
      { label: 'hungry', emoji: '😋', colour: 'describing', says: 'I am hungry' },
      { label: 'thirsty', emoji: '🥤', colour: 'describing', says: 'I am thirsty' },
      { label: 'more', emoji: '➕', colour: 'littleWords', says: 'More, please' },
      { label: 'no thank you', emoji: '🚫', colour: 'noStop', says: 'No thank you' },
      { label: 'all done', emoji: '🏁', colour: 'social', says: 'I have finished' },
      { label: 'I like it', emoji: '😊', colour: 'social', says: 'I like this' },
      { label: "I don't like it", emoji: '😖', colour: 'describing', says: "I don't like this" },
      { label: 'hot', emoji: '🥵', colour: 'describing', says: 'It is too hot' },
      { label: 'help', emoji: '🆘', colour: 'social', says: 'Can you help me, please?' },
    ],
  },
  {
    id: 'assembly',
    name: 'Assembly and quiet times',
    description: 'Things to say when it is busy, loud or long.',
    buttons: [
      { label: 'too loud', emoji: '🔊', colour: 'describing', says: 'It is too loud' },
      { label: 'quiet please', emoji: '🤫', colour: 'social', says: 'I need quiet' },
      { label: 'headphones', emoji: '🎧', colour: 'things', says: 'I need my headphones' },
      { label: 'leave', emoji: '🚪', colour: 'doing', says: 'I need to leave for a bit' },
      { label: 'sit near', emoji: '🪑', colour: 'places', says: 'Can I sit near the door?' },
      { label: 'how long?', emoji: '⏱️', colour: 'social', says: 'How long is left?' },
      { label: 'nearly done', emoji: '🔜', colour: 'social', says: 'Is it nearly finished?' },
      { label: 'I can do it', emoji: '💪', colour: 'social', says: 'I can stay' },
    ],
  },
  {
    id: 'computing',
    name: 'Computers and tablets',
    description: 'Using a screen in a lesson.',
    buttons: [
      { label: 'my turn', emoji: '🙋', colour: 'social', says: 'Can I have a turn?' },
      { label: 'click', emoji: '🖱️', colour: 'doing', says: 'Click' },
      { label: 'type', emoji: '⌨️', colour: 'doing', says: 'Type' },
      { label: 'save', emoji: '💾', colour: 'doing', says: 'Save it' },
      { label: 'print', emoji: '🖨️', colour: 'doing', says: 'Print it' },
      { label: 'stuck', emoji: '🤔', colour: 'social', says: "I'm stuck" },
      { label: 'it has frozen', emoji: '🧊', colour: 'describing', says: 'It has frozen' },
      { label: 'help', emoji: '🆘', colour: 'social', says: 'I need help' },
    ],
  },
  {
    id: 'working-together',
    name: 'Working with a friend',
    description: 'Sharing, asking and taking turns.',
    buttons: [
      { label: 'share', emoji: '🤝', colour: 'social', says: 'Can we share?' },
      { label: 'my turn', emoji: '🙋', colour: 'social', says: 'It is my turn' },
      { label: 'your turn', emoji: '👉', colour: 'social', says: 'It is your turn' },
      { label: 'together', emoji: '👫', colour: 'social', says: 'Let us do it together' },
      { label: 'good idea', emoji: '💡', colour: 'social', says: 'That is a good idea' },
      { label: 'can I help?', emoji: '🙌', colour: 'social', says: 'Can I help?' },
      { label: 'wait', emoji: '✋', colour: 'noStop', says: 'Please wait' },
      { label: 'sorry', emoji: '😔', colour: 'social', says: 'Sorry' },
    ],
  },
  {
    id: 'calm-down',
    name: 'Feeling too much',
    description: 'What a child might need to say when things are a lot.',
    buttons: [
      { label: 'break', emoji: '⏸️', colour: 'social', says: 'I need a break' },
      { label: 'quiet space', emoji: '🛋️', colour: 'places', says: 'I need a quiet space' },
      { label: 'too much', emoji: '🌊', colour: 'describing', says: 'It is too much' },
      { label: 'need a hug', emoji: '🤗', colour: 'social', says: 'I need a hug' },
      { label: 'need space', emoji: '↔️', colour: 'social', says: 'I need some space' },
      { label: 'breathe', emoji: '🌬️', colour: 'doing', says: 'I want to breathe slowly' },
      { label: 'tell someone', emoji: '🗣️', colour: 'social', says: 'I want to tell someone' },
      { label: 'ready now', emoji: '✅', colour: 'social', says: 'I am ready now' },
    ],
  },
  ...SEASONS.map(seasonTemplate),
];
