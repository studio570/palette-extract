/**
 * Central palette exporter — routes to format-specific exporters
 */
const { exportCss } = require('./css');
const { exportJson, exportW3cTokens } = require('./json');
const { exportScss, exportScssMap } = require('./scss');
const { exportFigmaTokens, exportFigmaStyles } = require('./figma');
const { exportTailwindTheme, exportTailwindJson } = require('./tailwind');
const { exportSvgSwatches, exportSvgGrid } = require('./svg');

const FORMATS = [
  'css',
  'json',
  'w3c',
  'scss',
  'scss-map',
  'figma',
  'figma-styles',
  'tailwind',
  'tailwind-json',
  'svg',
  'svg-grid',
];

/**
 * Export a palette to the requested format string
 * @param {number[][]} palette - Array of [r, g, b] colors
 * @param {string} format - One of the supported format keys
 * @param {object} options - Format-specific options
 * @returns {string} Formatted output
 */
function exportPalette(palette, format = 'css', options = {}) {
  switch (format) {
    case 'css':
      return exportCss(palette, options);
    case 'json':
      return exportJson(palette, options);
    case 'w3c':
      return exportW3cTokens(palette, options);
    case 'scss':
      return exportScss(palette, options);
    case 'scss-map':
      return exportScssMap(palette, options);
    case 'figma':
      return exportFigmaTokens(palette, options);
    case 'figma-styles':
      return exportFigmaStyles(palette, options);
    case 'tailwind':
      return exportTailwindTheme(palette, options);
    case 'tailwind-json':
      return exportTailwindJson(palette, options);
    case 'svg':
      return exportSvgSwatches(palette, options);
    case 'svg-grid':
      return exportSvgGrid(palette, options);
    default:
      throw new Error(
        `Unknown format "${format}". Supported formats: ${FORMATS.join(', ')}`
      );
  }
}

module.exports = { exportPalette, FORMATS };
