const { padNum, exportGimpPalette, exportPaintNetPalette } = require('./gimp');

const mockPalette = [
  { name: 'color-1', rgb: [255, 0, 0] },
  { name: 'color-2', rgb: [0, 128, 64] },
  { name: 'color-3', rgb: [10, 20, 200] },
];

describe('padNum', () => {
  it('pads single digit to width 3', () => {
    expect(padNum(5)).toBe('  5');
  });

  it('pads two digit number to width 3', () => {
    expect(padNum(42)).toBe(' 42');
  });

  it('does not truncate three digit number', () => {
    expect(padNum(255)).toBe('255');
  });

  it('respects custom width', () => {
    expect(padNum(7, 5)).toBe('    7');
  });
});

describe('exportGimpPalette', () => {
  it('starts with GIMP Palette header', () => {
    const result = exportGimpPalette(mockPalette);
    expect(result.startsWith('GIMP Palette\n')).toBe(true);
  });

  it('includes default palette name', () => {
    const result = exportGimpPalette(mockPalette);
    expect(result).toContain('Name: Palette Extract');
  });

  it('uses custom palette name', () => {
    const result = exportGimpPalette(mockPalette, { paletteName: 'My Theme' });
    expect(result).toContain('Name: My Theme');
  });

  it('includes default columns value', () => {
    const result = exportGimpPalette(mockPalette);
    expect(result).toContain('Columns: 8');
  });

  it('uses custom columns value', () => {
    const result = exportGimpPalette(mockPalette, { columns: 4 });
    expect(result).toContain('Columns: 4');
  });

  it('includes color entries with correct RGB values', () => {
    const result = exportGimpPalette(mockPalette);
    expect(result).toContain('255   0   0\tcolor-1');
    expect(result).toContain('  0 128  64\tcolor-2');
    expect(result).toContain(' 10  20 200\tcolor-3');
  });

  it('ends with a newline', () => {
    const result = exportGimpPalette(mockPalette);
    expect(result.endsWith('\n')).toBe(true);
  });
});

describe('exportPaintNetPalette', () => {
  it('starts with Paint.NET comment header', () => {
    const result = exportPaintNetPalette(mockPalette);
    expect(result.startsWith('; Paint.NET Palette File\n')).toBe(true);
  });

  it('outputs correct hex entries', () => {
    const result = exportPaintNetPalette(mockPalette);
    expect(result).toContain('FFFF0000');
    expect(result).toContain('FF008040');
    expect(result).toContain('FF0A14C8');
  });

  it('ends with a newline', () => {
    const result = exportPaintNetPalette(mockPalette);
    expect(result.endsWith('\n')).toBe(true);
  });
});
