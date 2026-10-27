import type { ActivityEntry } from '../store/activity';
import { languageProgress } from './progress';

const formatWeek = (start: number): string => new Date(start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

// For adults only, from the opt-in activity log. A rough guide, not a score.
export function LanguageProgress({ entries, now }: { entries: ActivityEntry[]; now: number }) {
  const weeks = languageProgress(entries, now);
  if (!weeks.some((week) => week.utterances > 0)) return null;
  const thisWeek = weeks[weeks.length - 1]!;
  return (
    <section class="access-tab__section" data-section="language-progress">
      <h2 class="access-tab__heading">How what is said is changing</h2>
      <p class="access-tab__hint">
        Week by week, from the log. A rough guide for you and a speech and language therapist, not a score: saying more is not the
        same as communicating better, and what matters is what is right for this child.
      </p>
      <table class="activity-tab__table">
        <thead>
          <tr>
            <th>Week from</th>
            <th>Said</th>
            <th>Words each time</th>
            <th>Three words or more</th>
            <th>Different words</th>
            <th>New words</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week.start}>
              <td>{formatWeek(week.start)}</td>
              <td>{week.utterances}</td>
              <td>{week.utterances ? week.averageWords.toFixed(1) : '–'}</td>
              <td>{week.utterances ? `${Math.round(week.threePlus * 100)}%` : '–'}</td>
              <td>{week.distinctWords || '–'}</td>
              <td>{week.newWords.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {thisWeek.newWords.length > 0 && <p class="access-tab__hint">New this week: {thisWeek.newWords.slice(0, 30).join(', ')}.</p>}
    </section>
  );
}
