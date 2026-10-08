import type { MedicalInfo } from '../store/types';

/** The longer details, in the order they are shown and printed. Each is plain words, written by an adult. */
export const MEDICAL_FIELDS: {
  id: Exclude<keyof MedicalInfo, 'childName' | 'allergies' | 'conditions' | 'contacts'>;
  label: string;
  hint: string;
  /** Short enough to keep in the small code a phone scans. */
  short?: boolean;
}[] = [
  { id: 'medicines', label: 'Medicines', hint: 'Names, doses and times. Anything that must never be missed.', short: true },
  { id: 'equipment', label: 'Equipment and aids', hint: 'For example a feeding tube, pump, hearing aids, oxygen, a wheelchair.', short: true },
  { id: 'eating', label: 'Eating and drinking', hint: 'Choking risks, a thickened drink, tube feeding, foods to avoid.' },
  { id: 'moving', label: 'Moving about', hint: 'Can walk or not, needs a wheelchair, how to lift or help safely.' },
  { id: 'hearingSight', label: 'Hearing and sight', hint: 'Hearing loss, glasses, needing to be spoken to from one side.' },
  { id: 'communication', label: 'How I communicate', hint: 'For example: I do not speak. I use this device. Please give me time and show me a picture.', short: true },
  { id: 'pain', label: 'How I show pain or being unwell', hint: 'What to look for if I cannot say: crying, going quiet, holding a part of me.' },
  { id: 'emergencyPlan', label: 'In an emergency', hint: 'A seizure plan, an asthma plan, or what to do first.', short: true },
  { id: 'doctor', label: 'Doctor or surgery', hint: 'Name and phone number.' },
  { id: 'hospital', label: 'Hospital and consultant', hint: 'Where I am known, and who looks after me.' },
  { id: 'nhsNumber', label: 'NHS number', hint: 'Optional. Anyone who presses Medical Info can see it.', short: true },
];

const filled = (value: string | undefined): string => (value ?? '').trim();

/** Whether there's anything worth showing at all, an empty record means
 * nobody's set this up yet. */
export function hasMedicalInfo(info: MedicalInfo): boolean {
  return Boolean(
    info.childName.trim() ||
      info.allergies.trim() ||
      info.conditions.trim() ||
      MEDICAL_FIELDS.some((field) => filled(info[field.id])) ||
      info.contacts.some((contact) => contact.name.trim() || contact.phone.trim()),
  );
}

function oneLine(text: string): string {
  return text.replace(/\s*\n\s*/g, '; ');
}

function lines(info: MedicalInfo, only?: (field: (typeof MEDICAL_FIELDS)[number]) => boolean): string[] {
  const out: string[] = [];
  out.push(`MEDICAL INFORMATION${info.childName.trim() ? ` - ${info.childName.trim()}` : ''}`);
  if (info.allergies.trim()) out.push(`Allergies: ${oneLine(info.allergies.trim())}`);
  if (info.conditions.trim()) out.push(`Conditions: ${oneLine(info.conditions.trim())}`);
  for (const field of MEDICAL_FIELDS) {
    if (only && !only(field)) continue;
    const value = filled(info[field.id]);
    if (value) out.push(`${field.label}: ${oneLine(value)}`);
  }
  for (const contact of info.contacts) {
    if (!contact.name.trim() && !contact.phone.trim()) continue;
    out.push(`Emergency contact: ${contact.name.trim()} ${contact.phone.trim()}`.trim());
  }
  return out;
}

/**
 * Plain text, not a link, this is what a responder reads on the screen,
 * and it works with the network cable pulled and no device to fetch a page
 * from (PRINCIPLES.md I1).
 */
export function formatMedicalInfoText(info: MedicalInfo): string {
  return lines(info).join('\n');
}

/** A scanner reads a small code more reliably, so a long record is cut to what matters most. */
export const QR_TEXT_LIMIT = 1000;

/**
 * What goes in the code. The whole record if it is short enough; otherwise
 * the essentials (name, allergies, conditions, medicines, equipment, how the
 * child communicates, the emergency plan, the NHS number and the contacts),
 * so the code stays easy to scan. Anyone can read the rest on the screen.
 */
export function formatMedicalQrText(info: MedicalInfo): string {
  const full = formatMedicalInfoText(info);
  if (full.length <= QR_TEXT_LIMIT) return full;
  const compact = lines(info, (field) => field.short === true).join('\n');
  return compact.length <= QR_TEXT_LIMIT ? compact : `${compact.slice(0, QR_TEXT_LIMIT - 1).trimEnd()}…`;
}
