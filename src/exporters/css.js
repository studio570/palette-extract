/**
 * Export a color palette as CSS custom properties (design tokens)
 */

/**
 * Convert an RGB array to a hex string
 * @param {number[]} rgb - [r, g, b] values 0-255
 * @returns {string} hex color string e.g. "#a3b2c1"
 */
function rgbToHex([r, g, b]) {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.round(v).toString(16).padStart(2, '0'))
      .join('')
  );
}

/**
 * Convert an RGB array to an rgb() CSS string
 * @param {number[]} rgb - [r, g, b] values 0-255
 * @returns {string} e.g. "rgb(163, 178, 193)"
 */
function rgbToCss([r, g, b]) {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

/**
 * Export palette as a CSS :root block with custom properties
 * @param {number[][]} palette - array of [r,g,b] colors
 * @param {object} options
 * @param {string} [options.prefix='color'] - variable name prefix
 * @param {string} [options.format='hex'] - 'hex' or 'rgb'
 * @returns {string} CSS string
 */
function exportCss(palette, { prefix = 'color', format = 'hex' } = {}) {
  const lines = [':root {'];
  palette.forEach((color, i) => {
    const value = format === 'rgb' ? rgbToCss(color) : rgbToHex(color);
    lines.push(`  --${prefix}-${i + 1}: ${value};`);
  });
  lines.push('}');
  return lines.join('\n');
}

module.exports = { exportCss, rgbToHex, rgbToCss };
