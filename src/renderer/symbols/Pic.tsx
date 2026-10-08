import { symbolStyleSetting } from '../store/db';
import { drawnFor } from './library';

type Props = { char: string; class?: string };

/**
 * A picture for an emoji: the drawn symbol that stands for it when the
 * adult has chosen drawn symbols and there is one, and the emoji itself
 * otherwise. It is only ever a picture, so it is hidden from screen readers;
 * the word beside it says what it is.
 */
export function Pic({ char, class: className }: Props) {
  const url = symbolStyleSetting.signal.value === 'drawn' ? drawnFor(char) : undefined;
  return url ? (
    <img class={`pic pic--drawn${className ? ` ${className}` : ''}`} src={url} alt="" aria-hidden="true" draggable={false} />
  ) : (
    <span class={className} aria-hidden="true">
      {char}
    </span>
  );
}
