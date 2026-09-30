import type { MedicalInfo } from '../store/types';

/** Whether there's anything worth showing at all — an empty record means
 * nobody's set this up yet. */
export function hasMedicalInfo(info: MedicalInfo): boolean {
  return Boolean(
    info.childName.trim() ||
      info.allergies.trim() ||
      info.conditions.trim() ||
      info.contacts.some((contact) => contact.name.trim() || contact.phone.trim()),
  );
}

/**
 * Plain text, not a link — this is what gets encoded directly into the QR
 * code (feature review, Aug 2026), so it has to work with the network
 * cable pulled and no device to fetch a page from (CLAUDE.md I1). Any
 * phone's camera app can read it without installing anything, and it
 * doubles as the on-screen text a responder without a scanner can read
 * directly.
 */
export function formatMedicalInfoText(info: MedicalInfo): string {
  const lines: string[] = [];
  lines.push(`MEDICAL INFORMATION${info.childName.trim() ? ` — ${info.childName.trim()}` : ''}`);
  if (info.allergies.trim()) lines.push(`Allergies: ${info.allergies.trim()}`);
  if (info.conditions.trim()) lines.push(`Conditions: ${info.conditions.trim()}`);
  for (const contact of info.contacts) {
    if (!contact.name.trim() && !contact.phone.trim()) continue;
    lines.push(`Emergency contact: ${contact.name.trim()} ${contact.phone.trim()}`.trim());
  }
  return lines.join('\n');
}
