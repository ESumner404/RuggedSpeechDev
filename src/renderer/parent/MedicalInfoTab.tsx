import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { DEFAULT_MEDICAL_INFO, getMedicalInfo, setMedicalInfo } from '../store/db';
import { formatMedicalInfoText, hasMedicalInfo } from '../safety/medicalInfo';
import { QRCode } from '../ui/QRCode';
import type { MedicalInfo } from '../store/types';

// Feature review, Aug 2026: "for children who wander off or get lost — a
// first responder could scan a code to access key medical/contact
// information." Edited here, in Parent Mode; shown to anyone via the
// always-available Medical Info button, no PIN needed to view it — see
// MedicalInfoButton.tsx for why.
export function MedicalInfoTab() {
  const info = useSignal<MedicalInfo>(DEFAULT_MEDICAL_INFO);
  const loaded = useSignal(false);

  useEffect(() => {
    void getMedicalInfo().then((loadedInfo) => {
      info.value = loadedInfo;
      loaded.value = true;
    });
  }, []);

  async function update(next: MedicalInfo): Promise<void> {
    info.value = next;
    await setMedicalInfo(next);
  }

  function updateContact(index: number, field: 'name' | 'phone', value: string): void {
    const contacts = info.value.contacts.map((contact, i) =>
      i === index ? { ...contact, [field]: value } : contact,
    );
    void update({ ...info.value, contacts });
  }

  function addContact(): void {
    void update({ ...info.value, contacts: [...info.value.contacts, { name: '', phone: '' }] });
  }

  function removeContact(index: number): void {
    void update({ ...info.value, contacts: info.value.contacts.filter((_, i) => i !== index) });
  }

  if (!loaded.value) return null;

  return (
    <div class="parent-mode-screen__body medical-info-tab">
      <p class="medical-info-tab__hint">
        Shown to anyone who presses the Medical Info button — not gated behind the PIN, so a
        stranger who's found the child can read it straight away.
      </p>

      <label class="medical-info-tab__field">
        Child's name
        <input
          type="text"
          value={info.value.childName}
          onInput={(event) => void update({ ...info.value, childName: (event.target as HTMLInputElement).value })}
        />
      </label>

      <label class="medical-info-tab__field">
        Allergies
        <textarea
          value={info.value.allergies}
          onInput={(event) =>
            void update({ ...info.value, allergies: (event.target as HTMLTextAreaElement).value })
          }
        />
      </label>

      <label class="medical-info-tab__field">
        Conditions
        <textarea
          value={info.value.conditions}
          onInput={(event) =>
            void update({ ...info.value, conditions: (event.target as HTMLTextAreaElement).value })
          }
        />
      </label>

      <div class="medical-info-tab__contacts">
        <h2 class="medical-info-tab__heading">Emergency contacts</h2>
        {info.value.contacts.map((contact, index) => (
          <div class="medical-info-tab__contact-row" key={index}>
            <input
              type="text"
              placeholder="Name"
              value={contact.name}
              onInput={(event) => updateContact(index, 'name', (event.target as HTMLInputElement).value)}
            />
            <input
              type="tel"
              placeholder="Phone"
              value={contact.phone}
              onInput={(event) => updateContact(index, 'phone', (event.target as HTMLInputElement).value)}
            />
            <button
              type="button"
              class="medical-info-tab__remove"
              onClick={() => removeContact(index)}
              aria-label={`Remove ${contact.name || 'this contact'}`}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" class="parent-mode-screen__button" onClick={addContact}>
          Add a contact
        </button>
      </div>

      <div class="medical-info-tab__preview">
        <h2 class="medical-info-tab__heading">Preview — what a scan or press shows</h2>
        {hasMedicalInfo(info.value) ? (
          <>
            <QRCode class="medical-info-tab__qr" text={formatMedicalInfoText(info.value)} />
            <pre class="medical-info-tab__text">{formatMedicalInfoText(info.value)}</pre>
          </>
        ) : (
          <p class="medical-info-tab__empty">Nothing entered yet — the Medical Info button will say so.</p>
        )}
      </div>
    </div>
  );
}
