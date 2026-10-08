import type { BackupPayload } from '../store/db';

// The backup file is a single JSON envelope (PRINCIPLES.md I2: an explicit,
// self-contained file the adult controls). Encryption is optional because
// the file can contain a child's photographs and contact details, when
// used, it's AES-GCM with a PBKDF2-derived key, entirely in the renderer via
// Web Crypto, so no passphrase or key material ever needs to leave this
// process or touch disk unencrypted.

// Kept as the original app name from before the "Rugged Speech Test" / "Rugged Speech Test"
// renames, it's an internal format tag stored inside every backup file,
// invisible to the user, and changing it would make every backup made
// before a rename fail to import (the check below is an exact string
// match).
const FORMAT = 'my-words-backup';
const ENVELOPE_VERSION = 1;
const PBKDF2_ITERATIONS = 210_000;

type PlainEnvelope = {
  format: typeof FORMAT;
  version: typeof ENVELOPE_VERSION;
  encrypted: false;
  payload: BackupPayload;
};

type EncryptedEnvelope = {
  format: typeof FORMAT;
  version: typeof ENVELOPE_VERSION;
  encrypted: true;
  salt: string;
  iv: string;
  ciphertext: string;
};

type Envelope = PlainEnvelope | EncryptedEnvelope;

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function encodeBackup(payload: BackupPayload, passphrase?: string): Promise<string> {
  if (!passphrase) {
    const envelope: PlainEnvelope = { format: FORMAT, version: ENVELOPE_VERSION, encrypted: false, payload };
    return JSON.stringify(envelope);
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const plaintext = new TextEncoder().encode(JSON.stringify(payload));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv as BufferSource }, key, plaintext);

  const envelope: EncryptedEnvelope = {
    format: FORMAT,
    version: ENVELOPE_VERSION,
    encrypted: true,
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(new Uint8Array(ciphertext)),
  };
  return JSON.stringify(envelope);
}

export class BackupFormatError extends Error {}
export class BackupPassphraseError extends Error {}

/** Whether a backup file needs a passphrase, without decrypting it. */
export function backupNeedsPassphrase(fileText: string): boolean {
  const envelope = parseEnvelope(fileText);
  return envelope.encrypted;
}

function parseEnvelope(fileText: string): Envelope {
  let parsed: unknown;
  try {
    parsed = JSON.parse(fileText);
  } catch {
    throw new BackupFormatError('This file is not a Rugged Speech Test backup.');
  }
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    (parsed as { format?: unknown }).format !== FORMAT
  ) {
    throw new BackupFormatError('This file is not a Rugged Speech Test backup.');
  }
  return parsed as Envelope;
}

export async function decodeBackup(fileText: string, passphrase?: string): Promise<BackupPayload> {
  const envelope = parseEnvelope(fileText);

  if (!envelope.encrypted) {
    return envelope.payload;
  }

  if (!passphrase) {
    throw new BackupPassphraseError('This backup is protected by a passphrase.');
  }

  const salt = base64ToBytes(envelope.salt);
  const iv = base64ToBytes(envelope.iv);
  const key = await deriveKey(passphrase, salt);

  try {
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv as BufferSource },
      key,
      base64ToBytes(envelope.ciphertext) as BufferSource,
    );
    return JSON.parse(new TextDecoder().decode(plaintext)) as BackupPayload;
  } catch {
    throw new BackupPassphraseError('That passphrase is not correct for this backup.');
  }
}
