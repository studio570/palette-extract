/**
 * Tailwind CSS exporter
 * Generates Tailwind-compatible color palette configurations
 */

/**
 * Convert RGB array to hex string
 * @param {number[]} rgb - [r, g, b] values (0-255)
 * @returns {string} Hex color string (e.g. '#a3b4c5')
 */
function rgbToHex([r, g, b]) {
  return '#' + [r, g, b]
    .map(v => Math.round(v).toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Export palette as a Tailwind CSS theme colors object (JS format)
 * Suitable for use inside tailwind.config.js
 * @param {number[][]} palette - Array of [r, g, b] colors
 * @param {string} [name='brand'] - Base name for the color scale
 * @returns {string} JS string for Tailwind theme.colors
 */
function exportTailwindTheme(palette, name = 'brand') {
  const entries = palette.map((color, i) => {
    const stop = i === 0 ? 50 : i * 100;
    return `    ${stop}: '${rgbToHex(color)}'`;
  });

  return [
    `// tailwind.config.js — paste into theme.extend.colors`,
    `const colors = {`,
    `  ${name}: {`,
    ...entries,
    `  }`,
    `};`,
    ``,
    `module.exports = { theme: { extend: { colors } } };`,
  ].join('\n');
}

/**
 * Export palette as a plain JSON object with Tailwind-style numeric keys
 * @param {number[][]} palette - Array of [r, g, b] colors
 * @param {string} [name='brand'] - Base name for the color scale
 * @returns {string} JSON string
 */
function exportTailwindJson(palette, name = 'brand') {
  const scale = {};
  palette.forEach((color, i) => {
    const stop = i === 0 ? 50 : i * 100;
    scale[stop] = rgbToHex(color);
  });

  return JSON.stringify({ [name]: scale }, null, 2);
}

module.exports = { rgbToHex, exportTailwindTheme, exportTailwindJson };
