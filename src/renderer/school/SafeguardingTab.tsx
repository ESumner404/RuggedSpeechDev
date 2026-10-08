import { schoolInfoSetting } from '../store/db';
import { EMPTY_SCHOOL_INFO } from '../store/staff';
import { SchoolInfoForm } from './SchoolInfoForm';

// A reminder, in one place, of what the device does and does not do about
// safeguarding, with the setting's own safeguarding lead beside it.
export function SafeguardingTab() {
  const info = { ...EMPTY_SCHOOL_INFO, ...schoolInfoSetting.signal.value };
  const lead = info.dsl.trim();
  return (
    <div class="parent-mode-screen__body safeguarding-tab">
      <section class="school-tab__section safeguarding-tab__card">
        <h2 class="school-tab__heading">If a child tells you something that worries you</h2>
        <ol class="school-tab__list safeguarding-tab__steps">
          <li>Listen, stay calm, and do not promise to keep it secret.</li>
          <li>
            Follow <strong>your setting's safeguarding procedure</strong> and speak to the designated safeguarding
            lead.
          </li>
          <li>Write down what was said, in the child's own words, as soon as you can.</li>
        </ol>
        <p class="safeguarding-tab__lead" aria-live="polite">
          {lead ? (
            <>
              Designated safeguarding lead: <strong>{lead}</strong>
              {info.dslPhone.trim() ? <>, phone <strong>{info.dslPhone.trim()}</strong></> : null}
            </>
          ) : (
            'Add the designated safeguarding lead below, so their name is here when it is needed.'
          )}
        </p>
      </section>

      <section class="school-tab__section">
        <h2 class="school-tab__heading">What this device does and does not do</h2>
        <ul class="school-tab__list">
          <li>The Help phrases (such as "Someone hurt me" and "I feel unsafe") exist because a child needs the words.</li>
          <li>
            The device <strong>speaks the phrase and stops</strong>. It does not tell anyone, flag it, or keep it any
            differently from anything else that is said.
          </li>
          <li>
            The same is true of <strong>My body</strong>, including "under my pants". Pointing is spoken, and nothing is
            recorded about it.
          </li>
          <li>
            If the <strong>Activity</strong> log is on, every phrase is logged in the same way, the Help phrases included.
            Treat the log as sensitive. It is never sent anywhere.
          </li>
          <li>"Call my parent" only speaks those words. It does not call anyone.</li>
        </ul>
      </section>

      <section class="school-tab__section">
        <h2 class="school-tab__heading">Safeguarding lead</h2>
        <SchoolInfoForm only={['dsl', 'dslPhone']} />
      </section>
    </div>
  );
}
