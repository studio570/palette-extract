const { rgbToAndroidHex, exportAndroidColors, exportMaterialColors } = require('./android');

const mockPalette = [
  { rgb: [255, 87, 34], name: 'Deep Orange', index: 0 },
  { rgb: [33, 150, 243], name: 'Blue', index: 1 },
  { rgb: [76, 175, 80], name: 'Green', index: 2 },
];

describe('rgbToAndroidHex', () => {
  test('converts RGB to uppercase hex without alpha', () => {
    expect(rgbToAndroidHex([255, 87, 34])).toBe('#FF5722');
  });

  test('converts RGB to hex with full alpha (omits alpha prefix)', () => {
    expect(rgbToAndroidHex([33, 150, 243], 255)).toBe('#2196F3');
  });

  test('includes alpha prefix when alpha < 255', () => {
    expect(rgbToAndroidHex([0, 0, 0], 128)).toBe('#80000000');
  });

  test('pads single-digit hex values', () => {
    expect(rgbToAndroidHex([0, 0, 0])).toBe('#000000');
    expect(rgbToAndroidHex([1, 2, 3])).toBe('#010203');
  });
});

describe('exportAndroidColors', () => {
  test('produces valid XML structure', () => {
    const output = exportAndroidColors(mockPalette);
    expect(output).toContain('<?xml version="1.0" encoding="utf-8"?>');
    expect(output).toContain('<resources>');
    expect(output).toContain('</resources>');
  });

  test('includes color entries for each palette item', () => {
    const output = exportAndroidColors(mockPalette);
    expect(output).toContain('name="deep_orange"');
    expect(output).toContain('#FF5722');
    expect(output).toContain('name="blue"');
    expect(output).toContain('#2196F3');
  });

  test('uses index-based name when name is missing', () => {
    const palette = [{ rgb: [100, 100, 100], index: 0 }];
    const output = exportAndroidColors(palette);
    expect(output).toContain('name="palette_color_0"');
  });

  test('sanitizes name with special characters', () => {
    const palette = [{ rgb: [255, 0, 0], name: 'Red & Bold!', index: 0 }];
    const output = exportAndroidColors(palette);
    expect(output).toContain('name="red___bold_"');
  });

  test('ends with newline', () => {
    const output = exportAndroidColors(mockPalette);
    expect(output.endsWith('\n')).toBe(true);
  });
});

describe('exportMaterialColors', () => {
  test('produces valid XML structure', () => {
    const output = exportMaterialColors(mockPalette);
    expect(output).toContain('<?xml version="1.0" encoding="utf-8"?>');
    expect(output).toContain('<resources>');
    expect(output).toContain('</resources>');
  });

  test('assigns material role names', () => {
    const output = exportMaterialColors(mockPalette);
    expect(output).toContain('name="md_primary"');
    expect(output).toContain('name="md_secondary"');
    expect(output).toContain('name="md_tertiary"');
  });

  test('generates on-color variants', () => {
    const output = exportMaterialColors(mockPalette);
    expect(output).toContain('name="md_on_primary"');
    expect(output).toContain('name="md_on_secondary"');
  });

  test('uses white on-color for dark backgrounds', () => {
    const darkPalette = [{ rgb: [20, 20, 20], index: 0 }];
    const output = exportMaterialColors(darkPalette);
    expect(output).toContain('md_on_primary">#FFFFFF');
  });

  test('uses black on-color for light backgrounds', () => {
    const lightPalette = [{ rgb: [240, 240, 240], index: 0 }];
    const output = exportMaterialColors(lightPalette);
    expect(output).toContain('md_on_primary">#000000');
  });

  test('uses custom role for palette items beyond named roles', () => {
    const largePalette = Array.from({ length: 7 }, (_, i) => ({
      rgb: [i * 30, i * 30, i * 30],
      index: i,
    }));
    const output = exportMaterialColors(largePalette);
    expect(output).toContain('name="md_custom_6"');
  });
});
