// A traffic light for "how much do you want to be spoken to?", shown to
// other people without a word being said. It is the child's (or an adult's)
// to set, and it stays where it is until it is changed. The words are
// editable, because what is right for one child is not for another.

export type TrafficStatus = 'off' | 'red' | 'amber' | 'green';

export type TrafficLight = Exclude<TrafficStatus, 'off'>;

export type TrafficSetting = {
  status: TrafficStatus;
  phrases: Record<TrafficLight, string>;
};

export const TRAFFIC_LIGHTS: { id: TrafficLight; colour: string; short: string; icon: string }[] = [
  { id: 'red', colour: '#dc2626', short: 'Please leave me', icon: '🔴' },
  { id: 'amber', colour: '#f59e0b', short: 'Talk gently, wait for me', icon: '🟠' },
  { id: 'green', colour: '#16a34a', short: 'Happy to talk', icon: '🟢' },
];

export const DEFAULT_TRAFFIC: TrafficSetting = {
  status: 'off',
  phrases: {
    red: "Please don't talk to me right now.",
    amber: 'You can talk to me, but please be gentle and give me time.',
    green: "I'm happy to talk to you.",
  },
};

export function isTrafficSetting(value: unknown): value is TrafficSetting {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  const phrases = v['phrases'] as Record<string, unknown> | undefined;
  return (
    ['off', 'red', 'amber', 'green'].includes(v['status'] as string) &&
    typeof phrases === 'object' &&
    phrases !== null &&
    ['red', 'amber', 'green'].every((key) => typeof phrases[key] === 'string')
  );
}

export const trafficLight = (id: TrafficLight) => TRAFFIC_LIGHTS.find((light) => light.id === id)!;
