/**
 * Unified exporter interface for palette-extract
 * Supports: css, scss, json, w3c
 */

const { exportCss } = require('./css');
const { exportScss, exportScssMap } = require('./scss');
const { exportJson, exportW3cTokens } = require('./json');

const FORMATS = ['css', 'scss', 'scss-map', 'json', 'w3c'];

/**
 * Export a palette to the specified format string
 * @param {number[][]} palette - array of [r,g,b] colors
 * @param {string} format - one of FORMATS
 * @param {object} options - passed through to the specific exporter
 * @returns {string} formatted output
 */
function exportPalette(palette, format, options = {}) {
  switch (format) {
    case 'css':
      return exportCss(palette, options);
    case 'scss':
      return exportScss(palette, options);
    case 'scss-map':
      return exportScssMap(palette, options);
    case 'json':
      return exportJson(palette, options);
    case 'w3c':
      return exportW3cTokens(palette, options);
    default:
      throw new Error(
        `Unknown format "${format}". Supported formats: ${FORMATS.join(', ')}`
      );
  }
}

module.exports = { exportPalette, FORMATS };
