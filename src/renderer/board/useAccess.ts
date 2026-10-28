import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { DEFAULT_ACCESS_SETTINGS, accessSettingsVersion, getAccessSettings } from '../store/db';

/** The access settings (hold-to-select time, quieter colours), kept up to date while a screen is open. */
export function useAccess() {
  const access = useSignal(DEFAULT_ACCESS_SETTINGS);
  const version = accessSettingsVersion.value;
  useEffect(() => {
    void getAccessSettings().then((settings) => (access.value = settings));
  }, [version]);
  return access.value;
}
