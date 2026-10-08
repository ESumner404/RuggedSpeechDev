import jsQR from 'jsqr';
import { describe, expect, it } from 'vitest';
import { buildQrMatrix, QUIET_ZONE_MODULES, qrToSvg } from './qr';
import { formatMedicalInfoText } from '../safety/medicalInfo';

const SCALE = 6;

/** Draws the finished SVG into pixels the way a screen would (black on
 * white, `SCALE` pixels per module), so what gets decoded is the real
 * output rather than the encoder's internal grid. */
function rasteriseSvg(svg: string): { data: Uint8ClampedArray; width: number; height: number } {
  const total = Number(/viewBox="0 0 (\d+) \d+"/.exec(svg)![1]);
  const pixels = total * SCALE;
  const data = new Uint8ClampedArray(pixels * pixels * 4).fill(255);
  const pathData = /<path d="([^"]*)"/.exec(svg)![1]!;
  for (const [, x, y] of pathData.matchAll(/M(\d+) (\d+)h1v1h-1z/g)) {
    for (let dy = 0; dy < SCALE; dy += 1) {
      for (let dx = 0; dx < SCALE; dx += 1) {
        const px = Number(x) * SCALE + dx;
        const py = Number(y) * SCALE + dy;
        const at = (py * pixels + px) * 4;
        data[at] = 0;
        data[at + 1] = 0;
        data[at + 2] = 0;
      }
    }
  }
  return { data, width: pixels, height: pixels };
}

function scan(text: string): string | null {
  const matrix = buildQrMatrix(text);
  if (!matrix.ok) throw new Error(`could not build a code: ${matrix.reason}`);
  const { data, width, height } = rasteriseSvg(qrToSvg(matrix, 'test'));
  return jsQR(data, width, height)?.data ?? null;
}

describe('QR code (Medical Info)', () => {
  it('scans back to exactly the text that went in', () => {
    const text = formatMedicalInfoText({
      childName: 'Sam Taylor',
      allergies: 'Peanuts, penicillin',
      conditions: 'Autism; epilepsy (carries medication)',
      contacts: [
        { name: 'Mum', phone: '07700 900001' },
        { name: 'Dad', phone: '07700 900002' },
      ],
    });
    expect(scan(text)).toBe(text);
  });

  it('keeps accented names and symbols intact instead of scrambling them', () => {
    const text = 'MEDICAL INFORMATION - Zoë Müller-Ó Briain\nAllergies: crème fraîche, £5 ñ – “quotes”';
    expect(scan(text)).toBe(text);
  });

  it('handles characters outside the basic range, such as emoji', () => {
    expect(scan('Allergy: 🥜')).toBe('Allergy: 🥜');
  });

  it('scans a long entry too', () => {
    const text = `MEDICAL INFORMATION\n${'Takes medication at 8am, 12pm and 6pm. '.repeat(20)}`;
    expect(text.length).toBeGreaterThan(700);
    expect(scan(text)).toBe(text);
  });

  it('never writes the heading with a non-ASCII dash', () => {
    const text = formatMedicalInfoText({ childName: 'Sam', allergies: '', conditions: '', contacts: [] });
    expect(/^[\x20-\x7e\n]*$/.test(text)).toBe(true);
  });

  it('is always black on white with a full quiet zone, whatever the theme', () => {
    const matrix = buildQrMatrix('hello');
    if (!matrix.ok) throw new Error('expected a code');
    const svg = qrToSvg(matrix, 'test');
    expect(svg).toContain('fill="#ffffff"');
    expect(svg).toContain('fill="#000000"');
    expect(svg).toContain('forced-color-adjust:none');

    const total = matrix.size + QUIET_ZONE_MODULES * 2;
    expect(svg).toContain(`viewBox="0 0 ${total} ${total}"`);
    const coordinates = [...svg.matchAll(/M(\d+) (\d+)h1v1h-1z/g)].map((m) => [Number(m[1]), Number(m[2])] as const);
    expect(Math.min(...coordinates.map(([x]) => x))).toBeGreaterThanOrEqual(QUIET_ZONE_MODULES);
    expect(Math.max(...coordinates.map(([x]) => x))).toBeLessThan(total - QUIET_ZONE_MODULES);
  });

  it('says so, rather than failing, when there is too much text for any code', () => {
    expect(buildQrMatrix('x'.repeat(5000))).toEqual({ ok: false, reason: 'too-long' });
  });

  it('has nothing to draw for empty text', () => {
    expect(buildQrMatrix('')).toEqual({ ok: false, reason: 'empty' });
  });

  it('keeps the entered text out of the picture markup, so a screen reader never reads it aloud unasked', () => {
    const matrix = buildQrMatrix('Sam has a private allergy');
    if (!matrix.ok) throw new Error('expected a code');
    expect(qrToSvg(matrix, 'QR code of medical information')).not.toContain('private');
  });
});
