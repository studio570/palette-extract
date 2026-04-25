const { rgbToHex, exportLessVariables, exportLessMap } = require('./less');

const palette = [
  { name: 'color-1', rgb: [255, 0, 0] },
  { name: 'color-2', rgb: [0, 128, 0] },
  { name: 'color-3', rgb: [0, 0, 255] },
];

describe('rgbToHex', () => {
  test('converts red correctly', () => {
    expect(rgbToHex([255, 0, 0])).toBe('#ff0000');
  });

  test('converts green correctly', () => {
    expect(rgbToHex([0, 128, 0])).toBe('#008000');
  });

  test('converts black correctly', () => {
    expect(rgbToHex([0, 0, 0])).toBe('#000000');
  });

  test('converts white correctly', () => {
    expect(rgbToHex([255, 255, 255])).toBe('#ffffff');
  });
});

describe('exportLessVariables', () => {
  test('produces LESS variable declarations', () => {
    const output = exportLessVariables(palette);
    expect(output).toContain('@color-1: #ff0000;');
    expect(output).toContain('@color-2: #008000;');
    expect(output).toContain('@color-3: #0000ff;');
  });

  test('ends with newline', () => {
    const output = exportLessVariables(palette);
    expect(output.endsWith('\n')).toBe(true);
  });

  test('sanitizes special characters in names', () => {
    const p = [{ name: 'My Color!', rgb: [10, 20, 30] }];
    const output = exportLessVariables(p);
    expect(output).toContain('@my-color-:');
  });
});

describe('exportLessMap', () => {
  test('produces a LESS detached ruleset block', () => {
    const output = exportLessMap(palette);
    expect(output).toContain('#palette {');
    expect(output).toContain('  @color-1: #ff0000;');
    expect(output).toContain('  @color-2: #008000;');
    expect(output).toContain('  @color-3: #0000ff;');
    expect(output.trim().endsWith('}')).toBe(true);
  });

  test('uses custom map name', () => {
    const output = exportLessMap(palette, 'brand');
    expect(output).toContain('#brand {');
  });

  test('defaults map name to palette', () => {
    const output = exportLessMap(palette);
    expect(output).toContain('#palette {');
  });
});
