import { lastSavedAt } from '../store/db';
import type { SectionInfo } from './sectionInfo';

/** A calm note in the header that what an adult changes is saved, because it is saved as they go. */
export function SavedNote() {
  return (
    <span class="saved-note" role="status">
      {lastSavedAt.value ? 'All changes saved' : 'Changes are saved as you make them'}
    </span>
  );
}

/** The top of every page in Parent Mode and School Mode: where you are, and what it is for. */
export function PageHeader({ label, info }: { label: string; info: SectionInfo | undefined }) {
  return (
    <header class="page-header">
      <span class="page-header__icon" aria-hidden="true">
        {info?.icon ?? '•'}
      </span>
      <div class="page-header__text">
        <h2 class="page-header__title">{label}</h2>
        {info && <p class="page-header__purpose">{info.purpose}</p>}
      </div>
    </header>
  );
}
