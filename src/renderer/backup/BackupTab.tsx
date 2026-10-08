import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { exportBackupPayload, importBackupPayload, lastBackupSetting } from '../store/db';
import { BackupFormatError, BackupPassphraseError, backupNeedsPassphrase, decodeBackup, encodeBackup } from './backupCodec';

type RestoreStep = 'idle' | 'needs-passphrase' | 'confirming' | 'done';

// Backup and restore to a single file via the native dialog (docs/build-plan.md Phase
// 6). Restoring replaces everything on the device, so it gets its own
// explicit confirmation step beyond the file picker itself, the whole
// point of I2 is that nothing about the child's data moves without an
// adult deliberately choosing it.
export function BackupTab() {
  const encryptSave = useSignal(false);
  const savePassphrase = useSignal('');
  const saveConfirmPassphrase = useSignal('');
  const saveStatus = useSignal<string | null>(null);
  const saveError = useSignal<string | null>(null);
  const saving = useSignal(false);

  useEffect(() => {
    void lastBackupSetting.load();
  }, []);

  const restoreStep = useSignal<RestoreStep>('idle');
  const restoreFileData = useSignal<string | null>(null);
  const restorePassphrase = useSignal('');
  const restoreError = useSignal<string | null>(null);
  const restoring = useSignal(false);

  async function handleSave(): Promise<void> {
    saveError.value = null;
    saveStatus.value = null;

    if (encryptSave.value) {
      if (!savePassphrase.value) {
        saveError.value = 'Enter a passphrase, or turn off passphrase protection.';
        return;
      }
      if (savePassphrase.value !== saveConfirmPassphrase.value) {
        saveError.value = 'Those two passphrases do not match.';
        return;
      }
    }

    saving.value = true;
    try {
      const payload = await exportBackupPayload();
      const encoded = await encodeBackup(payload, encryptSave.value ? savePassphrase.value : undefined);
      const result = await window.myWords.backup.save(encoded);
      saveStatus.value = result.ok ? 'Backup saved.' : null;
      if (result.ok) {
        await lastBackupSetting.set(Date.now());
        savePassphrase.value = '';
        saveConfirmPassphrase.value = '';
      }
    } catch (err) {
      saveError.value = err instanceof Error ? err.message : String(err);
    } finally {
      saving.value = false;
    }
  }

  async function handlePickRestoreFile(): Promise<void> {
    restoreError.value = null;
    restoreStep.value = 'idle';
    const result = await window.myWords.backup.restore();
    if (!result.ok) return;

    let needsPassphrase: boolean;
    try {
      needsPassphrase = backupNeedsPassphrase(result.data);
    } catch (err) {
      restoreError.value = err instanceof BackupFormatError ? err.message : 'Could not read that file.';
      return;
    }

    restoreFileData.value = result.data;
    restoreStep.value = needsPassphrase ? 'needs-passphrase' : 'confirming';
  }

  function handleUnlockRestore(): void {
    restoreError.value = null;
    restoreStep.value = 'confirming';
  }

  async function handleConfirmRestore(): Promise<void> {
    if (!restoreFileData.value) return;
    restoreError.value = null;
    restoring.value = true;
    try {
      const payload = await decodeBackup(restoreFileData.value, restorePassphrase.value || undefined);
      await importBackupPayload(payload);
      restoreStep.value = 'done';
      restoreFileData.value = null;
      restorePassphrase.value = '';
    } catch (err) {
      if (err instanceof BackupPassphraseError) {
        restoreError.value = err.message;
        restoreStep.value = 'needs-passphrase';
      } else {
        restoreError.value = err instanceof Error ? err.message : String(err);
      }
    } finally {
      restoring.value = false;
    }
  }

  function handleCancelRestore(): void {
    restoreStep.value = 'idle';
    restoreFileData.value = null;
    restorePassphrase.value = '';
    restoreError.value = null;
  }

  return (
    <div class="parent-mode-screen__body backup-tab">
      <section class="backup-tab__section">
        <h2 class="backup-tab__heading">Save a backup</h2>
        <p class="backup-tab__last">
          {lastBackupSetting.signal.value === null
            ? 'Last backup: never on this computer.'
            : `Last backup: ${new Date(lastBackupSetting.signal.value).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}.`}
        </p>
        <p class="backup-tab__hint">
          One file with everything: boards, photos, people, places, My Day. Optionally
          protect it with a passphrase, since it can contain a child's photographs and
          contact details.
        </p>
        <label class="backup-tab__checkbox">
          <input
            type="checkbox"
            checked={encryptSave.value}
            onChange={(event) => (encryptSave.value = (event.target as HTMLInputElement).checked)}
          />
          Protect with a passphrase
        </label>
        {encryptSave.value && (
          <div class="backup-tab__passphrase-fields">
            <input
              type="password"
              placeholder="Passphrase"
              value={savePassphrase.value}
              onInput={(event) => (savePassphrase.value = (event.target as HTMLInputElement).value)}
              aria-label="Passphrase"
            />
            <input
              type="password"
              placeholder="Confirm passphrase"
              value={saveConfirmPassphrase.value}
              onInput={(event) => (saveConfirmPassphrase.value = (event.target as HTMLInputElement).value)}
              aria-label="Confirm passphrase"
            />
          </div>
        )}
        {saveError.value && <p class="parent-mode-screen__error">{saveError.value}</p>}
        {saveStatus.value && <p class="backup-tab__status">{saveStatus.value}</p>}
        <button type="button" class="parent-mode-screen__button" disabled={saving.value} onClick={() => void handleSave()}>
          {saving.value ? 'Saving…' : 'Save backup…'}
        </button>
      </section>

      <section class="backup-tab__section">
        <h2 class="backup-tab__heading">Restore from a backup</h2>
        <p class="backup-tab__hint">
          This replaces everything currently on this device with the contents of the backup
          file. It cannot be undone.
        </p>

        {restoreStep.value === 'idle' && (
          <button type="button" class="parent-mode-screen__button" onClick={() => void handlePickRestoreFile()}>
            Choose backup file…
          </button>
        )}

        {restoreStep.value === 'needs-passphrase' && (
          <div class="backup-tab__passphrase-fields">
            <input
              type="password"
              placeholder="Passphrase"
              value={restorePassphrase.value}
              onInput={(event) => (restorePassphrase.value = (event.target as HTMLInputElement).value)}
              aria-label="Backup passphrase"
            />
            <button type="button" class="parent-mode-screen__button" onClick={handleUnlockRestore}>
              Continue
            </button>
            <button type="button" class="parent-mode-screen__button" onClick={handleCancelRestore}>
              Cancel
            </button>
          </div>
        )}

        {restoreStep.value === 'confirming' && (
          <div class="backup-tab__confirm">
            <p class="backup-tab__warning">
              Replace everything on this device with this backup? This cannot be undone.
            </p>
            <button
              type="button"
              class="parent-mode-screen__button"
              disabled={restoring.value}
              onClick={() => void handleConfirmRestore()}
            >
              {restoring.value ? 'Restoring…' : 'Yes, replace everything'}
            </button>
            <button type="button" class="parent-mode-screen__button" onClick={handleCancelRestore}>
              Cancel
            </button>
          </div>
        )}

        {restoreStep.value === 'done' && <p class="backup-tab__status">Backup restored.</p>}
        {restoreError.value && <p class="parent-mode-screen__error">{restoreError.value}</p>}
      </section>
    </div>
  );
}
