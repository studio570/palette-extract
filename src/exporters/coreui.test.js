const { rgbToHex, rgbToRgbString, exportBootstrapOverrides, exportCoreUiTokens } = require('./coreui');

const samplePalette = [
  { name: 'Primary', rgb: [30, 100, 200] },
  { name: 'Accent Red', rgb: [220, 50, 60] },
];

describe('rgbToHex', () => {
  test('converts rgb to lowercase hex', () => {
    expect(rgbToHex(30, 100, 200)).toBe('#1e64c8');
  });

  test('pads single digit hex values', () => {
    expect(rgbToHex(0, 0, 0)).toBe('#000000');
    expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
  });
});

describe('rgbToRgbString', () => {
  test('returns comma-separated rgb string', () => {
    expect(rgbToRgbString(30, 100, 200)).toBe('30, 100, 200');
  });
});

describe('exportBootstrapOverrides', () => {
  test('wraps output in :root block', () => {
    const result = exportBootstrapOverrides(samplePalette);
    expect(result.startsWith(':root {')).toBe(true);
    expect(result.endsWith('}')).toBe(true);
  });

  test('emits --bs- prefixed hex variable', () => {
    const result = exportBootstrapOverrides(samplePalette);
    expect(result).toContain('--bs-primary: #1e64c8;');
  });

  test('emits --bs- prefixed rgb variable', () => {
    const result = exportBootstrapOverrides(samplePalette);
    expect(result).toContain('--bs-primary-rgb: 30, 100, 200;');
  });

  test('slugifies multi-word names', () => {
    const result = exportBootstrapOverrides(samplePalette);
    expect(result).toContain('--bs-accent-red:');
    expect(result).toContain('--bs-accent-red-rgb:');
  });
});

describe('exportCoreUiTokens', () => {
  test('includes :root block', () => {
    const result = exportCoreUiTokens(samplePalette);
    expect(result).toContain(':root {');
  });

  test('includes text utility class', () => {
    const result = exportCoreUiTokens(samplePalette);
    expect(result).toContain('.text-primary { color: #1e64c8 !important; }');
  });

  test('includes bg utility class', () => {
    const result = exportCoreUiTokens(samplePalette);
    expect(result).toContain('.bg-primary { background-color: #1e64c8 !important; }');
  });

  test('includes border utility class', () => {
    const result = exportCoreUiTokens(samplePalette);
    expect(result).toContain('.border-accent-red { border-color: #dc323c !important; }');
  });

  test('handles empty palette', () => {
    const result = exportCoreUiTokens([]);
    expect(result).toContain(':root {');
    expect(result).not.toContain('--bs-');
  });
});
