/**
 * GIMP Palette (.gpl) exporter
 * Format: https://gitlab.gnome.org/GNOME/gimp/-/blob/master/devel-docs/gpl.txt
 */

/**
 * Pad a number string to a fixed width
 * @param {number} n
 * @param {number} width
 * @returns {string}
 */
function padNum(n, width = 3) {
  return String(n).padStart(width, ' ');
}

/**
 * Export palette as a GIMP .gpl file string
 * @param {Array<{name: string, rgb: [number, number, number]}>} annotatedPalette
 * @param {object} options
 * @param {string} [options.paletteName='Palette Extract']
 * @param {number} [options.columns=8]
 * @returns {string}
 */
function exportGimpPalette(annotatedPalette, options = {}) {
  const { paletteName = 'Palette Extract', columns = 8 } = options;

  const lines = [
    'GIMP Palette',
    `Name: ${paletteName}`,
    `Columns: ${columns}`,
    '#',
  ];

  for (const { name, rgb } of annotatedPalette) {
    const [r, g, b] = rgb;
    lines.push(`${padNum(r)} ${padNum(g)} ${padNum(b)}\t${name}`);
  }

  return lines.join('\n') + '\n';
}

/**
 * Export palette as a Paint.NET .txt palette file string
 * @param {Array<{name: string, rgb: [number, number, number]}>} annotatedPalette
 * @returns {string}
 */
function exportPaintNetPalette(annotatedPalette) {
  const lines = ['; Paint.NET Palette File'];

  for (const { rgb } of annotatedPalette) {
    const [r, g, b] = rgb;
    const hex = [
      'FF',
      r.toString(16).padStart(2, '0').toUpperCase(),
      g.toString(16).padStart(2, '0').toUpperCase(),
      b.toString(16).padStart(2, '0').toUpperCase(),
    ].join('');
    lines.push(`FF${hex.slice(2)}`);
  }

  return lines.join('\n') + '\n';
}

module.exports = { padNum, exportGimpPalette, exportPaintNetPalette };
