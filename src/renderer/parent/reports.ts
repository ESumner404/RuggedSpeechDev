import { aboutMeSections } from '../safety/aboutMe';
import { ageYears, deviceTitle } from '../ui/deviceName';
import {
  TARGET_AREAS,
  TARGET_STATUS_LABELS,
  schoolInfoLines,
  sortedTargets,
  type SchoolInfo,
  type StaffNote,
  type Target,
} from '../store/staff';
import { formatTime, type ActivityEntry, topSpoken, totals } from '../store/activity';
import type { AboutMe, AccessSettings, PressMode, SpeakStyle, UsageCounts, UserProfile } from '../store/types';
import { summariseUsage } from '../store/usage';
import type { TrafficSetting } from '../signals/traffic';

// The two sheets staff can print: a handover for someone new to the child,
// and a review for a meeting. Built here as plain data so they can be
// checked, and drawn by the Reports tab.

export type Section = { title: string; lines: string[] };
export type Sheet = { heading: string; subheading: string; sections: Section[] };

const PRESS: Record<PressMode, string> = {
  sentence: 'Pressing a word adds it to the sentence, then Speak says it.',
  speak: 'Pressing a word says it straight away.',
  both: 'Pressing a word says it and adds it to the sentence.',
};

const STYLE: Record<SpeakStyle, string> = {
  normal: 'The sentence is read out all together.',
  clear: 'The sentence is read out with small gaps between words, a little slower.',
  wordByWord: 'The sentence is read out one word at a time, lighting each word.',
};

const SCANNING: Record<AccessSettings['scanningMode'], string | undefined> = {
  off: undefined,
  oneSwitchTimed: 'Uses one switch, with automatic scanning.',
  twoSwitchStepped: 'Uses two switches: one to move, one to choose.',
};

export type HandoverInput = {
  profile: UserProfile;
  school: SchoolInfo;
  about: AboutMe;
  targets: Target[];
  focusWords: string[];
  press: PressMode;
  speakStyle: SpeakStyle;
  access: AccessSettings;
  traffic: TrafficSetting;
};

/** What someone new to this child needs to know, on one page. */
export function handoverSheet(input: HandoverInput): Sheet {
  const name = input.about.preferredName.trim() || input.profile.name.trim();
  const age = ageYears(input.profile);
  const sections: Section[] = [];

  const who = [
    name ? `Likes to be called: ${name}` : '',
    age !== undefined ? `Age: ${age}` : '',
    `Device: ${deviceTitle(input.profile)}`,
    ...schoolInfoLines(input.school).map((line) => `${line.label}: ${line.value}`),
  ].filter(Boolean);
  sections.push({ title: 'Who and where', lines: who });

  for (const section of aboutMeSections(input.about)) sections.push({ title: section.title, lines: [section.text] });

  const how = [PRESS[input.press], STYLE[input.speakStyle], SCANNING[input.access.scanningMode]].filter((x): x is string => Boolean(x));
  if (input.access.dwellMs > 0) how.push(`Holds a button for ${input.access.dwellMs / 1000} seconds to choose it.`);
  sections.push({ title: 'How the device works for them', lines: how });

  if (input.focusWords.length > 0) sections.push({ title: 'Words being practised', lines: [input.focusWords.join(', ')] });

  const working = sortedTargets(input.targets).filter((t) => t.status === 'working');
  if (working.length > 0) sections.push({ title: 'Current targets', lines: working.map((t) => t.text) });

  sections.push({
    title: 'If they want to be left alone, or want to talk',
    lines: [
      `Red: ${input.traffic.phrases.red}`,
      `Amber: ${input.traffic.phrases.amber}`,
      `Green: ${input.traffic.phrases.green}`,
    ],
  });

  sections.push({
    title: 'Good to know',
    lines: [
      'Let them take their time. Wait before asking again.',
      'The Help button is always along the top. Someone who is upset or tells you something worrying: follow your safeguarding procedure. The device does not tell anyone.',
      'Please do not move the buttons or change the settings without asking.',
    ],
  });

  return { heading: name ? `Handover: ${name}` : 'Handover', subheading: 'Written for someone new to supporting this child.', sections };
}

export type ReviewInput = {
  profile: UserProfile;
  about: AboutMe;
  targets: Target[];
  notes: StaffNote[];
  days: number;
  now: number;
  activity: ActivityEntry[];
  activityOn: boolean;
  usage: UsageCounts;
  usageOn: boolean;
};

/** A summary for a review meeting: how the device has been used, what was worked on, what was noticed. */
export function reviewSheet(input: ReviewInput): Sheet {
  const name = input.about.preferredName.trim() || input.profile.name.trim();
  const since = input.now - input.days * 24 * 60 * 60 * 1000;
  const sections: Section[] = [];

  const targets = sortedTargets(input.targets);
  sections.push({
    title: 'Targets',
    lines:
      targets.length === 0
        ? ['No targets have been set.']
        : targets.map((t) => {
            const area = TARGET_AREAS.find((a) => a.id === t.area)!.label;
            return `${TARGET_STATUS_LABELS[t.status]} (${area}): ${t.text}${t.notes.trim() ? ` Notes: ${t.notes.trim()}` : ''}`;
          }),
  });

  if (input.activityOn || input.activity.length > 0) {
    const mine = input.activity.filter((e) => e.at >= since);
    const sums = totals(mine, input.now);
    const spoken = topSpoken(mine, input.now, input.days, 10);
    sections.push({
      title: `How the device was used, last ${input.days} days`,
      lines: [
        `Things said: ${mine.filter((e) => e.kind === 'speech').length}`,
        `Parts of the app opened: ${mine.filter((e) => e.kind === 'screen').length}`,
        `In the last 7 days: ${sums.week}. In the last 30 days: ${sums.month}.`,
        ...(spoken.length > 0 ? [`Said most: ${spoken.map((s) => `${s.label} (${s.count})`).join(', ')}`] : []),
      ],
    });
  } else {
    sections.push({ title: 'How the device was used', lines: ['The activity log is off, so there is nothing to report.'] });
  }

  if (input.usageOn) {
    const summary = summariseUsage(input.usage, Math.min(input.days, 90), new Date(input.now));
    sections.push({
      title: 'Words pressed',
      lines: [
        `${summary.totalPresses} presses of ${summary.distinctWords} different words.`,
        ...(summary.rows.length > 0 ? [`Most used: ${summary.rows.slice(0, 10).map((r) => `${r.word} (${r.count})`).join(', ')}`] : []),
      ],
    });
  }

  const notes = [...input.notes].filter((n) => n.at >= since).sort((a, b) => a.at - b.at);
  sections.push({
    title: 'Notes from sessions',
    lines: notes.length === 0 ? ['No notes in this time.'] : notes.map((n) => `${formatTime(n.at)}${n.by.trim() ? `, ${n.by.trim()}` : ''}: ${n.text}`),
  });

  return {
    heading: name ? `Review: ${name}` : 'Review',
    subheading: `The last ${input.days} days, to ${formatTime(input.now).slice(0, 10)}.`,
    sections,
  };
}
