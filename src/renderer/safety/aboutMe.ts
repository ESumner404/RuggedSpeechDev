import type { AboutMe } from '../store/types';

/** The sections of the passport, in reading order, with what an adult sees when filling it in. */
export const ABOUT_ME_FIELDS: { id: Exclude<keyof AboutMe, 'preferredName'>; title: string; hint: string }[] = [
  {
    id: 'howIcommunicate',
    title: 'How I communicate',
    hint: 'For example: I use this app, some words, and gestures. I need time to answer.',
  },
  {
    id: 'whatHelps',
    title: 'What helps me',
    hint: 'For example: a warning before changes, a quiet space, being shown rather than told.',
  },
  {
    id: 'whatIFindHard',
    title: 'What I find hard',
    hint: 'For example: loud rooms, being rushed, unexpected changes.',
  },
  { id: 'likes', title: 'What I like', hint: 'Favourite things, people, activities.' },
  { id: 'dislikes', title: "What I don't like", hint: 'Things to avoid.' },
];

export function hasAboutMe(info: AboutMe): boolean {
  return Object.values(info).some((value) => value.trim() !== '');
}

/** The sections that have been filled in, ready to show or print. */
export function aboutMeSections(info: AboutMe): { title: string; text: string }[] {
  return ABOUT_ME_FIELDS.filter((field) => info[field.id].trim() !== '').map((field) => ({
    title: field.title,
    text: info[field.id].trim(),
  }));
}

/** `fallbackName` is the name from User, used when "what I like to be called" is blank. */
export function aboutMeHeading(info: AboutMe, fallbackName = ''): string {
  const name = info.preferredName.trim() || fallbackName.trim();
  return name ? `About ${name}` : 'About me';
}
