import { aboutMeSetting, familySetting, lastBackupSetting, preferredVoiceURI, schoolInfoSetting, targetsSetting, weeklyRoutineSetting } from '../store/db';
import { routineIsEmpty } from '../store/staff';
import { parentChecks, progressOf, schoolChecks, type CheckItem } from './healthCheck';

type Props = {
  kind: 'parent' | 'school';
  /** Called with the name of the place to go to. */
  go: (place: string) => void;
  lessonPageCount?: number;
  favouriteCount?: number;
};

// "Is everything ready?" A short, kind checklist with a button to sort each thing out.
export function ReadyCheck({ kind, go, lessonPageCount = 0, favouriteCount = 0 }: Props) {
  const about = aboutMeSetting.signal.value;
  const info = schoolInfoSetting.signal.value;
  const input = {
    hasVoice: preferredVoiceURI.value !== undefined,
    lastBackupAt: lastBackupSetting.signal.value,
    now: Date.now(),
    hasFamily: familySetting.signal.value.length > 0,
    hasAboutMe: Object.values(about).some((value) => typeof value === 'string' && value.trim() !== ''),
    hasFavourites: favouriteCount > 0,
    school: {
      hasDetails: Boolean(info.school.trim() || info.teacher.trim()),
      hasTimetable: !routineIsEmpty(weeklyRoutineSetting.signal.value),
      hasLessonPages: lessonPageCount > 0,
      hasTargets: targetsSetting.signal.value.length > 0,
    },
  };
  const items: CheckItem[] = kind === 'school' ? schoolChecks(input) : parentChecks(input);
  const { done, total } = progressOf(items);

  return (
    <section class="ready-check" aria-label="Is everything ready?">
      <h2 class="ready-check__title">
        Is everything ready? <span class="ready-check__count">{done} of {total}</span>
      </h2>
      <ul class="ready-check__list">
        {items.map((item) => (
          <li class={`ready-check__item${item.done ? ' ready-check__item--done' : ''}`} key={item.id}>
            <span class="ready-check__mark" aria-hidden="true">
              {item.done ? '✓' : '○'}
            </span>
            <span class="ready-check__text">
              <span class="sr-only">{item.done ? 'Done: ' : 'Not yet: '}</span>
              {item.text}
            </span>
            {!item.done && item.go && (
              <button type="button" class="parent-mode-screen__button" onClick={() => go(item.go)}>
                {item.goLabel}
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
