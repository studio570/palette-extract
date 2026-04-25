/**
 * Export a color palette as SCSS variables
 */

const { rgbToHex, rgbToCss } = require('./css');

/**
 * Resolve a color value based on the format option
 * @param {number[]} color - [r,g,b] color
 * @param {string} format - 'hex' or 'rgb'
 * @returns {string} formatted color string
 */
function resolveColorValue(color, format) {
  return format === 'rgb' ? rgbToCss(color) : rgbToHex(color);
}

/**
 * Export palette as SCSS variable declarations
 * @param {number[][]} palette - array of [r,g,b] colors
 * @param {object} options
 * @param {string} [options.prefix='color'] - variable name prefix
 * @param {string} [options.format='hex'] - 'hex' or 'rgb'
 * @returns {string} SCSS string
 */
function exportScss(palette, { prefix = 'color', format = 'hex' } = {}) {
  return palette
    .map((color, i) => {
      const value = resolveColorValue(color, format);
      return `$${prefix}-${i + 1}: ${value};`;
    })
    .join('\n');
}

/**
 * Export palette as a SCSS map
 * @param {number[][]} palette - array of [r,g,b] colors
 * @param {object} options
 * @param {string} [options.mapName='palette'] - SCSS map variable name
 * @param {string} [options.format='hex'] - 'hex' or 'rgb'
 * @returns {string} SCSS string
 */
function exportScssMap(palette, { mapName = 'palette', format = 'hex' } = {}) {
  const entries = palette.map((color, i) => {
    const value = resolveColorValue(color, format);
    return `  '${i + 1}': ${value}`;
  });
  return `$${mapName}: (\n${entries.join(',\n')}\n);`;
}

module.exports = { exportScss, exportScssMap };
