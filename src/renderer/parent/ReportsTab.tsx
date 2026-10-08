import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import {
  aboutMeSetting,
  accessSettingsVersion,
  activityEnabledSetting,
  getAccessSettings,
  getActivity,
  getAllBoards,
  pressMode,
  schoolInfoSetting,
  speakStyleSetting,
  staffNotesSetting,
  targetsSetting,
  trafficSetting,
  usageCountsSetting,
  usageEnabledSetting,
  userProfileSetting,
} from '../store/db';
import { DEFAULT_ACCESS_SETTINGS } from '../store/db';
import type { ActivityEntry } from '../store/activity';
import type { AccessSettings } from '../store/types';
import { handoverSheet, reviewSheet, type Sheet } from './reports';

type Which = 'handover' | 'review';

function SheetView({ sheet }: { sheet: Sheet }) {
  return (
    <div class="print-page staff-sheet">
      <h2 class="staff-sheet__heading">{sheet.heading}</h2>
      <p class="staff-sheet__sub">{sheet.subheading}</p>
      {sheet.sections.map((section) => (
        <section class="staff-sheet__section" key={section.title}>
          <h3 class="staff-sheet__title">{section.title}</h3>
          {section.lines.map((line, index) => (
            <p class="staff-sheet__line" key={index}>
              {line}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}

// Two sheets to print or save as a PDF from the print window: a handover for
// someone new to supporting the child, and a review for a meeting. Nothing is
// sent anywhere; they are built here from what is already on this computer.
export function ReportsTab() {
  const which = useSignal<Which>('handover');
  const days = useSignal(30);
  const access = useSignal<AccessSettings>(DEFAULT_ACCESS_SETTINGS);
  const focusWords = useSignal<string[]>([]);
  const activity = useSignal<ActivityEntry[]>([]);
  const version = accessSettingsVersion.value;

  useEffect(() => {
    void getAccessSettings().then((loaded) => (access.value = loaded));
  }, [version]);

  useEffect(() => {
    void getAllBoards().then((boards) => {
      const words = boards.flatMap((board) => board.buttons.filter((b) => b.target).map((b) => b.label));
      focusWords.value = [...new Set(words)];
    });
    void getActivity().then((entries) => (activity.value = entries));
  }, []);

  const sheet =
    which.value === 'handover'
      ? handoverSheet({
          profile: userProfileSetting.signal.value,
          school: schoolInfoSetting.signal.value,
          about: aboutMeSetting.signal.value,
          targets: targetsSetting.signal.value,
          focusWords: focusWords.value,
          press: pressMode.value,
          speakStyle: speakStyleSetting.signal.value,
          access: access.value,
          traffic: trafficSetting.signal.value,
        })
      : reviewSheet({
          profile: userProfileSetting.signal.value,
          about: aboutMeSetting.signal.value,
          targets: targetsSetting.signal.value,
          notes: staffNotesSetting.signal.value,
          days: days.value,
          now: Date.now(),
          activity: activity.value,
          activityOn: activityEnabledSetting.signal.value,
          usage: usageCountsSetting.signal.value,
          usageOn: usageEnabledSetting.signal.value,
        });

  return (
    <div class="parent-mode-screen__body reports-tab">
      <p class="about-tab__hint">
        Sheets to print, or to save as a PDF from the print window. They are made here from what is already on this
        computer and are not sent anywhere.
      </p>
      <div class="activity-tab__what" role="group" aria-label="Which sheet">
        <button type="button" class={`activity-tab__chip${which.value === 'handover' ? ' activity-tab__chip--on' : ''}`} aria-pressed={which.value === 'handover'} onClick={() => (which.value = 'handover')}>
          Handover sheet
        </button>
        <button type="button" class={`activity-tab__chip${which.value === 'review' ? ' activity-tab__chip--on' : ''}`} aria-pressed={which.value === 'review'} onClick={() => (which.value = 'review')}>
          Review report
        </button>
        {which.value === 'review' && (
          <label class="access-tab__select-row">
            Covering
            <select value={String(days.value)} onChange={(event) => (days.value = Number((event.target as HTMLSelectElement).value))}>
              {[30, 90, 180, 365].map((n) => (
                <option value={String(n)} key={n}>
                  the last {n} days
                </option>
              ))}
            </select>
          </label>
        )}
        <button type="button" class="parent-mode-screen__button" onClick={() => window.print()}>
          Print this sheet
        </button>
      </div>
      <SheetView sheet={sheet} />
    </div>
  );
}
