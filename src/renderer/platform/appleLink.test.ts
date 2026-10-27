import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Board } from '../store/types';
import { OPENABLE_SCREENS, buildLinkState, buildSentenceMessage, buildSyncMessage, parseCommand, startLink } from './appleLink';

describe('what another device may ask for', () => {
  it('may open the ordinary pages and nothing else', () => {
    for (const screen of OPENABLE_SCREENS) expect(parseCommand({ type: 'open', screen })).toEqual({ kind: 'open', screen });
    for (const screen of ['parent', 'school', 'home', '', '../x', 'Game']) {
      expect(parseCommand({ type: 'open', screen }), screen).toBeNull();
    }
  });

  it('may change the traffic light, to a real colour only', () => {
    expect(parseCommand({ type: 'traffic', status: 'red' })).toEqual({ kind: 'traffic', status: 'red' });
    expect(parseCommand({ type: 'traffic', status: 'purple' })).toBeNull();
    expect(parseCommand({ type: 'traffic' })).toBeNull();
  });

  it('can never ask for anything to be spoken', () => {
    expect(parseCommand({ type: 'speak', text: 'hello' })).toBeNull();
    expect(parseCommand({ type: 'say', text: 'hello' })).toBeNull();
  });
});

describe('what this device tells the others', () => {
  const plan = [
    { id: 'a', name: 'Breakfast', time: '08:00', finished: true },
    { id: 'b', name: 'School' },
    { id: 'c', name: 'Swimming', time: '15:30' },
  ];

  it('says which page is open, the traffic light, now and next, and the day', () => {
    const state = buildLinkState({ screen: 'myday', traffic: 'amber', plan, favourites: [] });
    expect(state).toMatchObject({ type: 'state', screen: 'myday', traffic: 'amber', now: 'School', next: 'Swimming' });
    expect(state['today']).toEqual([
      { name: 'Breakfast', time: '08:00', done: true },
      { name: 'School', time: null, done: false },
      { name: 'Swimming', time: '15:30', done: false },
    ]);
  });

  it('sends Favourites as words, picture and colour, and nothing the child has said', () => {
    const state = buildLinkState({
      screen: 'home',
      traffic: 'off',
      plan: [],
      favourites: [
        { id: 'w1', label: 'juice', image: { kind: 'emoji', char: '🧃' }, background_color: '#fed7aa', vocalization: 'apple juice' },
        { id: 'w2', label: 'mum' },
      ],
    });
    expect(state['favourites']).toEqual([
      { id: 'w1', label: 'juice', spoken: 'apple juice', emoji: '🧃', colour: 0xfed7aa },
      { id: 'w2', label: 'mum', spoken: 'mum', emoji: '', colour: 0xfef08a },
    ]);
    expect(Object.keys(state).sort()).toEqual(['favourites', 'next', 'now', 'screen', 'today', 'traffic', 'type']);
  });

  it('keeps to a sensible size', () => {
    const many = Array.from({ length: 80 }, (_, i) => ({ id: `${i}`, name: `Thing ${i}` }));
    const state = buildLinkState({ screen: 'home', traffic: 'off', plan: many, favourites: many.map((m) => ({ id: m.id, label: m.name })) });
    expect((state['today'] as unknown[]).length).toBe(12);
    expect((state['favourites'] as unknown[]).length).toBe(30);
  });
});

describe('the link itself', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    delete (window as unknown as { myWords?: unknown }).myWords;
  });

  function setLink(inbox: ReturnType<typeof vi.fn>) {
    const link = { start: vi.fn(async () => undefined), stop: vi.fn(async () => undefined), send: vi.fn(async () => undefined), inbox };
    (window as unknown as { myWords: unknown }).myWords = { link };
    return link;
  }

  it('does nothing where there is no link', () => {
    (window as unknown as { myWords: unknown }).myWords = {};
    expect(startLink('1234', vi.fn(), vi.fn())).toBeUndefined();
  });

  it('starts with the code, passes on valid requests, reports who is connected and stops cleanly', async () => {
    const inbox = vi.fn(async () => ({ messages: [{ type: 'open', screen: 'game' }, { type: 'speak', text: 'x' }], peers: 1 }));
    const link = setLink(inbox);
    const onCommand = vi.fn();
    const onPeers = vi.fn();
    const session = startLink('4321', onCommand, onPeers)!;
    expect(link.start).toHaveBeenCalledWith('4321');
    await vi.advanceTimersByTimeAsync(500);
    expect(onCommand).toHaveBeenCalledTimes(1);
    expect(onCommand).toHaveBeenCalledWith({ kind: 'open', screen: 'game' });
    expect(onPeers).toHaveBeenCalledWith(1);
    session.stop();
    expect(link.stop).toHaveBeenCalled();
    const polled = inbox.mock.calls.length;
    await vi.advanceTimersByTimeAsync(5000);
    expect(inbox.mock.calls.length).toBe(polled);
  });

  it('keeps each kind of message on its own, and sends them all again on request', async () => {
    const inbox = vi.fn(async () => ({ messages: [], peers: 1 }));
    const link = setLink(inbox);
    const session = startLink('1111', vi.fn(), vi.fn())!;
    session.publish({ type: 'state', screen: 'a' });
    session.publish({ type: 'sync', root: 'x' });
    await vi.advanceTimersByTimeAsync(400);
    expect(link.send).toHaveBeenCalledWith({ type: 'state', screen: 'a' });
    expect(link.send).toHaveBeenCalledWith({ type: 'sync', root: 'x' });
    link.send.mockClear();
    session.resend();
    expect(link.send).toHaveBeenCalledTimes(2);
    session.stop();
  });

  it('sends the latest state once things go quiet, and again when someone connects', async () => {
    let peers = 0;
    const inbox = vi.fn(async () => ({ messages: [], peers }));
    const link = setLink(inbox);
    const session = startLink('1111', vi.fn(), vi.fn())!;
    session.publish({ type: 'state', screen: 'a' });
    session.publish({ type: 'state', screen: 'b' });
    await vi.advanceTimersByTimeAsync(400);
    expect(link.send).toHaveBeenCalledTimes(1);
    expect(link.send).toHaveBeenLastCalledWith({ type: 'state', screen: 'b' });
    peers = 1;
    await vi.advanceTimersByTimeAsync(500);
    expect(link.send).toHaveBeenCalledTimes(2);
    session.stop();
  });
});

describe('what the television is sent', () => {
  const board: Board = {
    id: 'talk-root',
    name: 'Talk',
    grid: { rows: 2, columns: 2, order: [['a', 'b'], ['c', null]] },
    buttons: [
      { id: 'a', label: 'I', image: { kind: 'emoji', char: '🙋' }, background_color: '#e9d5ff' },
      { id: 'b', label: 'want', hidden: true },
      { id: 'c', label: 'mum', image: { kind: 'photo', blobId: 'p1' }, vocalization: 'Mummy' },
    ],
  };
  const input = {
    deviceName: 'Lucy’s device',
    rootBoardId: 'talk-root',
    boards: [board],
    wordStage: 0,
    speech: { rate: 0.9, pitch: 1.1, volume: 0.8 },
    pronunciations: [{ written: 'Lucy', spoken: 'Loosey' }, { written: '', spoken: 'x' }],
    labelStyle: 'both' as const,
    pressMode: 'sentence' as const,
    clearAfterSpeak: true,
    access: { textScale: 1.5, highContrast: 'off' as const, lowArousalPalette: true },
  };

  it('has the words in the same places, with a hidden word as an empty place', () => {
    const message = buildSyncMessage(input);
    const [sent] = message['boards'] as Array<{ order: (string | null)[][]; items: Array<{ id: string; emoji: string; spoken: string }> }>;
    expect(sent!.order).toEqual([['a', null], ['c', null]]);
    expect(sent!.items.map((i) => i.id)).toEqual(['a', 'c']);
  });

  it('sends a photo button as its label alone, and what to say instead when there is one', () => {
    const [sent] = buildSyncMessage(input)['boards'] as Array<{ items: Array<{ id: string; emoji: string; spoken: string }> }>;
    expect(sent!.items[1]).toMatchObject({ id: 'c', emoji: '', spoken: 'Mummy' });
  });

  it('carries the voice, the pronunciations that are filled in, the look and what a press does', () => {
    const message = buildSyncMessage(input);
    expect(message).toMatchObject({
      type: 'sync',
      device: 'Lucy’s device',
      root: 'talk-root',
      speech: { rate: 0.9, pitch: 1.1, volume: 0.8 },
      look: { labels: 'both', lowArousal: true, textScale: 1.5, contrast: 'off' },
      press: 'sentence',
      clearAfterSpeak: true,
    });
    expect(message['pronunciations']).toEqual([{ written: 'Lucy', spoken: 'Loosey' }]);
  });

  it('puts the word stage in force: a word held back is an empty place too', () => {
    const staged: Board = { ...board, buttons: [{ id: 'a', label: 'I', stage: 3 }, { id: 'c', label: 'mum', stage: 1 }] };
    const [sent] = buildSyncMessage({ ...input, boards: [staged], wordStage: 2 })['boards'] as Array<{ order: (string | null)[][] }>;
    expect(sent!.order).toEqual([[null, null], ['c', null]]);
  });

  it('shows the sentence and what was said only as plain words, kept short', () => {
    expect(buildSentenceMessage(['I', 'want'], 'I want juice')).toEqual({ type: 'sentence', words: ['I', 'want'], said: 'I want juice' });
    expect(buildSentenceMessage([], null)).toEqual({ type: 'sentence', words: [], said: null });
  });

  it('can be asked to send everything again', () => {
    expect(parseCommand({ type: 'sync-request' })).toEqual({ kind: 'sync' });
  });
});

describe('the television asking for a game’s buttons', () => {
  const buttons = [
    { id: 'o0', label: 'Grandad', emoji: '👴', colour: 0xfef08a },
    { id: 'o1', label: 'Mum', emoji: '👩', colour: 0xfef08a },
  ];

  it('is accepted as a prompt and buttons, in order', () => {
    expect(parseCommand({ type: 'controller', game: 'silly', prompt: 'Who?', buttons, yourTurn: true })).toEqual({
      kind: 'controller',
      spec: { game: 'silly', prompt: 'Who?', buttons, yourTurn: true },
    });
  });

  it('means the game is over when there are no buttons', () => {
    expect(parseCommand({ type: 'controller', game: 'silly', prompt: '', buttons: [] })).toEqual({ kind: 'controller', spec: null });
  });

  it('is refused when it is not sensible: too many buttons, no id, a very long word', () => {
    const many = Array.from({ length: 9 }, (_, i) => ({ id: `o${i}`, label: 'x', emoji: '', colour: 0 }));
    expect(parseCommand({ type: 'controller', game: 'g', prompt: 'p', buttons: many })).toBeNull();
    expect(parseCommand({ type: 'controller', game: 'g', prompt: 'p', buttons: [{ label: 'x' }] })).toBeNull();
    expect(parseCommand({ type: 'controller', game: 'g', prompt: 'p', buttons: [{ id: 'a', label: 'x'.repeat(100) }] })).toBeNull();
    expect(parseCommand({ type: 'controller', prompt: 'p', buttons })).toBeNull();
  });
});
