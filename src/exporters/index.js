/**
 * Exporters index — annotates a palette and dispatches to format exporters
 */

const { exportCss } = require("./css");
const { exportJson, exportW3cTokens } = require("./json");
const { exportScss, exportScssMap } = require("./scss");
const { exportFigmaTokens, exportFigmaStyles } = require("./figma");
const { exportTailwindTheme, exportTailwindJson } = require("./tailwind");
const { exportSvgSwatches, exportSvgGrid } = require("./svg");
const { exportSketchPalette, exportSketchSwatches } = require("./sketchpalette");

/**
 * Annotate a raw palette (array of RGB arrays) with generated names
 * @param {number[][]} palette - array of [r, g, b]
 * @returns {Array<{name: string, rgb: number[]}>}
 */
function annotatePalette(palette) {
  return palette.map((rgb, i) => ({
    name: `color-${i + 1}`,
    rgb,
  }));
}

/**
 * Export an annotated palette to the specified format
 * @param {Array<{name: string, rgb: number[]}>} annotatedPalette
 * @param {string} format
 * @param {object} [options]
 * @returns {string | Buffer}
 */
function exportPalette(annotatedPalette, format, options = {}) {
  switch (format) {
    case "css":           return exportCss(annotatedPalette);
    case "json":          return exportJson(annotatedPalette);
    case "w3c":           return exportW3cTokens(annotatedPalette);
    case "scss":          return exportScss(annotatedPalette);
    case "scss-map":      return exportScssMap(annotatedPalette);
    case "figma":         return exportFigmaTokens(annotatedPalette);
    case "figma-styles":  return exportFigmaStyles(annotatedPalette);
    case "tailwind":      return exportTailwindTheme(annotatedPalette, options.name);
    case "tailwind-json": return exportTailwindJson(annotatedPalette, options.name);
    case "svg":           return exportSvgSwatches(annotatedPalette);
    case "svg-grid":      return exportSvgGrid(annotatedPalette);
    case "sketch":        return exportSketchPalette(annotatedPalette);
    case "sketch-swatches": return exportSketchSwatches(annotatedPalette);
    default:
      throw new Error(`Unknown export format: "${format}"`); 
  }
}

const SUPPORTED_FORMATS = [
  "css", "json", "w3c", "scss", "scss-map",
  "figma", "figma-styles",
  "tailwind", "tailwind-json",
  "svg", "svg-grid",
  "sketch", "sketch-swatches",
];

module.exports = { annotatePalette, exportPalette, SUPPORTED_FORMATS };
