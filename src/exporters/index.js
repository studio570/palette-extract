const { exportCss } = require('./css');
const { exportJson, exportW3cTokens } = require('./json');
const { exportScss, exportScssMap } = require('./scss');
const { exportFigmaTokens, exportFigmaStyles } = require('./figma');
const { exportTailwindTheme, exportTailwindJson } = require('./tailwind');
const { exportSvgSwatches, exportSvgGrid } = require('./svg');
const { exportSketchPalette, exportSketchSwatches } = require('./sketchpalette');
const { exportGimpPalette, exportPaintNetPalette } = require('./gimp');

/**
 * Annotate a raw palette array with generated color names
 * @param {Array<[number, number, number]>} palette
 * @returns {Array<{name: string, rgb: [number, number, number]}>}
 */
function annotatePalette(palette) {
  return palette.map((rgb, i) => ({
    name: `color-${i + 1}`,
    rgb,
  }));
}

/**
 * Export an annotated palette to the requested format
 * @param {Array<{name: string, rgb: [number, number, number]}>} annotatedPalette
 * @param {string} format
 * @param {object} [options]
 * @returns {string|Buffer}
 */
function exportPalette(annotatedPalette, format, options = {}) {
  switch (format) {
    case 'css':            return exportCss(annotatedPalette);
    case 'json':           return exportJson(annotatedPalette);
    case 'w3c':            return exportW3cTokens(annotatedPalette);
    case 'scss':           return exportScss(annotatedPalette);
    case 'scss-map':       return exportScssMap(annotatedPalette);
    case 'figma':          return exportFigmaTokens(annotatedPalette);
    case 'figma-styles':   return exportFigmaStyles(annotatedPalette);
    case 'tailwind':       return exportTailwindTheme(annotatedPalette);
    case 'tailwind-json':  return exportTailwindJson(annotatedPalette);
    case 'svg':            return exportSvgSwatches(annotatedPalette);
    case 'svg-grid':       return exportSvgGrid(annotatedPalette);
    case 'sketch':         return exportSketchPalette(annotatedPalette);
    case 'sketch-swatches':return exportSketchSwatches(annotatedPalette);
    case 'gimp':           return exportGimpPalette(annotatedPalette, options);
    case 'paintnet':       return exportPaintNetPalette(annotatedPalette);
    default:
      throw new Error(`Unknown export format: "${format}"`);
  }
}

module.exports = { annotatePalette, exportPalette };
