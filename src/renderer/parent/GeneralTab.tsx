import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';

// Off by default (PLAN.md Phase 8) — a real Windows login-item setting,
// read live from the OS rather than cached in this app's own database.
export function GeneralTab() {
  const openAtLogin = useSignal<boolean | null>(null);

  useEffect(() => {
    void window.myWords.startup.getOpenAtLogin().then((value) => (openAtLogin.value = value));
  }, []);

  async function toggle(): Promise<void> {
    const next = !openAtLogin.value;
    await window.myWords.startup.setOpenAtLogin(next);
    openAtLogin.value = next;
  }

  if (openAtLogin.value === null) return null;

  return (
    <div class="parent-mode-screen__body general-tab">
      <label class="general-tab__checkbox">
        <input type="checkbox" checked={openAtLogin.value} onChange={() => void toggle()} />
        Start when Windows starts
      </label>
      <p class="general-tab__hint">Off by default. On, the app opens automatically after login.</p>
    </div>
  );
}
