import { APP_NAME } from '../ui/deviceName';

// Shown for the moment it takes to open the saved settings. It is still on
// purpose: a spinner is movement, and the rest of the app has none.
export function SplashScreen() {
  return (
    <div class="splash" role="status" aria-label="Getting ready">
      <svg class="splash__mark" viewBox="0 0 120 120" aria-hidden="true">
        <rect x="8" y="14" width="104" height="72" rx="22" fill="var(--color-accent)" />
        <path d="M34 86 L28 108 L58 86 Z" fill="var(--color-accent)" />
        <circle cx="38" cy="50" r="7" fill="var(--color-background)" />
        <circle cx="60" cy="50" r="7" fill="var(--color-background)" />
        <circle cx="82" cy="50" r="7" fill="var(--color-background)" />
      </svg>
      <h1 class="splash__name">{APP_NAME}</h1>
      <p class="splash__note">Getting ready</p>
    </div>
  );
}
