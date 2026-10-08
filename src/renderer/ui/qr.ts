import qrcode from 'qrcode-generator';

// qrcode-generator's default text-to-bytes step keeps only the low 8 bits of
// each character, so anything outside plain ASCII (an accented name, a
// dash, an emoji) is silently scrambled and the scanned text comes out
// wrong. Phone cameras read byte-mode data as UTF-8, so encode it that way.
qrcode.stringToBytes = (text: string): number[] => Array.from(new TextEncoder().encode(text));

/** The quiet zone a scanner needs around the code, in modules (the QR
 * specification asks for four). */
export const QUIET_ZONE_MODULES = 4;

export type QrMatrix = { ok: true; size: number; modules: boolean[][] } | { ok: false; reason: 'too-long' | 'empty' };

/**
 * Builds the module grid for some text. Level 'M' recovers from about 15%
 * damage, a sensible balance for a code shown on a screen and read by a
 * phone. Returns `too-long` rather than throwing when the text will not fit
 * in even the largest code, so a long entry cannot break the screen.
 */
export function buildQrMatrix(text: string): QrMatrix {
  if (text.length === 0) return { ok: false, reason: 'empty' };
  const code = qrcode(0, 'M');
  try {
    code.addData(text);
    code.make();
  } catch {
    return { ok: false, reason: 'too-long' };
  }
  const size = code.getModuleCount();
  const modules: boolean[][] = [];
  for (let row = 0; row < size; row += 1) {
    const cells: boolean[] = [];
    for (let col = 0; col < size; col += 1) cells.push(code.isDark(row, col));
    modules.push(cells);
  }
  return { ok: true, size, modules };
}

/**
 * The code as an SVG: always black modules on a white square with a full
 * quiet zone, whatever theme, contrast mode or palette the app is using. A
 * scanner needs dark-on-light; a dark theme that inverted it would simply
 * not scan. Colours are set on the elements themselves, and one path draws
 * every module so there are no hairline gaps between neighbours.
 */
export function qrToSvg(matrix: Extract<QrMatrix, { ok: true }>, label: string): string {
  const total = matrix.size + QUIET_ZONE_MODULES * 2;
  const safeLabel = label.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  let path = '';
  for (let row = 0; row < matrix.size; row += 1) {
    for (let col = 0; col < matrix.size; col += 1) {
      if (matrix.modules[row]![col]) {
        path += `M${col + QUIET_ZONE_MODULES} ${row + QUIET_ZONE_MODULES}h1v1h-1z`;
      }
    }
  }
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" ` +
    `role="img" aria-label="${safeLabel}" shape-rendering="crispEdges" style="forced-color-adjust:none">` +
    `<rect width="${total}" height="${total}" fill="#ffffff"/>` +
    `<path d="${path}" fill="#000000"/>` +
    `</svg>`
  );
}
