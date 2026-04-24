const { exportCss, rgbToHex, rgbToCss } = require('./css');
const { exportScss, exportScssMap } = require('./scss');
const { exportJson, exportW3cTokens } = require('./json');
const { exportPalette, FORMATS } = require('./index');

const PALETTE = [
  [255, 0, 0],
  [0, 128, 64],
  [30, 30, 200],
];

describe('rgbToHex', () => {
  it('converts rgb to hex', () => {
    expect(rgbToHex([255, 0, 0])).toBe('#ff0000');
    expect(rgbToHex([0, 128, 64])).toBe('#008040');
    expect(rgbToHex([30, 30, 200])).toBe('#1e1ec8');
  });

  it('handles black and white', () => {
    expect(rgbToHex([0, 0, 0])).toBe('#000000');
    expect(rgbToHex([255, 255, 255])).toBe('#ffffff');
  });
});

describe('rgbToCss', () => {
  it('converts rgb to css string', () => {
    expect(rgbToCss([255, 0, 0])).toBe('rgb(255, 0, 0)');
    expect(rgbToCss([0, 128, 64])).toBe('rgb(0, 128, 64)');
  });
});

describe('exportCss', () => {
  it('produces a :root block with hex vars by default', () => {
    const result = exportCss(PALETTE);
    expect(result).toContain(':root {');
    expect(result).toContain('--color-1: #ff0000;');
    expect(result).toContain('--color-2: #008040;');
    expect(result).toContain('}');
  });

  it('supports custom prefix and rgb format', () => {
    const result = exportCss(PALETTE, { prefix: 'brand', format: 'rgb' });
    expect(result).toContain('--brand-1: rgb(255, 0, 0);');
  });

  it('produces one variable per palette color', () => {
    const result = exportCss(PALETTE);
    const matches = result.match(/--color-\d+:/g);
    expect(matches).toHaveLength(PALETTE.length);
  });
});

describe('exportScss', () => {
  it('produces SCSS variable lines', () => {
    const result = exportScss(PALETTE);
    expect(result).toContain('$color-1: #ff0000;');
    expect(result).toContain('$color-3: #1e1ec8;');
  });
});

describe('exportScssMap', () => {
  it('produces a SCSS map', () => {
    const result = exportScssMap(PALETTE, { mapName: 'colors' });
    expect(result).toContain('$colors: (');
    expect(result).toContain("'1': #ff0000");
  });
});

describe('exportJson', () => {
  it('produces valid JSON with color tokens', () => {
    const result = exportJson(PALETTE);
    const parsed = JSON.parse(result);
    expect(parsed['color-1'].value).toBe('#ff0000');
    expect(parsed['color-1'].type).toBe('color');
  });
});

describe('exportW3cTokens', () => {
  it('produces W3C token format', () => {
    const result = exportW3cTokens(PALETTE, { prefix: 'brand' });
    const parsed = JSON.parse(result);
    expect(parsed.brand['brand-1'].$value).toBe('#ff0000');
    expect(parsed.brand['brand-1'].$type).toBe('color');
  });
});

describe('exportPalette', () => {
  it('routes to correct exporter', () => {
    expect(exportPalette(PALETTE, 'css')).toContain(':root {');
    expect(exportPalette(PALETTE, 'scss')).toContain('$color-1');
    expect(exportPalette(PALETTE, 'json')).toContain('"color-1"');
  });

  it('throws on unknown format', () => {
    expect(() => exportPalette(PALETTE, 'toml')).toThrow('Unknown format');
  });

  it('exports all supported formats without throwing', () => {
    FORMATS.forEach((fmt) => {
      expect(() => exportPalette(PALETTE, fmt)).not.toThrow();
    });
  });
});
