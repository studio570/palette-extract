const { rgbToHex, exportFontPaletteValues, exportCssCustomProperties } = require('./opentype');

const mockPalette = [
  { name: 'primary', rgb: [255, 0, 0] },
  { name: 'secondary', rgb: [0, 128, 255] },
  { name: 'accent', rgb: [16, 185, 129] },
];

describe('rgbToHex', () => {
  test('converts pure red', () => {
    expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
  });

  test('converts mid-range color', () => {
    expect(rgbToHex(0, 128, 255)).toBe('#0080ff');
  });

  test('converts zero (black)', () => {
    expect(rgbToHex(0, 0, 0)).toBe('#000000');
  });

  test('converts white', () => {
    expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
  });
});

describe('exportFontPaletteValues', () => {
  test('produces @font-palette-values block', () => {
    const result = exportFontPaletteValues(mockPalette);
    expect(result).toContain('@font-palette-values --custom-palette');
    expect(result).toContain('font-family: MyFont');
    expect(result).toContain('base-palette: 0');
  });

  test('includes override-colors for each entry', () => {
    const result = exportFontPaletteValues(mockPalette);
    expect(result).toContain('override-colors: 0 #ff0000');
    expect(result).toContain('override-colors: 1 #0080ff');
    expect(result).toContain('override-colors: 2 #10b981');
  });

  test('respects custom fontFamily and paletteName options', () => {
    const result = exportFontPaletteValues(mockPalette, {
      fontFamily: 'Inter',
      paletteName: '--brand-palette',
    });
    expect(result).toContain('@font-palette-values --brand-palette');
    expect(result).toContain('font-family: Inter');
  });

  test('handles single color palette', () => {
    const result = exportFontPaletteValues([{ name: 'solo', rgb: [10, 20, 30] }]);
    expect(result).toContain('override-colors: 0 #0a141e');
  });
});

describe('exportCssCustomProperties', () => {
  test('wraps variables in :root by default', () => {
    const result = exportCssCustomProperties(mockPalette);
    expect(result.startsWith(':root {')).toBe(true);
    expect(result.endsWith('}')).toBe(true);
  });

  test('uses default prefix "color"', () => {
    const result = exportCssCustomProperties(mockPalette);
    expect(result).toContain('--color-primary: #ff0000');
    expect(result).toContain('--color-secondary: #0080ff');
  });

  test('respects custom selector and prefix', () => {
    const result = exportCssCustomProperties(mockPalette, {
      selector: '.theme',
      prefix: 'palette',
    });
    expect(result).toContain('.theme {');
    expect(result).toContain('--palette-primary: #ff0000');
  });
});
