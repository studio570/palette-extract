const { rgbToHex, exportSvgSwatches, exportSvgGrid } = require('./svg');

describe('rgbToHex', () => {
  test('converts pure red', () => {
    expect(rgbToHex([255, 0, 0])).toBe('#ff0000');
  });

  test('converts pure green', () => {
    expect(rgbToHex([0, 255, 0])).toBe('#00ff00');
  });

  test('converts pure blue', () => {
    expect(rgbToHex([0, 0, 255])).toBe('#0000ff');
  });

  test('converts mixed color with padding', () => {
    expect(rgbToHex([10, 20, 200])).toBe('#0a14c8');
  });

  test('converts white', () => {
    expect(rgbToHex([255, 255, 255])).toBe('#ffffff');
  });
});

const samplePalette = [
  [255, 0, 0],
  [0, 255, 0],
  [0, 0, 255],
  [255, 255, 0],
];

describe('exportSvgSwatches', () => {
  test('returns valid SVG string', () => {
    const svg = exportSvgSwatches(samplePalette);
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
  });

  test('includes all palette colors', () => {
    const svg = exportSvgSwatches(samplePalette);
    expect(svg).toContain('#ff0000');
    expect(svg).toContain('#00ff00');
    expect(svg).toContain('#0000ff');
    expect(svg).toContain('#ffff00');
  });

  test('total width equals palette length times swatch width', () => {
    const svg = exportSvgSwatches(samplePalette, { swatchWidth: 50 });
    expect(svg).toContain('width="200"');
  });

  test('includes labels by default', () => {
    const svg = exportSvgSwatches(samplePalette);
    expect(svg).toContain('<text');
    expect(svg).toContain('monospace');
  });

  test('omits labels when showLabels is false', () => {
    const svg = exportSvgSwatches(samplePalette, { showLabels: false });
    expect(svg).not.toContain('<text');
  });

  test('height excludes label area when showLabels is false', () => {
    const svg = exportSvgSwatches(samplePalette, { swatchHeight: 100, showLabels: false });
    expect(svg).toContain('height="100"');
  });
});

describe('exportSvgGrid', () => {
  test('returns valid SVG string', () => {
    const svg = exportSvgGrid(samplePalette);
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
  });

  test('includes all palette colors', () => {
    const svg = exportSvgGrid(samplePalette);
    expect(svg).toContain('#ff0000');
    expect(svg).toContain('#ffff00');
  });

  test('applies rounded corners via rx attribute', () => {
    const svg = exportSvgGrid(samplePalette);
    expect(svg).toContain('rx="4"');
  });

  test('respects column count for layout', () => {
    const svg = exportSvgGrid(samplePalette, { columns: 2, swatchSize: 80, gap: 0 });
    // 2 columns, swatchSize 80, gap 0 => width = 2*80-0 = 160
    expect(svg).toContain('width="160"');
  });
});
