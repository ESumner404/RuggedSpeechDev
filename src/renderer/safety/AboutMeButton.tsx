import { useSignal } from '@preact/signals';
import { aboutMeSetting, schoolModeSetting, userProfileSetting } from '../store/db';
import { aboutMeHeading, aboutMeSections, hasAboutMe } from './aboutMe';
import { modeName } from '../ui/modeName';

// Shown to anyone who presses it, with no PIN, because its job is to let a
// new teacher, a supply cover, a relative or a respite carer understand this
// person quickly. It only appears once something has been written, or in
// school mode (where staff are expected to fill it in), so the child's
// screen stays simple until it has a purpose (invariant I4).
export function AboutMeButton() {
  const open = useSignal(false);
  const info = aboutMeSetting.signal.value;

  if (!hasAboutMe(info) && !schoolModeSetting.signal.value) return null;

  const sections = aboutMeSections(info);

  return (
    <>
      <button type="button" class="about-me-button" onClick={() => (open.value = true)}>
        About me
      </button>
      {open.value && (
        <div class="medical-info-overlay">
          <div class="medical-info-overlay__panel about-me-overlay__panel">
            <h2 class="about-me-overlay__heading">{aboutMeHeading(info, userProfileSetting.signal.value.name)}</h2>
            {sections.length === 0 ? (
              <p class="medical-info-overlay__empty">
                Nothing has been written here yet. An adult can add it in {modeName()}.
              </p>
            ) : (
              sections.map((section) => (
                <section class="about-me-overlay__section" key={section.title}>
                  <h3 class="about-me-overlay__title">{section.title}</h3>
                  <p class="about-me-overlay__text">{section.text}</p>
                </section>
              ))
            )}
            <button type="button" class="medical-info-overlay__close" onClick={() => (open.value = false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
