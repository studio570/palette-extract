/**
 * SVG palette swatch exporter
 * Generates an SVG file with color swatches from a palette
 */

/**
 * Convert RGB array to hex string
 * @param {number[]} rgb - [r, g, b]
 * @returns {string}
 */
function rgbToHex([r, g, b]) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

/**
 * Export palette as an SVG swatch strip
 * @param {number[][]} palette - Array of [r, g, b] colors
 * @param {object} options
 * @param {number} options.swatchWidth - Width of each swatch (default: 100)
 * @param {number} options.swatchHeight - Height of each swatch (default: 100)
 * @param {boolean} options.showLabels - Whether to show hex labels (default: true)
 * @returns {string} SVG markup
 */
function exportSvgSwatches(palette, options = {}) {
  const {
    swatchWidth = 100,
    swatchHeight = 100,
    showLabels = true,
  } = options;

  const labelHeight = showLabels ? 24 : 0;
  const totalWidth = palette.length * swatchWidth;
  const totalHeight = swatchHeight + labelHeight;

  const swatches = palette.map((color, i) => {
    const hex = rgbToHex(color);
    const x = i * swatchWidth;
    const rect = `<rect x="${x}" y="0" width="${swatchWidth}" height="${swatchHeight}" fill="${hex}" />`;
    const label = showLabels
      ? `<text x="${x + swatchWidth / 2}" y="${swatchHeight + 16}" text-anchor="middle" font-family="monospace" font-size="11" fill="#333">${hex}</text>`
      : '';
    return rect + (label ? '\n    ' + label : '');
  }).join('\n    ');

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}">`,
    `  <g>`,
    `    ${swatches}`,
    `  </g>`,
    `</svg>`,
  ].join('\n');
}

/**
 * Export palette as an SVG grid of swatches
 * @param {number[][]} palette - Array of [r, g, b] colors
 * @param {object} options
 * @param {number} options.columns - Number of columns (default: 4)
 * @param {number} options.swatchSize - Size of each swatch (default: 80)
 * @param {number} options.gap - Gap between swatches (default: 8)
 * @returns {string} SVG markup
 */
function exportSvgGrid(palette, options = {}) {
  const { columns = 4, swatchSize = 80, gap = 8 } = options;
  const rows = Math.ceil(palette.length / columns);
  const cellSize = swatchSize + gap;
  const totalWidth = columns * cellSize - gap;
  const totalHeight = rows * cellSize - gap;

  const swatches = palette.map((color, i) => {
    const hex = rgbToHex(color);
    const col = i % columns;
    const row = Math.floor(i / columns);
    const x = col * cellSize;
    const y = row * cellSize;
    return `<rect x="${x}" y="${y}" width="${swatchSize}" height="${swatchSize}" fill="${hex}" rx="4" />`;
  }).join('\n    ');

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}">`,
    `  <g>`,
    `    ${swatches}`,
    `  </g>`,
    `</svg>`,
  ].join('\n');
}

module.exports = { rgbToHex, exportSvgSwatches, exportSvgGrid };
