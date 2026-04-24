/**
 * Figma-compatible design token exporter
 * Exports palette as a Figma plugin-compatible JSON structure
 */

/**
 * Convert RGB array to Figma RGBA object (0-1 range)
 * @param {number[]} rgb - [r, g, b] values 0-255
 * @returns {{ r: number, g: number, b: number, a: number }}
 */
function rgbToFigmaColor(rgb) {
  return {
    r: parseFloat((rgb[0] / 255).toFixed(4)),
    g: parseFloat((rgb[1] / 255).toFixed(4)),
    b: parseFloat((rgb[2] / 255).toFixed(4)),
    a: 1,
  };
}

/**
 * Export palette as Figma plugin-compatible JSON
 * @param {number[][]} palette - array of [r, g, b] colors
 * @param {string} [collectionName='Palette'] - name for the variable collection
 * @returns {string} JSON string
 */
function exportFigmaTokens(palette, collectionName = 'Palette') {
  const variables = palette.map((rgb, index) => ({
    name: `color-${index + 1}`,
    resolvedType: 'COLOR',
    valuesByMode: {
      default: rgbToFigmaColor(rgb),
    },
  }));

  const output = {
    version: '1.0',
    collections: [
      {
        name: collectionName,
        modes: ['default'],
        variables,
      },
    ],
  };

  return JSON.stringify(output, null, 2);
}

/**
 * Export palette as a flat Figma styles JSON (legacy format)
 * @param {number[][]} palette - array of [r, g, b] colors
 * @returns {string} JSON string
 */
function exportFigmaStyles(palette) {
  const styles = {};

  palette.forEach((rgb, index) => {
    const key = `color-${index + 1}`;
    styles[key] = {
      type: 'SOLID',
      color: rgbToFigmaColor(rgb),
    };
  });

  return JSON.stringify({ paints: styles }, null, 2);
}

module.exports = { rgbToFigmaColor, exportFigmaTokens, exportFigmaStyles };
