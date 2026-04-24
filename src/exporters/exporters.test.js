const { exportPalette, FORMATS } = require('./index');

const palette = [
  [255, 87, 51],
  [51, 87, 255],
  [87, 255, 51],
  [255, 255, 51],
];

describe('FORMATS', () => {
  test('is an array of strings', () => {
    expect(Array.isArray(FORMATS)).toBe(true);
    FORMATS.forEach(f => expect(typeof f).toBe('string'));
  });

  test('includes svg and svg-grid', () => {
    expect(FORMATS).toContain('svg');
    expect(FORMATS).toContain('svg-grid');
  });

  test('includes all legacy formats', () => {
    ['css', 'json', 'w3c', 'scss', 'figma', 'tailwind'].forEach(f => {
      expect(FORMATS).toContain(f);
    });
  });
});

describe('exportPalette', () => {
  test('exports css format', () => {
    const out = exportPalette(palette, 'css');
    expect(out).toContain('--color-');
  });

  test('exports json format', () => {
    const out = exportPalette(palette, 'json');
    const parsed = JSON.parse(out);
    expect(parsed).toHaveProperty('colors');
  });

  test('exports w3c format', () => {
    const out = exportPalette(palette, 'w3c');
    const parsed = JSON.parse(out);
    expect(parsed).toHaveProperty('palette');
  });

  test('exports scss format', () => {
    const out = exportPalette(palette, 'scss');
    expect(out).toContain('$color-');
  });

  test('exports scss-map format', () => {
    const out = exportPalette(palette, 'scss-map');
    expect(out).toContain('$palette');
  });

  test('exports figma format', () => {
    const out = exportPalette(palette, 'figma');
    const parsed = JSON.parse(out);
    expect(parsed).toHaveProperty('colors');
  });

  test('exports tailwind format', () => {
    const out = exportPalette(palette, 'tailwind');
    expect(out).toContain('palette');
  });

  test('exports svg format', () => {
    const out = exportPalette(palette, 'svg');
    expect(out).toContain('<svg');
    expect(out).toContain('</svg>');
  });

  test('exports svg-grid format', () => {
    const out = exportPalette(palette, 'svg-grid');
    expect(out).toContain('<svg');
    expect(out).toContain('rx="4"');
  });

  test('passes options to svg exporter', () => {
    const out = exportPalette(palette, 'svg', { showLabels: false });
    expect(out).not.toContain('<text');
  });

  test('throws on unknown format', () => {
    expect(() => exportPalette(palette, 'unknown-xyz')).toThrow('Unknown format');
  });

  test('defaults to css when no format given', () => {
    const out = exportPalette(palette);
    expect(out).toContain('--color-');
  });
});
