import { aboutMeSetting, userProfileSetting } from '../store/db';
import { ABOUT_ME_FIELDS, aboutMeHeading, aboutMeSections, hasAboutMe } from '../safety/aboutMe';
import type { AboutMe } from '../store/types';

// A communication passport. Anyone can read it from the child's screen with
// the About me button (no PIN), so write only what you are happy for a new
// member of staff or a relative to see.
export function AboutMeTab() {
  const info = aboutMeSetting.signal.value;

  function update(field: keyof AboutMe, value: string): void {
    void aboutMeSetting.set({ ...aboutMeSetting.signal.value, [field]: value });
  }

  const sections = aboutMeSections(info);

  return (
    <div class="parent-mode-screen__body about-tab">
      <p class="about-tab__hint">
        A short page for anyone new to supporting this person: a new teacher, supply cover, a relative or a
        respite carer. It is shown to anyone who presses <strong>About me</strong> on the child's screen, with
        no PIN, so only write what you are happy for them to read. It appears on the child's screen once
        something is written.
      </p>

      <label class="about-tab__field">
        What I like to be called
        <input
          class="about-tab__input"
          type="text"
          value={info.preferredName}
          onInput={(event) => update('preferredName', (event.target as HTMLInputElement).value)}
        />
      </label>

      {ABOUT_ME_FIELDS.map((field) => (
        <label class="about-tab__field" key={field.id}>
          {field.title}
          <textarea
            class="about-tab__input about-tab__textarea"
            placeholder={field.hint}
            value={info[field.id]}
            onInput={(event) => update(field.id, (event.target as HTMLTextAreaElement).value)}
          />
        </label>
      ))}

      <div class="about-tab__preview-header">
        <h2 class="about-tab__preview-title">Preview</h2>
        <button
          type="button"
          class="parent-mode-screen__button"
          disabled={!hasAboutMe(info)}
          onClick={() => window.print()}
        >
          Print this page
        </button>
      </div>

      <div class="print-page about-tab__sheet">
        <h2 class="about-tab__sheet-heading">{aboutMeHeading(info, userProfileSetting.signal.value.name)}</h2>
        {sections.length === 0 ? (
          <p class="about-tab__empty">Nothing written yet.</p>
        ) : (
          sections.map((section) => (
            <section class="about-tab__sheet-section" key={section.title}>
              <h3 class="about-tab__sheet-title">{section.title}</h3>
              <p class="about-tab__sheet-text">{section.text}</p>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
