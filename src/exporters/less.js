/**
 * Export palette as LESS variables or a LESS map (mixin).
 */

/**
 * Convert [r, g, b] to hex string.
 * @param {number[]} rgb
 * @returns {string}
 */
function rgbToHex([r, g, b]) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

/**
 * Export palette as LESS variable declarations.
 * @param {Array<{name: string, rgb: number[]}>} annotated
 * @returns {string}
 */
function exportLessVariables(annotated) {
  const lines = annotated.map(({ name, rgb }) => {
    const varName = `@${name.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase()}`;
    return `${varName}: ${rgbToHex(rgb)};`;
  });
  return lines.join('\n') + '\n';
}

/**
 * Export palette as a LESS mixin map using a detached ruleset pattern.
 * @param {Array<{name: string, rgb: number[]}>} annotated
 * @param {string} [mapName='palette']
 * @returns {string}
 */
function exportLessMap(annotated, mapName = 'palette') {
  const entries = annotated.map(({ name, rgb }) => {
    const key = name.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
    return `  @${key}: ${rgbToHex(rgb)};`;
  });
  return `#${mapName} {\n${entries.join('\n')}\n}\n`;
}

module.exports = { rgbToHex, exportLessVariables, exportLessMap };
