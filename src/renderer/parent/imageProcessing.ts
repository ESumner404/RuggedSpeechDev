/**
 * Downscale target for any stored photo (PLAN.md Phase 4: "max 800px on
 * the long edge"). Pure sizing math — kept separate from the actual
 * canvas drawing so it's testable without a DOM canvas.
 */
export function computeDownscaledSize(
  width: number,
  height: number,
  maxLongEdge = 800,
): { width: number; height: number } {
  const longEdge = Math.max(width, height);
  if (longEdge <= maxLongEdge) return { width, height };
  const scale = maxLongEdge / longEdge;
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

/**
 * Draws a camera frame or imported image onto a canvas at the downscaled
 * size and returns the result as a JPEG blob — never a filesystem path,
 * so a backup file stays self-contained (CLAUDE.md §4).
 */
export function downscaleToBlob(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  maxLongEdge = 800,
): Promise<Blob> {
  const { width, height } = computeDownscaledSize(sourceWidth, sourceHeight, maxLongEdge);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return Promise.reject(new Error('2D canvas context unavailable'));
  ctx.drawImage(source, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('canvas.toBlob produced no blob'))),
      'image/jpeg',
      0.85,
    );
  });
}
