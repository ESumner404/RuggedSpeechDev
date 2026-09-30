import { useSignal } from '@preact/signals';
import { getMedicalInfo } from '../store/db';
import { formatMedicalInfoText, hasMedicalInfo } from './medicalInfo';
import { QRCode } from '../ui/QRCode';
import type { MedicalInfo } from '../store/types';

const EMPTY: MedicalInfo = { childName: '', allergies: '', conditions: '', contacts: [] };

// Always reachable, on every screen, without the Parent PIN (feature
// review, Aug 2026) — a first responder who's found a lost child needs
// this immediately, not after guessing a 4-digit code. CLAUDE.md §6's
// "shown only on an explicit press, never on an idle screen a stranger
// could read" is about idle visibility, not authentication: pressing this
// button IS the explicit press.
export function MedicalInfoButton() {
  const open = useSignal(false);
  const info = useSignal<MedicalInfo>(EMPTY);

  async function handlePress(): Promise<void> {
    info.value = await getMedicalInfo();
    open.value = true;
  }

  return (
    <>
      <button type="button" class="medical-info-button" onClick={() => void handlePress()}>
        <span class="medical-info-button__icon" aria-hidden="true">
          ➕
        </span>
        Medical Info
      </button>
      {open.value && (
        <div class="medical-info-overlay">
          <div class="medical-info-overlay__panel">
            {hasMedicalInfo(info.value) ? (
              <>
                <QRCode class="medical-info-overlay__qr" text={formatMedicalInfoText(info.value)} />
                <pre class="medical-info-overlay__text">{formatMedicalInfoText(info.value)}</pre>
              </>
            ) : (
              <p class="medical-info-overlay__empty">
                No medical information has been set up for this device yet. An adult can add it in
                Parent Mode.
              </p>
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
