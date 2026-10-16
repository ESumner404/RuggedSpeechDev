import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OPENABLE_SCREENS, buildLinkState, parseCommand, startLink } from './appleLink';

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
