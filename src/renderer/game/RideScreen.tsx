import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { announceSentence, announceText } from '../speech/announce';
import { getAllBoards, wordStageSetting } from '../store/db';
import { PhotoThumbnail } from '../ui/PhotoThumbnail';
import type { Item } from '../store/types';
import { HINT_AFTER, LENGTHS, LEVELS, STEPS, VERBS, makeRide, progress, sentenceFor, type Hill, type Level, type StepKind } from './ride';
import { gameWords } from './wordGame';
import { Pic } from '../symbols/Pic';

// The scenery is drawn once and never moves. The train sits at a place along
// the track that changes in steps as words are chosen, never gliding, because
// movement on screen is a cost the rest of the app avoids.
const W = 600;
const H = 200;
const GROUND = 178;

const trackY = (x: number, hills: number): number => {
  const hillWidth = W / hills;
  const within = ((x % hillWidth) / hillWidth) * Math.PI;
  return GROUND - 22 - Math.sin(within) * 92;
};

const trackPath = (hills: number): string => {
  const points: string[] = [];
  for (let x = 0; x <= W; x += 5) points.push(`${x === 0 ? 'M' : 'L'}${x},${trackY(x, hills).toFixed(1)}`);
  return points.join(' ');
};

/** The angle of the track at a place along it, so the train tilts to follow it. */
const slope = (x: number, hills: number): number => {
  const a = trackY(Math.max(0, x - 3), hills);
  const b = trackY(Math.min(W, x + 3), hills);
  return (Math.atan2(b - a, 6) * 180) / Math.PI;
};

function Scenery({ hills, done, trainX }: { hills: number; done: number; trainX: number }) {
  const supports: number[] = [];
  for (let x = 14; x < W; x += 22) supports.push(x);
  const y = trackY(trainX, hills);
  const tilt = slope(trainX, hills);
  return (
    <>
      <rect width={W} height={H} fill="#bfe6ff" />
      <circle cx="540" cy="36" r="20" fill="#fde047" />
      <g fill="#ffffff">
        <ellipse cx="90" cy="38" rx="34" ry="12" />
        <ellipse cx="116" cy="30" rx="22" ry="11" />
        <ellipse cx="330" cy="26" rx="30" ry="10" />
        <ellipse cx="352" cy="20" rx="20" ry="9" />
      </g>
      <path d={`M0 ${GROUND - 40} Q80 ${GROUND - 80} 170 ${GROUND - 44} T340 ${GROUND - 50} T520 ${GROUND - 46} T${W} ${GROUND - 56} V${H} H0 Z`} fill="#a7d8a0" />
      <rect y={GROUND} width={W} height={H - GROUND} fill="#4ade80" />
      {supports.map((x) => (
        <line key={x} x1={x} y1={trackY(x, hills)} x2={x} y2={GROUND} stroke="#92400e" stroke-width="3" />
      ))}
      <path d={trackPath(hills)} fill="none" stroke="#7c2d12" stroke-width="7" stroke-linecap="round" />
      <path d={trackPath(hills)} fill="none" stroke="#fbbf24" stroke-width="2" stroke-dasharray="6 6" />
      {/* A flag on top of each hill; green once that sentence is built */}
      {Array.from({ length: hills }, (_, i) => {
        const cx = ((i + 0.5) * W) / hills;
        const top = trackY(cx, hills);
        return (
          <g key={i}>
            <line x1={cx} y1={top} x2={cx} y2={top - 26} stroke="#374151" stroke-width="2" />
            <path d={`M${cx} ${top - 26} l16 6 l-16 6 z`} class={i < done ? 'ride-screen__flag ride-screen__flag--done' : 'ride-screen__flag'} />
          </g>
        );
      })}
      {/* Station at the start */}
      <rect x="2" y={GROUND - 30} width="30" height="30" fill="#f87171" stroke="#7f1d1d" stroke-width="2" />
      <path d={`M-2 ${GROUND - 30} L17 ${GROUND - 46} L36 ${GROUND - 30} Z`} fill="#b91c1c" />
      {/* The train: three cars with riders */}
      <g transform={`translate(${trainX} ${y}) rotate(${tilt}) scale(1.35)`}>
        {[-34, 0, 34].map((dx) => (
          <g key={dx} transform={`translate(${dx} 0)`}>
            <rect x="-15" y="-22" width="30" height="16" rx="5" fill="#ef4444" stroke="#7f1d1d" stroke-width="2" />
            <circle cx="-8" cy="-3" r="4" fill="#374151" />
            <circle cx="8" cy="-3" r="4" fill="#374151" />
            <text x="0" y="-24" font-size="17" text-anchor="middle">
              {dx === -34 ? '😀' : dx === 0 ? '😄' : '🙂'}
            </text>
          </g>
        ))}
      </g>
    </>
  );
}

// Rollercoaster: build short sentences, one for each hill of the ride. Choose
// how long they are, then press the words. Each word moves the train along.
// Every word pressed is said, because someone pressed it; a finished sentence
// is only said when "Say it all" is pressed. A word that is not the one wanted
// is just not used yet, and after two wrong tries the right one is outlined,
// so nobody is left stuck. Nothing counts against anyone.
export function RideScreen() {
  const words = useSignal<Item[]>([]);
  const loaded = useSignal(false);
  const level = useSignal<Level>('three');
  const hillCount = useSignal(5);
  const ride = useSignal<Hill[] | undefined>(undefined);
  const riding = useSignal(false);
  const hill = useSignal(0);
  const done = useSignal<string[]>([]);
  const started = useSignal(false);
  const verb = useSignal<string | null>(null);
  const describer = useSignal<string | null>(null);
  const thing = useSignal<Item | null>(null);
  const wrongTries = useSignal(0);
  const picturesOnWords = useSignal(false);
  const message = useSignal('');

  useEffect(() => {
    void getAllBoards().then((boards) => {
      words.value = gameWords(boards, wordStageSetting.signal.value);
      loaded.value = true;
    });
  }, []);

  if (!loaded.value) return null;

  const steps = STEPS[level.value];
  const possible = makeRide(words.value, 3) !== undefined;

  function resetHill(): void {
    started.value = false;
    verb.value = null;
    describer.value = null;
    thing.value = null;
    wrongTries.value = 0;
    message.value = '';
  }

  function begin(): void {
    const made = makeRide(words.value, hillCount.value);
    if (!made) return;
    ride.value = made;
    hill.value = 0;
    done.value = [];
    resetHill();
    riding.value = true;
  }

  function say(text: string): void {
    announceText(text, { keepInHistory: false });
  }

  if (!possible) {
    return (
      <div class="game-screen game-screen--empty">
        <p class="game-screen__empty-title">Not enough words yet</p>
        <p class="game-screen__empty-note">The rollercoaster needs more words with pictures.</p>
      </div>
    );
  }

  // Choosing the ride.
  if (!riding.value) {
    return (
      <div class="game-screen ride-screen ride-setup">
        <svg class="ride-screen__track" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="A rollercoaster">
          <Scenery hills={5} done={0} trainX={30} />
        </svg>
        <p class="game-screen__message">How long are the sentences?</p>
        <div class="ride-setup__row" role="group" aria-label="Sentence length">
          {LEVELS.map((entry) => (
            <button
              type="button"
              key={entry.id}
              class={`ride-setup__choice${level.value === entry.id ? ' ride-setup__choice--on' : ''}`}
              aria-pressed={level.value === entry.id}
              onClick={() => (level.value = entry.id)}
            >
              <strong>{entry.label}</strong>
              <span>{entry.example}</span>
            </button>
          ))}
        </div>
        <div class="ride-setup__row" role="group" aria-label="Ride length">
          {LENGTHS.map((entry) => (
            <button
              type="button"
              key={entry.hills}
              class={`ride-setup__choice${hillCount.value === entry.hills ? ' ride-setup__choice--on' : ''}`}
              aria-pressed={hillCount.value === entry.hills}
              onClick={() => (hillCount.value = entry.hills)}
            >
              <strong>{entry.label}</strong>
              <span>{entry.hills} hills</span>
            </button>
          ))}
        </div>
        <button type="button" class="snap-screen__turn ride-setup__go" onClick={begin}>
          Start the ride
        </button>
      </div>
    );
  }

  const hills = ride.value!;
  const total = hills.length;
  const finishedRide = hill.value >= total;
  const current = finishedRide ? undefined : hills[hill.value];

  // Where we are in this sentence: the first step not yet done.
  const isDone = (kind: StepKind): boolean =>
    kind === 'start' ? started.value : kind === 'verb' ? Boolean(verb.value) : kind === 'describer' ? Boolean(describer.value) : Boolean(thing.value);
  const nowIndex = steps.findIndex((kind) => !isDone(kind));
  const nowStep: StepKind | 'ready' = nowIndex === -1 ? 'ready' : steps[nowIndex]!;
  const stepsDone = steps.filter(isDone).length;
  const along = finishedRide ? 1 : progress(hill.value, stepsDone, steps.length, total);
  const trainX = Math.round(55 + along * (W - 110));
  const sentence = sentenceFor(level.value, { verb: verb.value, describer: describer.value, thing: thing.value?.label ?? null, started: started.value });
  const hint = wrongTries.value >= HINT_AFTER;

  function pressStart(): void {
    say('I');
    if (nowStep === 'start') started.value = true;
  }
  function chooseVerb(word: string): void {
    say(word);
    if (nowStep === 'verb') verb.value = word;
  }
  function chooseDescriber(word: string): void {
    say(word);
    if (nowStep === 'describer') describer.value = word;
  }
  function chooseThing(option: Item): void {
    say(option.label);
    if (nowStep !== 'thing') return;
    if (option.id === current!.target.id) {
      thing.value = option;
      wrongTries.value = 0;
      message.value = '';
    } else {
      wrongTries.value += 1;
      message.value = wrongTries.value >= HINT_AFTER ? 'Look at the word with the pointer.' : 'Not that one. Try another.';
    }
  }
  function nextHill(): void {
    done.value = [...done.value, sentence];
    hill.value += 1;
    resetHill();
  }
  function sayAll(): void {
    announceSentence(done.value);
  }

  const image = current?.target.image;
  const prompts: Record<StepKind | 'ready', string> = {
    start: 'Press “I” to start the hill.',
    verb: 'What do you do? Choose a word.',
    describer: 'Choose a describing word.',
    thing: 'Which word is the picture?',
    ready: 'Up the hill! Say it all, then go on.',
  };

  return (
    <div class="game-screen ride-screen">
      <svg class="ride-screen__track" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Rollercoaster: hill ${Math.min(hill.value + 1, total)} of ${total}`}>
        <Scenery hills={total} done={hill.value} trainX={trainX} />
      </svg>

      {finishedRide ? (
        <>
          <p class="game-screen__message" role="status">
            You have been all the way round the track.
          </p>
          <ol class="ride-screen__tickets" aria-label="Your sentences">
            {done.value.map((text, index) => (
              <li class="ride-screen__ticket" key={index}>
                🎟️ {text}
              </li>
            ))}
          </ol>
          <div class="snap-screen__controls">
            <button type="button" class="snap-screen__turn" onClick={sayAll}>
              Say my sentences
            </button>
            <button type="button" class="snap-screen__turn" onClick={begin}>
              Ride again
            </button>
          </div>
          <button type="button" class="game-screen__button" onClick={() => (riding.value = false)}>
            Change the ride
          </button>
        </>
      ) : (
        <>
          <div class="ride-screen__row">
            <div class="ride-screen__picture" aria-label="Find the word for this picture" role="img">
              {image?.kind === 'photo' ? (
                <PhotoThumbnail class="game-screen__photo" blobId={image.blobId} alt="" />
              ) : (
                <Pic class="game-screen__emoji" char={image?.kind === 'emoji' ? image.char : ''} />
              )}
            </div>
            <ol class="ride-screen__tickets ride-screen__tickets--side" aria-label="Sentences so far">
              {done.value.map((text, index) => (
                <li class="ride-screen__ticket" key={index}>
                  🎟️ {text}
                </li>
              ))}
            </ol>
          </div>
          <p class="ride-screen__sentence" aria-live="polite">
            {sentence || ' '}
          </p>
          <p class="game-screen__message" role="status">
            {message.value || prompts[nowStep]}
          </p>

          <div class="ride-screen__choices">
            {nowStep === 'start' && (
              <button type="button" class="game-option ride-screen__choice" onClick={pressStart}>
                I
              </button>
            )}
            {nowStep === 'verb' &&
              VERBS.map((word) => (
                <button type="button" class="game-option ride-screen__choice" key={word} onClick={() => chooseVerb(word)}>
                  {word}
                </button>
              ))}
            {nowStep === 'describer' &&
              current!.describers.map((word) => (
                <button type="button" class="game-option ride-screen__choice" key={word} onClick={() => chooseDescriber(word)}>
                  {word}
                </button>
              ))}
            {nowStep === 'thing' &&
              current!.options.map((option) => {
                const pointed = hint && option.id === current!.target.id;
                return (
                  <button
                    type="button"
                    class={`game-option ride-screen__choice${pointed ? ' ride-screen__choice--hint' : ''}`}
                    key={option.id}
                    onClick={() => chooseThing(option)}
                  >
                    {pointed && <span class="ride-screen__pointer" aria-hidden="true">👉</span>}
                    {picturesOnWords.value && option.image?.kind === 'emoji' && (
                      <Pic class="game-option__emoji" char={option.image.char} />
                    )}
                    {option.label}
                  </button>
                );
              })}
            {nowStep === 'ready' && (
              <>
                <button type="button" class="game-option ride-screen__choice" onClick={() => say(sentence)}>
                  Say it all
                </button>
                <button type="button" class="game-option ride-screen__choice" onClick={nextHill}>
                  {hill.value === total - 1 ? 'To the end' : 'Next hill'}
                </button>
              </>
            )}
          </div>
          <div class="ride-screen__foot">
            <p class="game-screen__count">
              Hill {hill.value + 1} of {total}.
            </p>
            <button
              type="button"
              class="game-screen__button"
              aria-pressed={picturesOnWords.value}
              onClick={() => (picturesOnWords.value = !picturesOnWords.value)}
            >
              {picturesOnWords.value ? 'Words only' : 'Pictures on the words'}
            </button>
            <button type="button" class="game-screen__button" onClick={() => (riding.value = false)}>
              Change the ride
            </button>
          </div>
        </>
      )}
    </div>
  );
}
