const { extractPalette, averageColor, dominantChannel } = require('./quantize');

describe('averageColor', () => {
  test('returns [0,0,0] for empty array', () => {
    expect(averageColor([])).toEqual([0, 0, 0]);
  });

  test('returns the single pixel for a one-element array', () => {
    expect(averageColor([[100, 150, 200]])).toEqual([100, 150, 200]);
  });

  test('averages multiple pixels correctly', () => {
    const pixels = [[0, 0, 0], [100, 200, 50], [50, 100, 100]];
    expect(averageColor(pixels)).toEqual([50, 100, 50]);
  });
});

describe('dominantChannel', () => {
  test('identifies red as dominant channel', () => {
    const pixels = [[0, 10, 10], [255, 20, 15], [128, 15, 12]];
    expect(dominantChannel(pixels)).toBe(0);
  });

  test('identifies green as dominant channel', () => {
    const pixels = [[10, 0, 10], [12, 255, 15], [11, 128, 12]];
    expect(dominantChannel(pixels)).toBe(1);
  });

  test('identifies blue as dominant channel', () => {
    const pixels = [[10, 10, 0], [12, 12, 255], [11, 11, 128]];
    expect(dominantChannel(pixels)).toBe(2);
  });
});

describe('extractPalette', () => {
  test('returns empty array for no pixels', () => {
    expect(extractPalette([])).toEqual([]);
  });

  test('throws if paletteSize is not a power of 2', () => {
    expect(() => extractPalette([[255, 0, 0]], 3)).toThrow();
  });

  test('returns correct number of colors', () => {
    const pixels = Array.from({ length: 100 }, (_, i) => [
      (i * 2) % 256,
      (i * 3) % 256,
      (i * 5) % 256,
    ]);
    const palette = extractPalette(pixels, 8);
    expect(palette).toHaveLength(8);
  });

  test('each color in palette is a valid [r,g,b] triplet', () => {
    const pixels = [[255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 255, 0]];
    const palette = extractPalette(pixels, 4);
    for (const color of palette) {
      expect(color).toHaveLength(3);
      color.forEach((channel) => {
        expect(channel).toBeGreaterThanOrEqual(0);
        expect(channel).toBeLessThanOrEqual(255);
      });
    }
  });

  test('palette size of 1 returns single average color', () => {
    const pixels = [[100, 100, 100], [200, 200, 200]];
    const palette = extractPalette(pixels, 1);
    expect(palette).toHaveLength(1);
    expect(palette[0]).toEqual([150, 150, 150]);
  });
});
