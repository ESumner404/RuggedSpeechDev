import { useSignal } from '@preact/signals';
import { familySetting } from '../store/db';
import { announceText } from '../speech/announce';
import { PhotoThumbnail } from '../ui/PhotoThumbnail';
import { Pic } from '../symbols/Pic';
import { buildTree, sayAbout, type FamilyMember, type TreeNode } from './family';

function Person({ member }: { member: FamilyMember }) {
  return (
    <button
      type="button"
      class="family-card"
      aria-label={member.relation ? `${member.name}, ${member.relation}` : member.name}
      onClick={() => announceText(sayAbout(member), { keepInHistory: false })}
    >
      {member.photoBlobId ? (
        <PhotoThumbnail class="family-card__photo" blobId={member.photoBlobId} alt="" />
      ) : (
        <Pic class="family-card__emoji" char={member.emoji || '🙂'} />
      )}
      <span class="family-card__name">{member.name}</span>
      {member.relation && <span class="family-card__relation">{member.relation}</span>}
    </button>
  );
}

function Branch({ node }: { node: TreeNode }) {
  return (
    <li class="family-tree__node">
      <div class="family-tree__couple">
        {node.people.map((member, index) => (
          <>
            {index > 0 && (
              <span class="family-tree__heart" aria-hidden="true">
                ❤️
              </span>
            )}
            <Person member={member} key={member.id} />
          </>
        ))}
      </div>
      {node.children.length > 0 && (
        <ul class="family-tree__children">
          {node.children.map((child) => (
            <Branch node={child} key={child.people[0]!.id} />
          ))}
        </ul>
      )}
    </li>
  );
}

// My family and friends: a press on a person says who they are. The family is drawn as a tree, oldest at the top, with
// partners side by side; friends are a simple set of cards. Nothing here moves, and nothing speaks unless pressed.
export function FamilyScreen() {
  const group = useSignal<'family' | 'friends'>('family');
  const members = familySetting.signal.value;
  const friends = members.filter((member) => member.group === 'friends');
  const tree = buildTree(members);

  return (
    <div class="family-screen">
      <div class="family-screen__tabs" role="group" aria-label="Family or friends">
        <button type="button" class="family-screen__tab" aria-pressed={group.value === 'family'} onClick={() => (group.value = 'family')}>
          My family
        </button>
        <button type="button" class="family-screen__tab" aria-pressed={group.value === 'friends'} onClick={() => (group.value = 'friends')}>
          My friends
        </button>
      </div>
      <div class="family-screen__body">
        {members.length === 0 && (
          <p class="family-screen__empty">No one here yet. An adult can add people in Parent Mode (My family).</p>
        )}
        {group.value === 'family' && tree.length > 0 && (
          <ul class="family-tree">
            {tree.map((node) => (
              <Branch node={node} key={node.people[0]!.id} />
            ))}
          </ul>
        )}
        {group.value === 'family' && tree.length === 0 && members.length > 0 && (
          <p class="family-screen__empty">No family yet. Friends are under My friends.</p>
        )}
        {group.value === 'friends' && (
          <div class="family-friends">
            {friends.length === 0 && members.length > 0 && <p class="family-screen__empty">No friends added yet.</p>}
            {friends.map((member) => (
              <Person member={member} key={member.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
