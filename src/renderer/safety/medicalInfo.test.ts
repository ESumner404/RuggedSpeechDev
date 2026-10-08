import { describe, expect, it } from 'vitest';
import { QR_TEXT_LIMIT, formatMedicalInfoText, formatMedicalQrText, hasMedicalInfo } from './medicalInfo';
import type { MedicalInfo } from '../store/types';

const EMPTY: MedicalInfo = { childName: '', allergies: '', conditions: '', contacts: [] };

describe('hasMedicalInfo (feature review, Aug 2026)', () => {
  it('is false for a completely empty record', () => {
    expect(hasMedicalInfo(EMPTY)).toBe(false);
  });

  it('is false when contacts exist but both their fields are blank', () => {
    expect(hasMedicalInfo({ ...EMPTY, contacts: [{ name: '', phone: '' }] })).toBe(false);
  });

  it('is true once any single field has real content', () => {
    expect(hasMedicalInfo({ ...EMPTY, childName: 'Sam' })).toBe(true);
    expect(hasMedicalInfo({ ...EMPTY, allergies: 'Peanuts' })).toBe(true);
    expect(hasMedicalInfo({ ...EMPTY, conditions: 'Asthma' })).toBe(true);
    expect(hasMedicalInfo({ ...EMPTY, contacts: [{ name: 'Mum', phone: '' }] })).toBe(true);
  });
});

describe('formatMedicalInfoText', () => {
  it('is just a title when nothing else is set', () => {
    expect(formatMedicalInfoText(EMPTY)).toBe('MEDICAL INFORMATION');
  });

  it('includes the child\'s name in the title when given', () => {
    expect(formatMedicalInfoText({ ...EMPTY, childName: 'Sam' })).toBe('MEDICAL INFORMATION - Sam');
  });

  it('lists allergies, conditions and contacts on their own lines', () => {
    const info: MedicalInfo = {
      childName: 'Sam',
      allergies: 'Peanuts, penicillin',
      conditions: 'Asthma',
      contacts: [
        { name: 'Mum', phone: '07700 900001' },
        { name: 'Dad', phone: '07700 900002' },
      ],
    };
    expect(formatMedicalInfoText(info)).toBe(
      [
        'MEDICAL INFORMATION - Sam',
        'Allergies: Peanuts, penicillin',
        'Conditions: Asthma',
        'Emergency contact: Mum 07700 900001',
        'Emergency contact: Dad 07700 900002',
      ].join('\n'),
    );
  });

  it('skips a contact row that has neither a name nor a phone number', () => {
    const info: MedicalInfo = { ...EMPTY, contacts: [{ name: '', phone: '' }, { name: 'Mum', phone: '' }] };
    expect(formatMedicalInfoText(info)).toBe('MEDICAL INFORMATION\nEmergency contact: Mum');
  });

  it('trims stray whitespace from every field', () => {
    const info: MedicalInfo = {
      childName: '  Sam  ',
      allergies: '  Peanuts  ',
      conditions: '',
      contacts: [{ name: '  Mum  ', phone: '  07700 900001  ' }],
    };
    expect(formatMedicalInfoText(info)).toBe(
      'MEDICAL INFORMATION - Sam\nAllergies: Peanuts\nEmergency contact: Mum 07700 900001',
    );
  });
});

describe('the longer medical details', () => {
  const base: MedicalInfo = { childName: 'Sam', allergies: 'Nuts', conditions: 'Asthma', contacts: [{ name: 'Mum', phone: '07700 900001' }] };

  it('are shown after the conditions and before the contacts, one line each', () => {
    const text = formatMedicalInfoText({
      ...base,
      medicines: 'Inhaler, two puffs',
      equipment: 'Feeding tube',
      communication: 'I do not speak. I use this device.',
      emergencyPlan: 'Sit me up and call 999',
      nhsNumber: '123 456 7890',
    }).split('\n');
    expect(text).toEqual([
      'MEDICAL INFORMATION - Sam',
      'Allergies: Nuts',
      'Conditions: Asthma',
      'Medicines: Inhaler, two puffs',
      'Equipment and aids: Feeding tube',
      'How I communicate: I do not speak. I use this device.',
      'In an emergency: Sit me up and call 999',
      'NHS number: 123 456 7890',
      'Emergency contact: Mum 07700 900001',
    ]);
  });

  it('count as something to show even with nothing else', () => {
    expect(hasMedicalInfo({ ...EMPTY, pain: 'Goes quiet and holds his tummy' })).toBe(true);
    expect(hasMedicalInfo({ ...EMPTY, doctor: '   ' })).toBe(false);
  });

  it('keep a long record scannable: the code holds the essentials, the screen holds everything', () => {
    const long = { ...base, medicines: 'Inhaler', eating: 'x'.repeat(1200), emergencyPlan: 'Call 999', hospital: 'y'.repeat(300) };
    const qr = formatMedicalQrText(long);
    expect(qr.length).toBeLessThanOrEqual(QR_TEXT_LIMIT);
    expect(qr).toContain('Medicines: Inhaler');
    expect(qr).toContain('In an emergency: Call 999');
    expect(qr).toContain('Emergency contact: Mum');
    expect(qr).not.toContain('Eating and drinking');
    expect(formatMedicalInfoText(long)).toContain('Eating and drinking');
  });

  it('use the whole record in the code while it is short', () => {
    expect(formatMedicalQrText(base)).toBe(formatMedicalInfoText(base));
  });

  it('turn line breaks into one line, so a code or a list stays tidy', () => {
    expect(formatMedicalInfoText({ ...base, medicines: 'Inhaler\nVitamin D' })).toContain('Medicines: Inhaler; Vitamin D');
  });
});
