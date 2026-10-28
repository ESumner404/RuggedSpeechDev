import { activityText, useSchoolNow } from './schoolDay';

type Props = {
  onOpenDay: () => void;
  onOpenPage: (pageId: string) => void;
};

// The school day on the child's Home screen: what is happening now and what comes next, with the words for the lesson one
// press away. It is the same size and in the same place whether or not anything is planned, so nothing on Home moves.
// Nothing is spoken until something is pressed.
export function NowStrip({ onOpenDay, onOpenPage }: Props) {
  const today = useSchoolNow();
  const now = today?.now ?? null;
  const next = today?.next ?? null;

  return (
    <div class="now-strip">
      <button type="button" class="now-strip__day" onClick={onOpenDay}>
        <span class="now-strip__label">{now ? 'Now' : today?.planned ? 'Today' : 'My Day'}</span>
        <span class="now-strip__now">{now ? activityText(now) : today?.planned ? 'All finished' : 'Nothing planned'}</span>
        {next && <span class="now-strip__next">Next: {next.name}</span>}
      </button>
      {now?.pageId && (
        <button type="button" class="now-strip__words" onClick={() => onOpenPage(now.pageId!)}>
          Words for this
        </button>
      )}
    </div>
  );
}
