/**
 * Tailwind CSS config exporter
 * Exports color palettes as Tailwind CSS theme configuration
 */

/**
 * Convert RGB array to hex string
 * @param {number[]} rgb - [r, g, b]
 * @returns {string}
 */
function rgbToHex(rgb) {
  return (
    '#' +
    rgb
      .map((c) => Math.round(c).toString(16).padStart(2, '0'))
      .join('')
  );
}

/**
 * Export palette as a Tailwind CSS theme colors object (JS module)
 * @param {number[][]} palette - array of [r, g, b]
 * @param {string} [colorName='palette'] - base color name in the theme
 * @returns {string}
 */
function exportTailwindTheme(palette, colorName = 'palette') {
  const entries = palette
    .map((rgb, i) => {
      const shade = Math.round(((i + 1) / palette.length) * 900 / 100) * 100 || 50;
      const hex = rgbToHex(rgb);
      return `      ${shade}: '${hex}'`;
    })
    .join(',\n');

  return (
    `/** @type {import('tailwindcss').Config} */\n` +
    `module.exports = {\n` +
    `  theme: {\n` +
    `    extend: {\n` +
    `      colors: {\n` +
    `        ${colorName}: {\n` +
    `${entries}\n` +
    `        }\n` +
    `      }\n` +
    `    }\n` +
    `  }\n` +
    `};\n`
  );
}

/**
 * Export palette as a flat Tailwind-compatible colors object (JSON)
 * @param {number[][]} palette
 * @param {string} [colorName='palette']
 * @returns {string}
 */
function exportTailwindJson(palette, colorName = 'palette') {
  const shades = {};
  palette.forEach((rgb, i) => {
    const shade = Math.round(((i + 1) / palette.length) * 900 / 100) * 100 || 50;
    shades[shade] = rgbToHex(rgb);
  });
  return JSON.stringify({ colors: { [colorName]: shades } }, null, 2) + '\n';
}

module.exports = { rgbToHex, exportTailwindTheme, exportTailwindJson };
