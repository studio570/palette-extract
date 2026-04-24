/**
 * Color quantization using median cut algorithm
 * Reduces image pixel data to a dominant color palette
 */

/**
 * Groups pixels into a bucket and finds the median cut
 * @param {number[][]} pixels - Array of [r, g, b] pixel values
 * @param {number} depth - Current recursion depth
 * @param {number} maxDepth - Maximum recursion depth (2^maxDepth = palette size)
 * @returns {number[][]} Array of dominant colors as [r, g, b]
 */
function medianCut(pixels, depth, maxDepth) {
  if (depth === maxDepth || pixels.length === 0) {
    const avg = averageColor(pixels);
    return [avg];
  }

  const channel = dominantChannel(pixels);
  pixels.sort((a, b) => a[channel] - b[channel]);

  const mid = Math.floor(pixels.length / 2);
  return [
    ...medianCut(pixels.slice(0, mid), depth + 1, maxDepth),
    ...medianCut(pixels.slice(mid), depth + 1, maxDepth),
  ];
}

/**
 * Finds the color channel with the greatest range
 * @param {number[][]} pixels
 * @returns {number} Channel index (0=R, 1=G, 2=B)
 */
function dominantChannel(pixels) {
  const mins = [255, 255, 255];
  const maxs = [0, 0, 0];

  for (const [r, g, b] of pixels) {
    mins[0] = Math.min(mins[0], r);
    mins[1] = Math.min(mins[1], g);
    mins[2] = Math.min(mins[2], b);
    maxs[0] = Math.max(maxs[0], r);
    maxs[1] = Math.max(maxs[1], g);
    maxs[2] = Math.max(maxs[2], b);
  }

  const ranges = maxs.map((max, i) => max - mins[i]);
  return ranges.indexOf(Math.max(...ranges));
}

/**
 * Computes the average color of a pixel array
 * @param {number[][]} pixels
 * @returns {number[]} Average [r, g, b]
 */
function averageColor(pixels) {
  if (pixels.length === 0) return [0, 0, 0];
  const sum = pixels.reduce(
    (acc, [r, g, b]) => [acc[0] + r, acc[1] + g, acc[2] + b],
    [0, 0, 0]
  );
  return sum.map((v) => Math.round(v / pixels.length));
}

/**
 * Extracts a dominant color palette from raw pixel data
 * @param {number[][]} pixels - Array of [r, g, b] pixel values
 * @param {number} [paletteSize=8] - Number of colors to extract (must be power of 2)
 * @returns {number[][]} Palette as array of [r, g, b] colors
 */
function extractPalette(pixels, paletteSize = 8) {
  if (pixels.length === 0) return [];
  const maxDepth = Math.log2(paletteSize);
  if (!Number.isInteger(maxDepth)) {
    throw new Error(`paletteSize must be a power of 2, got ${paletteSize}`);
  }
  return medianCut(pixels, 0, maxDepth);
}

module.exports = { extractPalette, averageColor, dominantChannel };
