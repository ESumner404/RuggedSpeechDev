import { render } from 'preact';
import { afterEach, describe, expect, it } from 'vitest';
import { QRCode } from './QRCode';

describe('QRCode component', () => {
  let container: HTMLElement;

  afterEach(() => {
    render(null, container);
  });

  it('draws the code as a labelled picture, without putting the text into the markup', () => {
    container = document.createElement('div');
    render(<QRCode text="Allergies: peanuts" label="QR code of medical information" class="mine" />, container);
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-label')).toBe('QR code of medical information');
    expect(container.innerHTML).not.toContain('peanuts');
    expect(container.querySelector('.qr-code.mine')).not.toBeNull();
  });

  it('explains, instead of crashing, when there is too much text for one code', () => {
    container = document.createElement('div');
    render(<QRCode text={'x'.repeat(6000)} />, container);
    expect(container.querySelector('svg')).toBeNull();
    expect(container.querySelector('.qr-code__too-long')?.textContent).toContain('too much text');
  });

  it('draws nothing for empty text', () => {
    container = document.createElement('div');
    render(<QRCode text="" />, container);
    expect(container.innerHTML).toBe('');
  });
});
