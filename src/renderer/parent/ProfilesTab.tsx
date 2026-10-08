import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { getActiveProfileId, getAllBoards, getProfiles, saveProfile, setActiveProfileId } from '../store/db';
import { ROOT_BOARD_ID } from '../vocab/starter';
import type { Board, Profile } from '../store/types';

// Profiles change which board Talk opens to by default (docs/build-plan.md Phase 6).
// They never touch the Home screen's own layout, that position is
// load-bearing motor memory (PRINCIPLES.md I3), so this tab only offers a
// root-board picker per profile plus which one is active right now.
export function ProfilesTab() {
  const profiles = useSignal<Profile[]>([]);
  const boards = useSignal<Board[]>([]);
  const activeProfileId = useSignal<string | null>(null);

  useEffect(() => {
    void Promise.all([getProfiles(), getAllBoards(), getActiveProfileId()]).then(
      ([loadedProfiles, loadedBoards, activeId]) => {
        profiles.value = [...loadedProfiles].sort((a, b) => a.name.localeCompare(b.name));
        boards.value = [...loadedBoards].sort((a, b) =>
          a.id === ROOT_BOARD_ID ? -1 : b.id === ROOT_BOARD_ID ? 1 : a.name.localeCompare(b.name),
        );
        activeProfileId.value = activeId;
      },
    );
  }, []);

  async function handleRootBoardChange(profile: Profile, rootBoardId: string): Promise<void> {
    const next = { ...profile, rootBoardId };
    profiles.value = profiles.value.map((p) => (p.id === profile.id ? next : p));
    await saveProfile(next);
  }

  async function handleActivate(profileId: string): Promise<void> {
    activeProfileId.value = profileId;
    await setActiveProfileId(profileId);
  }

  return (
    <div class="parent-mode-screen__body">
      <p class="profiles-tab__hint">
        Same vocabulary everywhere. This only chooses which page Talk opens to first, for
        wherever the device is being used right now.
      </p>
      <ul class="profiles-tab__list">
        {profiles.value.map((profile) => (
          <li class="profiles-tab__row" key={profile.id}>
            <span class="profiles-tab__name">{profile.name}</span>
            <label class="profiles-tab__board-picker">
              Opens to
              <select
                value={profile.rootBoardId}
                onChange={(event) =>
                  void handleRootBoardChange(profile, (event.target as HTMLSelectElement).value)
                }
              >
                {boards.value.map((board) => (
                  <option value={board.id} key={board.id}>
                    {board.name}
                  </option>
                ))}
              </select>
            </label>
            {activeProfileId.value === profile.id ? (
              <span class="profiles-tab__active">Active now</span>
            ) : (
              <button
                type="button"
                class="parent-mode-screen__button"
                onClick={() => void handleActivate(profile.id)}
              >
                Use this profile
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
