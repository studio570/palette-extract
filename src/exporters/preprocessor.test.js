/**
 * Cross-exporter consistency tests for CSS preprocessor outputs
 * (SCSS, LESS, Stylus).
 */
const { exportScss } = require('./scss');
const { exportLessVariables } = require('./less');
const { exportStylusVariables } = require('./stylus');

const palette = [
  { name: 'color-0', rgb: [255, 87, 51] },
  { name: 'color-1', rgb: [51, 87, 255] },
  { name: 'color-2', rgb: [51, 255, 87] },
];

const HEX_PATTERN = /^#[0-9a-f]{6}$/;

describe('preprocessor exporters consistency', () => {
  test('all exporters produce the same hex values', () => {
    const scss = exportScss(palette);
    const less = exportLessVariables(palette);
    const stylus = exportStylusVariables(palette);

    const extractHex = str => str.match(/#[0-9a-f]{6}/g) || [];

    const scssHexes = extractHex(scss).sort();
    const lessHexes = extractHex(less).sort();
    const stylusHexes = extractHex(stylus).sort();

    expect(scssHexes).toEqual(lessHexes);
    expect(lessHexes).toEqual(stylusHexes);
  });

  test('all hex values match expected format', () => {
    const scss = exportScss(palette);
    const hexes = scss.match(/#[0-9a-f]{6}/g) || [];
    hexes.forEach(hex => expect(hex).toMatch(HEX_PATTERN));
  });

  test('all exporters include all color names', () => {
    const scss = exportScss(palette);
    const less = exportLessVariables(palette);
    const stylus = exportStylusVariables(palette);

    palette.forEach(({ name }) => {
      const key = name.toLowerCase();
      expect(scss).toContain(key);
      expect(less).toContain(key);
      expect(stylus).toContain(key);
    });
  });

  test('each exporter output ends with a newline', () => {
    expect(exportScss(palette).endsWith('\n')).toBe(true);
    expect(exportLessVariables(palette).endsWith('\n')).toBe(true);
    expect(exportStylusVariables(palette).endsWith('\n')).toBe(true);
  });
});
