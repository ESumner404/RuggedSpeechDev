import { describe, expect, it } from 'vitest';
import { computeDownscaledSize } from './imageProcessing';

describe('computeDownscaledSize', () => {
  it('leaves an image alone when already within the limit', () => {
    expect(computeDownscaledSize(400, 300)).toEqual({ width: 400, height: 300 });
  });

  it('leaves an image exactly at the limit alone', () => {
    expect(computeDownscaledSize(800, 500)).toEqual({ width: 800, height: 500 });
  });

  it('scales a landscape image down so the long edge is 800', () => {
    const result = computeDownscaledSize(1600, 1200);
    expect(result.width).toBe(800);
    expect(result.height).toBe(600);
  });

  it('scales a portrait image down so the long edge is 800', () => {
    const result = computeDownscaledSize(1200, 1600);
    expect(result.width).toBe(600);
    expect(result.height).toBe(800);
  });

  it('respects a custom max long edge', () => {
    expect(computeDownscaledSize(2000, 1000, 400)).toEqual({ width: 400, height: 200 });
  });
});
