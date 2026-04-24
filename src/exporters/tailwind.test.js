const { rgbToHex, exportTailwindTheme, exportTailwindJson } = require('./tailwind');

describe('rgbToHex', () => {
  test('converts white', () => {
    expect(rgbToHex([255, 255, 255])).toBe('#ffffff');
  });

  test('converts black', () => {
    expect(rgbToHex([0, 0, 0])).toBe('#000000');
  });

  test('converts a mid-range color', () => {
    expect(rgbToHex([255, 87, 51])).toBe('#ff5733');
  });

  test('rounds float values', () => {
    expect(rgbToHex([254.6, 86.4, 51.2])).toBe('#ff5633');
  });
});

describe('exportTailwindTheme', () => {
  const palette = [
    [255, 87, 51],
    [51, 87, 255],
    [87, 255, 51],
  ];

  test('returns a string', () => {
    expect(typeof exportTailwindTheme(palette)).toBe('string');
  });

  test('contains module.exports', () => {
    expect(exportTailwindTheme(palette)).toContain('module.exports');
  });

  test('uses default color name', () => {
    expect(exportTailwindTheme(palette)).toContain('palette:');
  });

  test('uses custom color name', () => {
    expect(exportTailwindTheme(palette, 'brand')).toContain('brand:');
  });

  test('contains hex values for each color', () => {
    const output = exportTailwindTheme(palette);
    expect(output).toContain('#ff5733');
    expect(output).toContain('#3357ff');
    expect(output).toContain('#57ff33');
  });

  test('ends with newline', () => {
    expect(exportTailwindTheme(palette).endsWith('\n')).toBe(true);
  });
});

describe('exportTailwindJson', () => {
  const palette = [[255, 0, 0], [0, 255, 0]];

  test('returns valid JSON', () => {
    expect(() => JSON.parse(exportTailwindJson(palette))).not.toThrow();
  });

  test('has colors key', () => {
    const parsed = JSON.parse(exportTailwindJson(palette));
    expect(parsed).toHaveProperty('colors');
  });

  test('uses custom color name', () => {
    const parsed = JSON.parse(exportTailwindJson(palette, 'primary'));
    expect(parsed.colors).toHaveProperty('primary');
  });

  test('contains correct hex values', () => {
    const parsed = JSON.parse(exportTailwindJson(palette));
    const values = Object.values(parsed.colors.palette);
    expect(values).toContain('#ff0000');
    expect(values).toContain('#00ff00');
  });
});
