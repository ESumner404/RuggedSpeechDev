import { describe, expect, it } from 'vitest';
import { formatMedicalInfoText, hasMedicalInfo } from './medicalInfo';
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
    expect(formatMedicalInfoText({ ...EMPTY, childName: 'Sam' })).toBe('MEDICAL INFORMATION — Sam');
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
        'MEDICAL INFORMATION — Sam',
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
      'MEDICAL INFORMATION — Sam\nAllergies: Peanuts\nEmergency contact: Mum 07700 900001',
    );
  });
});
