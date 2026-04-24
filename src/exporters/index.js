const { exportCss, rgbToHex } = require('./css');
const { exportJson, exportW3cTokens } = require('./json');
const { exportScss, exportScssMap } = require('./scss');
const { exportFigmaTokens, exportFigmaStyles } = require('./figma');

/**
 * Export a palette in the specified format
 * @param {number[][]} palette - array of [r, g, b] colors
 * @param {string} format - output format identifier
 * @param {object} [options] - format-specific options
 * @returns {string} formatted output string
 */
function exportPalette(palette, format, options = {}) {
  switch (format) {
    case 'css':
      return exportCss(palette);
    case 'css-hex':
      return exportCss(palette, { hex: true });
    case 'json':
      return exportJson(palette);
    case 'w3c':
      return exportW3cTokens(palette);
    case 'scss':
      return exportScss(palette);
    case 'scss-map':
      return exportScssMap(palette);
    case 'figma':
      return exportFigmaTokens(palette, options.collectionName);
    case 'figma-styles':
      return exportFigmaStyles(palette);
    default:
      throw new Error(
        `Unknown format: "${format}". Supported formats: css, css-hex, json, w3c, scss, scss-map, figma, figma-styles`
      );
  }
}

/**
 * List of all supported export format identifiers
 */
const SUPPORTED_FORMATS = [
  'css',
  'css-hex',
  'json',
  'w3c',
  'scss',
  'scss-map',
  'figma',
  'figma-styles',
];

module.exports = { exportPalette, SUPPORTED_FORMATS, rgbToHex };
