const { rgbToHex, toStylusIdent, exportStylusVariables, exportStylusHash } = require('./stylus');

const palette = [
  { name: 'primary', rgb: [30, 144, 255] },
  { name: 'secondary', rgb: [255, 99, 71] },
  { name: 'accent', rgb: [50, 205, 50] },
];

describe('rgbToHex', () => {
  test('converts dodger blue', () => {
    expect(rgbToHex([30, 144, 255])).toBe('#1e90ff');
  });

  test('pads single-digit hex values', () => {
    expect(rgbToHex([0, 0, 15])).toBe('#00000f');
  });
});

describe('toStylusIdent', () => {
  test('lowercases names', () => {
    expect(toStylusIdent('Primary')).toBe('primary');
  });

  test('replaces spaces with dashes', () => {
    expect(toStylusIdent('my color')).toBe('my-color');
  });

  test('replaces special chars with dashes', () => {
    expect(toStylusIdent('color@1!')).toBe('color-1-');
  });
});

describe('exportStylusVariables', () => {
  test('produces Stylus variable assignments', () => {
    const output = exportStylusVariables(palette);
    expect(output).toContain('primary = #1e90ff');
    expect(output).toContain('secondary = #ff6347');
    expect(output).toContain('accent = #32cd32');
  });

  test('ends with newline', () => {
    const output = exportStylusVariables(palette);
    expect(output.endsWith('\n')).toBe(true);
  });

  test('each entry on its own line', () => {
    const output = exportStylusVariables(palette);
    const lines = output.trim().split('\n');
    expect(lines).toHaveLength(3);
  });
});

describe('exportStylusHash', () => {
  test('wraps entries in a hash object', () => {
    const output = exportStylusHash(palette);
    expect(output).toContain('palette = {');
    expect(output).toContain('  primary: #1e90ff');
    expect(output).toContain('  secondary: #ff6347');
    expect(output).toContain('  accent: #32cd32');
    expect(output.trim().endsWith('}')).toBe(true);
  });

  test('uses custom hash name', () => {
    const output = exportStylusHash(palette, 'colors');
    expect(output).toContain('colors = {');
  });

  test('defaults hash name to palette', () => {
    const output = exportStylusHash(palette);
    expect(output).toContain('palette = {');
  });
});
