/**
 * Central exporter — routes palette to the requested format
 */

const { exportCss, rgbToCss } = require('./css');
const { exportJson, exportW3cTokens } = require('./json');
const { exportScss, exportScssMap } = require('./scss');
const { exportFigmaTokens, exportFigmaStyles } = require('./figma');
const { exportTailwindTheme, exportTailwindJson } = require('./tailwind');

const FORMATS = [
  'css',
  'css-vars',
  'json',
  'w3c',
  'scss',
  'scss-map',
  'figma',
  'figma-styles',
  'tailwind',
  'tailwind-json',
];

/**
 * Export a palette to the given format string.
 * @param {number[][]} palette - array of [r, g, b]
 * @param {string} format
 * @param {object} [options]
 * @param {string} [options.colorName] - base name for color tokens
 * @returns {string}
 */
function exportPalette(palette, format, options = {}) {
  const { colorName = 'palette' } = options;

  switch (format) {
    case 'css':
      return exportCss(palette);
    case 'css-vars':
      return palette.map((rgb, i) => `  --color-${i + 1}: ${rgbToCss(rgb)};`).join('\n');
    case 'json':
      return exportJson(palette);
    case 'w3c':
      return exportW3cTokens(palette);
    case 'scss':
      return exportScss(palette);
    case 'scss-map':
      return exportScssMap(palette);
    case 'figma':
      return exportFigmaTokens(palette);
    case 'figma-styles':
      return exportFigmaStyles(palette);
    case 'tailwind':
      return exportTailwindTheme(palette, colorName);
    case 'tailwind-json':
      return exportTailwindJson(palette, colorName);
    default:
      throw new Error(
        `Unknown format: "${format}". Supported formats: ${FORMATS.join(', ')}`
      );
  }
}

module.exports = { exportPalette, FORMATS };
