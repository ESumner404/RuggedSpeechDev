import { schoolInfoSetting } from '../store/db';
import { EMPTY_SCHOOL_INFO, SCHOOL_INFO_FIELDS, type SchoolInfo } from '../store/staff';

/** Who the child works with, and where. For adults only, and never shown on the child's screen. */
export function SchoolInfoForm({ only, except }: { only?: (keyof SchoolInfo)[]; except?: (keyof SchoolInfo)[] } = {}) {
  const info = { ...EMPTY_SCHOOL_INFO, ...schoolInfoSetting.signal.value };
  return (
    <div class="school-tab__fields">
      {SCHOOL_INFO_FIELDS.filter((field) => (!only || only.includes(field.id)) && !except?.includes(field.id)).map((field) => (
        <label class="about-tab__field" key={field.id}>
          {field.label}
          <input
            class="about-tab__input"
            type={field.id === 'phone' || field.id === 'dslPhone' ? 'tel' : 'text'}
            autocomplete="off"
            placeholder={field.placeholder}
            value={info[field.id]}
            onInput={(event) =>
              void schoolInfoSetting.set({
                ...EMPTY_SCHOOL_INFO,
                ...schoolInfoSetting.signal.value,
                [field.id]: (event.target as HTMLInputElement).value,
              })
            }
          />
        </label>
      ))}
    </div>
  );
}
