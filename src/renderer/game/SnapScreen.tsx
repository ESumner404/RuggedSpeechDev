import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { announceText } from '../speech/announce';
import { getAllBoards, wordStageSetting } from '../store/db';
import { PhotoThumbnail } from '../ui/PhotoThumbnail';
import type { Item } from '../store/types';
import { makeSnapDeck, type SnapDeck } from './snap';
import { gameWords } from './wordGame';
import { Pic } from '../symbols/Pic';

function Card({ item, label, empty }: { item?: Item | undefined; label: string; empty?: string }) {
  const image = item?.image;
  return (
    <button
      type="button"
      class="snap-card"
      disabled={!item}
      aria-label={item ? `${label}: ${item.label}` : label}
      onClick={() => item && announceText(item.label, { keepInHistory: false })}
    >
      {item ? (
        <>
          {image?.kind === 'photo' ? (
            <PhotoThumbnail class="snap-card__photo" blobId={image.blobId} alt="" />
          ) : (
            <Pic class="snap-card__emoji" char={image?.kind === 'emoji' ? image.char : ''} />
          )}
          <span class="snap-card__label">{item.label}</span>
        </>
      ) : (
        <span class="snap-card__empty">{empty}</span>
      )}
    </button>
  );
}

// Snap: turn a card; if it is the same as the one before, press SNAP. There
// is no clock, no other player to beat and no penalty. Pressing a card says
// its word, which is the point: the word is heard each time the picture is
// looked at. Nothing speaks unless something is pressed.
export function SnapScreen() {
  const deck = useSignal<SnapDeck | undefined | null>(null);
  const turn = useSignal(-1); // index of the card on the right; -1 before the first is turned
  const found = useSignal(0);
  // Whether the pair showing is a snap that has already been called, and so
  // cannot be called again.
  const called = useSignal(false);
  const message = useSignal('Turn a card to start.');
  const words = useSignal<Item[]>([]);

  function deal(available: Item[]): void {
    deck.value = makeSnapDeck(available);
    turn.value = -1;
    found.value = 0;
    called.value = false;
    message.value = 'Turn a card to start.';
  }

  useEffect(() => {
    void getAllBoards().then((boards) => {
      words.value = gameWords(boards, wordStageSetting.signal.value);
      deal(words.value);
    });
  }, []);

  if (deck.value === null) return null;
  const current = deck.value;
  if (!current) {
    return (
      <div class="game-screen game-screen--empty">
        <p class="game-screen__empty-title">Not enough words yet</p>
        <p class="game-screen__empty-note">Snap needs at least four words with pictures.</p>
      </div>
    );
  }

  const live: SnapDeck = current;
  const right = turn.value >= 0 ? current.cards[turn.value] : undefined;
  const left = turn.value >= 1 ? current.cards[turn.value - 1] : undefined;
  const isSnap = Boolean(left && right && left.id === right.id);
  const finished = turn.value === current.cards.length - 1;

  function turnCard(): void {
    // Turning on past a snap that was not called is fine; it just says so.
    const missed = isSnap && !called.value;
    turn.value += 1;
    called.value = false;
    message.value = missed ? 'Those two were the same, so that was a snap.' : '';
    const next = live.cards[turn.value];
    const before = live.cards[turn.value - 1];
    if (next && before && next.id === before.id) message.value = missed ? 'That was a snap. And here are two the same again.' : '';
  }

  function callSnap(): void {
    announceText('Snap!', { keepInHistory: false });
    if (turn.value < 0) return;
    if (isSnap && !called.value) {
      called.value = true;
      found.value += 1;
      message.value = `Snap! Two ${right!.label}.`;
    } else if (isSnap) {
      message.value = 'You have already called that one.';
    } else {
      message.value = 'Not the same this time. Keep looking.';
    }
  }

  return (
    <div class="game-screen snap-screen">
      <div class="snap-screen__cards">
        <Card item={left} label="Card before" empty={turn.value < 0 ? '' : 'First card'} />
        <Card item={right} label="New card" empty="" />
      </div>
      <p class="game-screen__message" role="status">
        {finished ? `${message.value} All done. Snaps found: ${found.value} of ${current.snaps}.` : message.value}
      </p>
      <div class="snap-screen__controls">
        <button type="button" class="snap-screen__snap" onClick={callSnap} disabled={turn.value < 0}>
          SNAP!
        </button>
        {finished ? (
          <button type="button" class="snap-screen__turn" onClick={() => deal(words.value)}>
            Play again
          </button>
        ) : (
          <button type="button" class="snap-screen__turn" onClick={turnCard}>
            {turn.value < 0 ? 'Turn a card' : 'Turn the next card'}
          </button>
        )}
      </div>
      <p class="game-screen__count">
        {turn.value < 0 ? 'No pressure. Take your time.' : `Card ${turn.value + 1} of ${current.cards.length}. Snaps found: ${found.value}`}
      </p>
    </div>
  );
}
