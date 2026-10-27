import { useSignal } from '@preact/signals';
import { familySetting, savePhoto } from '../store/db';
import { PhotoCapture } from '../parent/PhotoCapture';
import { PhotoThumbnail } from '../ui/PhotoThumbnail';
import { MAX_FAMILY, RELATIONS, sayAbout, without, type FamilyMember } from './family';

const newId = (): string => `person-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// Build the family: add people with a photo, say how they are related, and the tree on the child's My family page is
// drawn from it. Photos stay on this device and go only into a backup an adult saves.
export function FamilyTab() {
  const members = familySetting.signal.value;
  const name = useSignal('');
  const group = useSignal<'family' | 'friends'>('family');
  const message = useSignal('');

  function save(next: FamilyMember[]): void {
    void familySetting.set(next);
  }

  function update(id: string, changes: Partial<FamilyMember>): void {
    save(members.map((member) => (member.id === id ? { ...member, ...changes } : member)));
  }

  function add(): void {
    const trimmed = name.value.trim();
    if (!trimmed) return;
    if (members.length >= MAX_FAMILY) {
      message.value = `There is room for ${MAX_FAMILY} people.`;
      return;
    }
    save([
      ...members,
      { id: newId(), name: trimmed, relation: group.value === 'friends' ? 'Friend' : '', group: group.value, emoji: '🙂', parentIds: [] },
    ]);
    name.value = '';
    message.value = '';
  }

  function remove(id: string): void {
    save(
      members
        .filter((member) => member.id !== id)
        .map((member) => {
          const cleaned = { ...(member.partnerId === id ? without(member, 'partnerId') : member) };
          return { ...cleaned, parentIds: member.parentIds.filter((parent) => parent !== id) };
        }),
    );
  }

  function toggleParent(member: FamilyMember, parentId: string): void {
    const has = member.parentIds.includes(parentId);
    update(member.id, { parentIds: has ? member.parentIds.filter((id) => id !== parentId) : [...member.parentIds, parentId] });
  }

  function setPartner(member: FamilyMember, partnerId: string): void {
    // Partners are kept the same both ways, so the tree puts them side by side whichever way round it looks.
    save(
      members.map((other) => {
        if (other.id === member.id) return partnerId ? { ...other, partnerId } : without(other, 'partnerId');
        if (partnerId && other.id === partnerId) return { ...other, partnerId: member.id };
        if (other.partnerId === member.id) return without(other, 'partnerId');
        return other;
      }),
    );
  }

  async function setPhoto(member: FamilyMember, blob: Blob): Promise<void> {
    update(member.id, { photoBlobId: await savePhoto(blob) });
  }

  const familyMembers = members.filter((member) => member.group === 'family');

  return (
    <div class="parent-mode-screen__body family-tab">
      <p class="about-tab__hint">
        The people who matter to the child. Add each person with a photo and say how they are related, and the child's{' '}
        <strong>My family</strong> page draws the family tree from it. Pressing a person says who they are. Put My family on
        the top bar in <strong>Quick Access</strong> to reach it from every screen. Photos stay on this device.
      </p>

      <div class="family-tab__add">
        <label>
          Name
          <input type="text" value={name.value} onInput={(event) => (name.value = (event.target as HTMLInputElement).value)} />
        </label>
        <label>
          They are
          <select value={group.value} onChange={(event) => (group.value = (event.target as HTMLSelectElement).value as 'family' | 'friends')}>
            <option value="family">Family</option>
            <option value="friends">A friend</option>
          </select>
        </label>
        <button type="button" class="parent-mode-screen__button" disabled={!name.value.trim()} onClick={add}>
          Add person
        </button>
      </div>
      {message.value && <p role="status">{message.value}</p>}

      <ul class="family-tab__list">
        {members.map((member) => (
          <li class="family-tab__person" key={member.id}>
            <div class="family-tab__head">
              {member.photoBlobId ? (
                <PhotoThumbnail class="family-tab__thumb" blobId={member.photoBlobId} alt="" />
              ) : (
                <span class="family-tab__emoji" aria-hidden="true">
                  {member.emoji}
                </span>
              )}
              <input
                type="text"
                aria-label="Name"
                value={member.name}
                onInput={(event) => update(member.id, { name: (event.target as HTMLInputElement).value })}
              />
              <input
                type="text"
                aria-label="How they are related"
                list="family-relations"
                placeholder="Mum, Grandad, Friend…"
                value={member.relation}
                onInput={(event) => update(member.id, { relation: (event.target as HTMLInputElement).value })}
              />
              <input
                class="parent-mode-screen__emoji-input"
                type="text"
                aria-label={`Emoji for ${member.name}`}
                value={member.emoji}
                onInput={(event) => update(member.id, { emoji: (event.target as HTMLInputElement).value })}
              />
              <button type="button" class="parent-mode-screen__button" aria-label={`Remove ${member.name}`} onClick={() => remove(member.id)}>
                Remove
              </button>
            </div>
            <details>
              <summary>Photo, family tree and what to say</summary>
              <div class="family-tab__more">
                <PhotoCapture onCapture={(blob) => void setPhoto(member, blob)} />
                {member.photoBlobId && (
                  <button
                    type="button"
                    class="parent-mode-screen__button"
                    onClick={() => save(members.map((other) => (other.id === member.id ? without(other, 'photoBlobId') : other)))}
                  >
                    Take the photo off
                  </button>
                )}
                {member.group === 'family' && (
                  <>
                    <fieldset>
                      <legend>Their parents (in the family)</legend>
                      {familyMembers.filter((other) => other.id !== member.id).length === 0 && <span>Add more family first.</span>}
                      {familyMembers
                        .filter((other) => other.id !== member.id)
                        .map((other) => (
                          <label class="access-tab__checkbox" key={other.id}>
                            <input
                              type="checkbox"
                              checked={member.parentIds.includes(other.id)}
                              onChange={() => toggleParent(member, other.id)}
                            />
                            {other.name}
                          </label>
                        ))}
                    </fieldset>
                    <label>
                      Partner
                      <select value={member.partnerId ?? ''} onChange={(event) => setPartner(member, (event.target as HTMLSelectElement).value)}>
                        <option value="">None</option>
                        {familyMembers
                          .filter((other) => other.id !== member.id)
                          .map((other) => (
                            <option value={other.id} key={other.id}>
                              {other.name}
                            </option>
                          ))}
                      </select>
                    </label>
                  </>
                )}
                <label>
                  What to say when pressed
                  <input
                    type="text"
                    placeholder={sayAbout({ ...member, says: '' })}
                    value={member.says ?? ''}
                    onInput={(event) => {
                      const value = (event.target as HTMLInputElement).value;
                      if (value) update(member.id, { says: value });
                      else save(members.map((other) => (other.id === member.id ? without(other, 'says') : other)));
                    }}
                  />
                </label>
              </div>
            </details>
          </li>
        ))}
      </ul>
      <datalist id="family-relations">
        {RELATIONS.map((relation) => (
          <option value={relation} key={relation} />
        ))}
      </datalist>
    </div>
  );
}
