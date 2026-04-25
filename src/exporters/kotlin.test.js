const { rgbToKotlinHex, toScreamingSnake, exportComposeColors, exportComposeColorScheme } = require('./kotlin');

describe('rgbToKotlinHex', () => {
  test('converts pure red', () => {
    expect(rgbToKotlinHex([255, 0, 0])).toBe('0xFFFF0000');
  });

  test('converts pure green', () => {
    expect(rgbToKotlinHex([0, 255, 0])).toBe('0xFF00FF00');
  });

  test('converts pure blue', () => {
    expect(rgbToKotlinHex([0, 0, 255])).toBe('0xFF0000FF');
  });

  test('converts black', () => {
    expect(rgbToKotlinHex([0, 0, 0])).toBe('0xFF000000');
  });

  test('converts white', () => {
    expect(rgbToKotlinHex([255, 255, 255])).toBe('0xFFFFFFFF');
  });
});

describe('toScreamingSnake', () => {
  test('converts kebab-case', () => {
    expect(toScreamingSnake('color-primary')).toBe('COLOR_PRIMARY');
  });

  test('converts single word', () => {
    expect(toScreamingSnake('accent')).toBe('ACCENT');
  });

  test('uppercases all letters', () => {
    expect(toScreamingSnake('color-0')).toBe('COLOR_0');
  });
});

const mockPalette = [
  { name: 'color-0', rgb: [255, 0, 0] },
  { name: 'color-1', rgb: [0, 0, 255] },
];

describe('exportComposeColors', () => {
  test('includes Compose Color import', () => {
    const result = exportComposeColors(mockPalette);
    expect(result).toContain('import androidx.compose.ui.graphics.Color');
  });

  test('wraps in object with default name', () => {
    const result = exportComposeColors(mockPalette);
    expect(result).toContain('object PaletteColors {');
  });

  test('uses custom object name', () => {
    const result = exportComposeColors(mockPalette, 'AppColors');
    expect(result).toContain('object AppColors {');
  });

  test('generates val declarations', () => {
    const result = exportComposeColors(mockPalette);
    expect(result).toContain('val COLOR_0 = Color(0xFFFF0000)');
    expect(result).toContain('val COLOR_1 = Color(0xFF0000FF)');
  });

  test('ends with newline', () => {
    expect(exportComposeColors(mockPalette).endsWith('\n')).toBe(true);
  });
});

describe('exportComposeColorScheme', () => {
  test('generates data class', () => {
    const result = exportComposeColorScheme(mockPalette);
    expect(result).toContain('data class ColorPalette(');
  });

  test('uses camelCase property names', () => {
    const palette = [{ name: 'primary-color', rgb: [100, 150, 200] }];
    const result = exportComposeColorScheme(palette);
    expect(result).toContain('val primaryColor');
  });

  test('includes default Color values', () => {
    const result = exportComposeColorScheme(mockPalette);
    expect(result).toContain('Color(0xFFFF0000)');
  });
});
