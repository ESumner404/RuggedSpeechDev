import { describe, expect, it } from 'vitest';
import { BackupFormatError, BackupPassphraseError, backupNeedsPassphrase, decodeBackup, encodeBackup } from './backupCodec';
import type { BackupPayload } from '../store/db';

const SAMPLE: BackupPayload = {
  formatVersion: 1,
  boards: [],
  favourites: [],
  recent: [{ text: 'I want a drink', timestamp: 1 }],
  people: [],
  places: [],
  dayPlans: [],
  profiles: [],
  photos: {},
  voiceClips: {},
  meta: {
    recentEnabled: true,
    wordFrequency: {},
    phraseBank: { name: '', address: '', usualOrder: '', registerAnswer: '' },
    parentPin: null,
    daySettings: { view: 'today', countdownEnabled: false },
    activeProfileId: 'home',
    accessSettings: {
      dwellMs: 0,
      repeatSuppressMs: 0,
      scanningMode: 'off',
      scanIntervalMs: 1500,
      highContrast: 'off',
      textScale: 1,
      reduceMotion: false,
      lowArousalPalette: false,
    },
    medicalInfo: { childName: '', allergies: '', conditions: '', contacts: [] },
    myPages: [],
  },
};

describe('backupCodec', () => {
  it('round-trips an unencrypted backup', async () => {
    const encoded = await encodeBackup(SAMPLE);
    expect(backupNeedsPassphrase(encoded)).toBe(false);
    const decoded = await decodeBackup(encoded);
    expect(decoded).toEqual(SAMPLE);
  });

  it('round-trips a passphrase-protected backup with the right passphrase', async () => {
    const encoded = await encodeBackup(SAMPLE, 'correct horse battery staple');
    expect(backupNeedsPassphrase(encoded)).toBe(true);
    const decoded = await decodeBackup(encoded, 'correct horse battery staple');
    expect(decoded).toEqual(SAMPLE);
  });

  it('refuses to decode an encrypted backup with no passphrase given', async () => {
    const encoded = await encodeBackup(SAMPLE, 'secret');
    await expect(decodeBackup(encoded)).rejects.toBeInstanceOf(BackupPassphraseError);
  });

  it('refuses to decode an encrypted backup with the wrong passphrase', async () => {
    const encoded = await encodeBackup(SAMPLE, 'secret');
    await expect(decodeBackup(encoded, 'wrong guess')).rejects.toBeInstanceOf(BackupPassphraseError);
  });

  it('rejects a file that is not a My Speech 2 backup', async () => {
    await expect(decodeBackup('{"some": "other json"}')).rejects.toBeInstanceOf(BackupFormatError);
    await expect(decodeBackup('not even json')).rejects.toBeInstanceOf(BackupFormatError);
    expect(() => backupNeedsPassphrase('not even json')).toThrow(BackupFormatError);
  });
});
