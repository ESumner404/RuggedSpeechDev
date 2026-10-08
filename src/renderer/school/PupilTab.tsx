import { aboutMeSetting, userProfileSetting } from '../store/db';
import { ageYears, deviceTitle } from '../ui/deviceName';
import { SchoolInfoForm } from './SchoolInfoForm';

// The pupil and the school: who the child is, and who works with them. The
// child's own details (name, age) are in Parent Mode, under User, and are only
// shown here, so there is one place to change them.
export function PupilTab() {
  const profile = userProfileSetting.signal.value;
  const about = aboutMeSetting.signal.value;
  const name = about.preferredName.trim() || profile.name.trim();
  const age = ageYears(profile);

  return (
    <div class="parent-mode-screen__body pupil-tab">
      <section class="school-tab__section">
        <h2 class="school-tab__heading">{name || 'The pupil'}</h2>
        <dl class="pupil-tab__facts">
          <div>
            <dt>Device</dt>
            <dd>{deviceTitle(profile)}</dd>
          </div>
          {age !== undefined && (
            <div>
              <dt>Age</dt>
              <dd>{age}</dd>
            </div>
          )}
        </dl>
        <p class="school-tab__hint">The pupil's name and age are set by the family, in Parent Mode, under User.</p>
      </section>

      <section class="school-tab__section">
        <h2 class="school-tab__heading">About the school</h2>
        <p class="school-tab__hint">
          Who the child works with and where. It is for the adults: it is never shown on the child's screen. It appears
          on the handover sheet, and can fill in Lost mode.
        </p>
        <SchoolInfoForm except={['dsl', 'dslPhone']} />
      </section>
    </div>
  );
}
