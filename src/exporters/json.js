/**
 * Export a color palette as JSON design tokens
 */

const { rgbToHex, rgbToCss } = require('./css');

/**
 * Export palette as a flat JSON object of design tokens
 * @param {number[][]} palette - array of [r,g,b] colors
 * @param {object} options
 * @param {string} [options.prefix='color'] - token name prefix
 * @param {string} [options.format='hex'] - 'hex' or 'rgb'
 * @param {boolean} [options.pretty=true] - pretty-print JSON
 * @returns {string} JSON string
 */
function exportJson(palette, { prefix = 'color', format = 'hex', pretty = true } = {}) {
  const tokens = {};
  palette.forEach((color, i) => {
    const key = `${prefix}-${i + 1}`;
    tokens[key] = {
      value: format === 'rgb' ? rgbToCss(color) : rgbToHex(color),
      type: 'color',
    };
  });
  return JSON.stringify(tokens, null, pretty ? 2 : 0);
}

/**
 * Export palette as a W3C Design Token Community Group format
 * @param {number[][]} palette - array of [r,g,b] colors
 * @param {object} options
 * @param {string} [options.prefix='color'] - token name prefix
 * @returns {string} JSON string
 */
function exportW3cTokens(palette, { prefix = 'color' } = {}) {
  const tokens = {};
  palette.forEach((color, i) => {
    const key = `${prefix}-${i + 1}`;
    tokens[key] = {
      $value: rgbToHex(color),
      $type: 'color',
    };
  });
  return JSON.stringify({ [prefix]: tokens }, null, 2);
}

module.exports = { exportJson, exportW3cTokens };
