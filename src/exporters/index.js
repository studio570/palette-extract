/**
 * Unified palette exporter — routes to format-specific exporters
 */

const { exportCss, rgbToHex } = require('./css');
const { exportJson, exportW3cTokens } = require('./json');
const { exportScss, exportScssMap } = require('./scss');
const { exportFigmaTokens, exportFigmaStyles } = require('./figma');
const { exportTailwindTheme, exportTailwindJson } = require('./tailwind');
const { exportSvgSwatches, exportSvgGrid } = require('./svg');
const { exportAse } = require('./ase');

const FORMATS = [
  'css', 'css-vars',
  'json', 'w3c',
  'scss', 'scss-map',
  'figma', 'figma-styles',
  'tailwind', 'tailwind-json',
  'svg', 'svg-grid',
  'ase',
];

/**
 * Annotate palette entries with hex names for exporters that need them
 */
function annotatePalette(palette) {
  return palette.map((color, i) => ({
    ...color,
    name: color.name || `color-${i + 1}`,
    hex: rgbToHex(color.r, color.g, color.b),
  }));
}

/**
 * Export a palette to the specified format.
 * @param {Array<{r,g,b}>} palette
 * @param {string} format
 * @param {object} [options]
 * @returns {string|Buffer}
 */
function exportPalette(palette, format, options = {}) {
  const annotated = annotatePalette(palette);

  switch (format) {
    case 'css':          return exportCss(annotated, options);
    case 'css-vars':     return exportCss(annotated, { ...options, vars: true });
    case 'json':         return exportJson(annotated, options);
    case 'w3c':          return exportW3cTokens(annotated, options);
    case 'scss':         return exportScss(annotated, options);
    case 'scss-map':     return exportScssMap(annotated, options);
    case 'figma':        return exportFigmaTokens(annotated, options);
    case 'figma-styles': return exportFigmaStyles(annotated, options);
    case 'tailwind':     return exportTailwindTheme(annotated, options);
    case 'tailwind-json':return exportTailwindJson(annotated, options);
    case 'svg':          return exportSvgSwatches(annotated, options);
    case 'svg-grid':     return exportSvgGrid(annotated, options);
    case 'ase':          return exportAse(annotated, options.groupName);
    default:
      throw new Error(
        `Unknown format: "${format}". Supported formats: ${FORMATS.join(', ')}`
      );
  }
}

module.exports = { exportPalette, FORMATS, annotatePalette };
