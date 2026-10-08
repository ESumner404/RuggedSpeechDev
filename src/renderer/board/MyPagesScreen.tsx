import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { clearAfterSpeakSetting, getBoard, getMyPages, pressMode } from '../store/db';
import type { Board, Item, MyPage } from '../store/types';
import { announceItem, announceSentence } from '../speech/announce';
import { recordPress } from '../store/usage';
import { Grid } from './Grid';
import { SentenceStrip, type SentenceChip } from './SentenceStrip';

type Props = {
  onExit: () => void;
};

// Fully custom pages, built from scratch in Parent Mode (feature review
// follow-up, Sep 2026), the fifth Home tile, filled in for real. A page is
// a single flat board (no folders), so building and speaking a sentence
// here works exactly like Talk, just over whatever an adult has put on the
// page rather than the built-in vocabulary tree.
export function MyPagesScreen({ onExit }: Props) {
  const pages = useSignal<MyPage[]>([]);
  const loaded = useSignal(false);
  const selectedPageId = useSignal<string | null>(null);
  const board = useSignal<Board | null>(null);
  const sentence = useSignal<SentenceChip[]>([]);
  const speakingChipId = useSignal<string | null>(null);

  useEffect(() => {
    void getMyPages().then((loadedPages) => {
      pages.value = loadedPages;
      // One page needs no picker step, a family with a single page
      // shouldn't pay an extra tap every time just because the data model
      // technically allows more than one (invariant I3: consistent
      // position, not consistent friction).
      if (loadedPages.length === 1) selectedPageId.value = loadedPages[0]!.id;
      loaded.value = true;
    });
  }, []);

  useEffect(() => {
    const page = pages.value.find((candidate) => candidate.id === selectedPageId.value);
    if (!page) {
      board.value = null;
      return;
    }
    void getBoard(page.boardId).then((loadedBoard) => (board.value = loadedBoard ?? null));
  }, [selectedPageId.value]);

  function handlePress(item: Item): void {
    // Same press mode as Talk (an adult's choice in Parent Mode), same
    // muscle memory: by default a press only adds to the sentence.
    void recordPress(item.label);
    const mode = pressMode.value;
    if (mode !== 'speak') {
      sentence.value = [...sentence.value, { chipId: crypto.randomUUID(), item }];
    }
    if (mode !== 'sentence') void announceItem(item);
  }

  function handleRemoveChip(chipId: string): void {
    sentence.value = sentence.value.filter((chip) => chip.chipId !== chipId);
  }

  function handleClearSentence(): void {
    sentence.value = [];
  }

  function handleSpeak(): void {
    const words = sentence.value.map((chip) => chip.item.vocalization ?? chip.item.label);
    if (words.length === 0) return;
    const chipIds = sentence.value.map((chip) => chip.chipId);
    announceSentence(words, (index) => (speakingChipId.value = index === null ? null : (chipIds[index] ?? null)));
    if (clearAfterSpeakSetting.signal.value) sentence.value = [];
  }

  function handleBack(): void {
    if (pages.value.length > 1 && selectedPageId.value) {
      selectedPageId.value = null;
      sentence.value = [];
      return;
    }
    onExit();
  }

  if (!loaded.value) {
    return <p class="talk-screen__loading">Loading…</p>;
  }

  if (pages.value.length === 0) {
    return (
      <div class="my-pages-screen my-pages-screen--empty">
        <p class="my-pages-screen__empty-title">No pages yet</p>
        <p class="my-pages-screen__empty-note">An adult can add one in Parent Mode.</p>
        <nav class="talk-screen__nav">
          <button type="button" class="talk-screen__nav-button" onClick={onExit}>
            Home
          </button>
        </nav>
      </div>
    );
  }

  if (!selectedPageId.value) {
    return (
      <div class="my-pages-screen">
        <div class="my-pages-screen__picker">
          {pages.value.map((page) => (
            <button
              type="button"
              class="my-pages-screen__picker-button"
              key={page.id}
              onClick={() => (selectedPageId.value = page.id)}
            >
              {page.name}
            </button>
          ))}
        </div>
        <nav class="talk-screen__nav">
          <button type="button" class="talk-screen__nav-button" onClick={onExit}>
            Home
          </button>
        </nav>
      </div>
    );
  }

  return (
    <div class="talk-screen">
      <SentenceStrip
        chips={sentence.value}
        onRemove={handleRemoveChip}
        onClear={handleClearSentence}
        onSpeak={handleSpeak}
        speakingChipId={speakingChipId.value}
      />
      <div class="talk-screen__grid">
        {board.value ? (
          <Grid
            board={board.value}
            onPress={handlePress}
            auxiliaryControls={[
              { label: 'Clear all', onActivate: handleClearSentence },
              { label: 'Speak', onActivate: handleSpeak },
            ]}
          />
        ) : (
          <p class="talk-screen__loading">Loading…</p>
        )}
      </div>
      <nav class="talk-screen__nav">
        <button type="button" class="talk-screen__nav-button" onClick={onExit}>
          Home
        </button>
        <button type="button" class="talk-screen__nav-button" onClick={handleBack}>
          Back
        </button>
      </nav>
    </div>
  );
}
