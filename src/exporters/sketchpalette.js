/**
 * Sketch Palette exporter
 * Exports color palettes in .sketchpalette format (JSON-based)
 * Compatible with the Sketch Palette plugin
 */

/**
 * Convert RGB array [r, g, b] (0-255) to Sketch color object (0-1 range)
 * @param {number[]} rgb
 * @returns {object}
 */
function rgbToSketchColor(rgb) {
  const [r, g, b] = rgb;
  return {
    red: r / 255,
    green: g / 255,
    blue: b / 255,
    alpha: 1,
  };
}

/**
 * Export palette as a .sketchpalette file content (v2 format)
 * @param {Array<{name: string, rgb: number[]}>} annotatedPalette
 * @returns {string} JSON string
 */
function exportSketchPalette(annotatedPalette) {
  const colors = annotatedPalette.map(({ rgb }) => rgbToSketchColor(rgb));

  const palette = {
    compatibleVersion: "2.0",
    pluginVersion: "2.2",
    colors,
  };

  return JSON.stringify(palette, null, 2);
}

/**
 * Export palette as a Sketch shared swatches JSON (v1 format)
 * @param {Array<{name: string, rgb: number[]}>} annotatedPalette
 * @returns {string} JSON string
 */
function exportSketchSwatches(annotatedPalette) {
  const swatches = annotatedPalette.map(({ name, rgb }) => ({
    name,
    color: rgbToSketchColor(rgb),
  }));

  const result = {
    compatibleVersion: "1.0",
    pluginVersion: "2.2",
    colors: swatches.map((s) => s.color),
    colorNames: swatches.map((s) => s.name),
  };

  return JSON.stringify(result, null, 2);
}

module.exports = { rgbToSketchColor, exportSketchPalette, exportSketchSwatches };
