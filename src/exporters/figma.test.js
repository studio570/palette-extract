const { rgbToFigmaColor, exportFigmaTokens, exportFigmaStyles } = require('./figma');

describe('rgbToFigmaColor', () => {
  it('converts black correctly', () => {
    expect(rgbToFigmaColor([0, 0, 0])).toEqual({ r: 0, g: 0, b: 0, a: 1 });
  });

  it('converts white correctly', () => {
    expect(rgbToFigmaColor([255, 255, 255])).toEqual({ r: 1, g: 1, b: 1, a: 1 });
  });

  it('converts mid-range color correctly', () => {
    const result = rgbToFigmaColor([128, 64, 192]);
    expect(result.r).toBeCloseTo(0.502, 2);
    expect(result.g).toBeCloseTo(0.251, 2);
    expect(result.b).toBeCloseTo(0.7529, 2);
    expect(result.a).toBe(1);
  });

  it('returns values between 0 and 1', () => {
    const result = rgbToFigmaColor([100, 150, 200]);
    expect(result.r).toBeGreaterThanOrEqual(0);
    expect(result.r).toBeLessThanOrEqual(1);
    expect(result.g).toBeGreaterThanOrEqual(0);
    expect(result.g).toBeLessThanOrEqual(1);
    expect(result.b).toBeGreaterThanOrEqual(0);
    expect(result.b).toBeLessThanOrEqual(1);
  });
});

describe('exportFigmaTokens', () => {
  const palette = [[255, 0, 0], [0, 255, 0], [0, 0, 255]];

  it('returns a valid JSON string', () => {
    const result = exportFigmaTokens(palette);
    expect(() => JSON.parse(result)).not.toThrow();
  });

  it('includes correct number of variables', () => {
    const result = JSON.parse(exportFigmaTokens(palette));
    expect(result.collections[0].variables).toHaveLength(3);
  });

  it('uses default collection name', () => {
    const result = JSON.parse(exportFigmaTokens(palette));
    expect(result.collections[0].name).toBe('Palette');
  });

  it('uses custom collection name', () => {
    const result = JSON.parse(exportFigmaTokens(palette, 'Brand Colors'));
    expect(result.collections[0].name).toBe('Brand Colors');
  });

  it('names variables color-1 through color-n', () => {
    const result = JSON.parse(exportFigmaTokens(palette));
    const names = result.collections[0].variables.map((v) => v.name);
    expect(names).toEqual(['color-1', 'color-2', 'color-3']);
  });

  it('sets resolvedType to COLOR', () => {
    const result = JSON.parse(exportFigmaTokens(palette));
    result.collections[0].variables.forEach((v) => {
      expect(v.resolvedType).toBe('COLOR');
    });
  });
});

describe('exportFigmaStyles', () => {
  const palette = [[255, 0, 0], [0, 0, 255]];

  it('returns a valid JSON string', () => {
    const result = exportFigmaStyles(palette);
    expect(() => JSON.parse(result)).not.toThrow();
  });

  it('contains paints object with correct keys', () => {
    const result = JSON.parse(exportFigmaStyles(palette));
    expect(result.paints).toHaveProperty('color-1');
    expect(result.paints).toHaveProperty('color-2');
  });

  it('sets type to SOLID for each style', () => {
    const result = JSON.parse(exportFigmaStyles(palette));
    Object.values(result.paints).forEach((style) => {
      expect(style.type).toBe('SOLID');
    });
  });
});
