import { buildQrMatrix, qrToSvg } from './qr';

type Props = {
  text: string;
  class?: string;
  // What a screen reader says for the picture. Never the text itself, the
  // text is shown beside the code, and may be private.
  label?: string;
};

/**
 * Renders a QR code entirely offline (invariant I1): nothing is looked up
 * and nothing is fetched, and the text never leaves this machine. See
 * qr.ts for why the drawing is done here rather than by the library.
 */
export function QRCode({ text, class: className, label = 'QR code' }: Props) {
  const matrix = buildQrMatrix(text);

  if (!matrix.ok) {
    return matrix.reason === 'too-long' ? (
      <p class="qr-code__too-long">
        There is too much text to fit in one QR code. Shorten what has been entered and the code
        will appear here.
      </p>
    ) : null;
  }

  return <div class={`qr-code ${className ?? ''}`} dangerouslySetInnerHTML={{ __html: qrToSvg(matrix, label) }} />;
}
